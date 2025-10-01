import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Plus, Link as LinkIcon, Heart, BarChart3, Users, Clock } from 'lucide-react';
import { PlatformKey, CATEGORIES, PLATFORMS } from '@/types/content';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/providers/AuthProvider';

const createPostSchema = z.object({
  subtype: z.enum(['thread', 'poll']).default('thread'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  body: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  category: z.string().min(1, 'Category is required'),
  price: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  links: z.array(z.string().url('Invalid URL')).max(10, 'Max 10 links'),
  // Poll-specific fields
  pollQuestion: z.string().optional(),
  pollOptions: z.array(z.string().min(1, 'Option cannot be empty')).optional(),
  pollDurationDays: z.number().min(1).max(30).optional(),
}).refine((data) => {
  if (data.subtype === 'poll') {
    return data.pollQuestion && data.pollQuestion.trim().length > 0 &&
           data.pollOptions && data.pollOptions.length >= 2 && data.pollOptions.length <= 10;
  }
  return true;
}, {
  message: 'Polls must have a question and 2-10 options',
  path: ['pollQuestion'],
});

type CreatePostForm = z.infer<typeof createPostSchema>;

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: () => void;
  // COMPOSER ROUTING - Add initial category support
  initialCategory?: string;
  initialSubtype?: 'thread' | 'poll';
}

export function CreatePostModal({ open, onOpenChange, onPostCreated, initialCategory, initialSubtype }: CreatePostModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformKey[]>([]);
  const [links, setLinks] = useState<string[]>(['']);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      subtype: initialSubtype || 'thread',
      title: '',
      body: '',
      // COMPOSER ROUTING - Use initialCategory if provided, otherwise default to General
      category: initialCategory || 'General',
      price: '',
      platforms: [],
      links: [],
      pollQuestion: '',
      pollOptions: [],
      pollDurationDays: 7,
    },
  });

  const currentSubtype = form.watch('subtype');

  // COMPOSER ROUTING - Sync initialCategory prop changes into form when modal opens
  useEffect(() => {
    if (!open) return;
    const nextCategory = initialCategory || 'General';
    if (form.getValues('category') !== nextCategory) {
      form.setValue('category', nextCategory, { shouldDirty: false, shouldValidate: true });
    }
  }, [initialCategory, open, form]);

  const handlePlatformToggle = (platform: PlatformKey) => {
    setSelectedPlatforms(prev => {
      const updated = prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform];
      form.setValue('platforms', updated);
      return updated;
    });
  };

  const handleLinkChange = (index: number, value: string) => {
    const updated = [...links];
    updated[index] = value;
    setLinks(updated);
    
    const validLinks = updated.filter(link => link.trim() && isValidUrl(link));
    form.setValue('links', validLinks);
  };

  const addLink = () => {
    if (links.length < 10) {
      setLinks([...links, '']);
    }
  };

  const removeLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    
    const validLinks = updated.filter(link => link.trim() && isValidUrl(link));
    form.setValue('links', validLinks);
  };

  // Upload images to Supabase Storage using signed URLs
  const uploadImages = async (files: File[]): Promise<string[]> => {
    // Request signed upload URLs from server
    const response = await apiRequest('POST', '/api/storage/sign-uploads', {
      files: files.map(f => ({ 
        name: f.name, 
        type: f.type, 
        size: f.size 
      })),
    });
    const { targets } = await response.json();
    
    if (targets.length !== files.length) {
      throw new Error('Server returned incorrect number of upload targets');
    }
    
    // Upload each file using its signed URL
    const publicUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const { data, error } = await supabase.storage
        .from('post-images')
        .uploadToSignedUrl(targets[i].path, targets[i].token, files[i]);
      
      if (error) {
        throw new Error(`Upload failed for ${files[i].name}: ${error.message}`);
      }
      
      publicUrls.push(targets[i].publicUrl);
    }
    
    return publicUrls;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];

    for (const file of files) {
      // Validate file type
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
        toast({
          title: 'Invalid file type',
          description: 'Only jpg, png, webp, and gif files are allowed.',
          variant: 'destructive',
        });
        continue;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Image is too large (max 10MB)',
          description: 'Try a smaller file.',
          variant: 'destructive',
        });
        continue;
      }

      validFiles.push(file);
    }

    // Check total count (max 5 images)
    if (imageFiles.length + validFiles.length > 5) {
      toast({
        title: 'Too many images',
        description: 'Maximum 5 images allowed per post.',
        variant: 'destructive',
      });
      return;
    }

    setImageFiles(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Poll option management
  const handlePollOptionChange = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
    form.setValue('pollOptions', updated.filter(opt => opt.trim()));
  };

  const addPollOption = () => {
    if (pollOptions.length < 10) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const updated = pollOptions.filter((_, i) => i !== index);
      setPollOptions(updated);
      form.setValue('pollOptions', updated.filter(opt => opt.trim()));
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const onSubmit = async (data: CreatePostForm) => {
    try {
      setIsSubmitting(true);
      
      if (data.subtype === 'poll') {
        // Create poll - send poll_options array
        const options = data.pollOptions?.filter(opt => opt.trim()) || [];

        if (options.length < 2) {
          throw new Error('Polls must have at least 2 options');
        }

        const pollData = {
          subtype: 'poll',
          title: data.pollQuestion || '',
          content: data.pollQuestion || '',
          category: data.category,
          platforms: selectedPlatforms.length > 0 ? selectedPlatforms : [],
          poll_options: options,
        };

        await apiRequest('POST', '/api/posts', pollData);
      } else {
        // Upload images first and get URLs
        let imageUrls: string[] = [];
        console.log('imageFiles at submit', imageFiles.length);
        if (imageFiles.length > 0) {
          if (!user) {
            toast({
              title: 'Sign in required',
              description: 'You must be signed in to upload images.',
              variant: 'destructive',
            });
            return;
          }
          
          try {
            imageUrls = await uploadImages(imageFiles);
          } catch (uploadError: any) {
            toast({
              title: 'Image upload failed',
              description: uploadError.message || 'Could not upload images. Please try again.',
              variant: 'destructive',
            });
            return;
          }
        }

        // Create thread with image URLs only
        const postData = {
          subtype: 'thread',
          title: data.title,
          content: data.body,
          category: data.category,
          platforms: selectedPlatforms.length > 0 ? selectedPlatforms : [],
          image_urls: imageUrls,
          links: data.links || [],
          price: data.price || '',
        };

        console.log('payload', postData);
        await apiRequest('POST', '/api/posts', postData);
      }

      // Invalidate posts query to refresh feed
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });

      const postTypeLabel = data.subtype === 'poll' ? 'Poll' : 'Thread';
      toast({
        title: `${postTypeLabel} published`,
        description: `Your ${postTypeLabel.toLowerCase()} has been shared with the community`,
      });

      // Reset form
      form.reset();
      setSelectedPlatforms([]);
      setLinks(['']);
      setImageFiles([]);
      setPollOptions(['', '']);
      
      onPostCreated?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Failed to publish',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Apply initialSubtype when modal opens
  useEffect(() => {
    if (open && initialSubtype) {
      form.setValue('subtype', initialSubtype);
    }
  }, [open, initialSubtype, form]);

  // Watch form values for live preview
  const title = form.watch('title');
  const body = form.watch('body');
  const pollQuestion = form.watch('pollQuestion');
  const category = form.watch('category');

  // Create preview objects
  const previewThread = {
    id: 'preview',
    type: 'post' as const,
    title: title || "What's your post about?",
    body: body || 'Share your thoughts with the community...',
    category: category || 'General',
    platforms: selectedPlatforms,
    createdAt: Date.now(),
    author: { id: 'user', name: 'You', avatar: undefined },
    imageUrl: imageFiles[0] ? URL.createObjectURL(imageFiles[0]) : '',
    images: imageFiles.map(f => URL.createObjectURL(f)),
    links: links.filter(l => l.trim()),
    price: form.watch('price') || ''
  };

  const previewPoll = {
    id: 'preview',
    type: 'poll' as const,
    question: pollQuestion || 'What question would you like to ask?',
    options: pollOptions.filter(opt => opt.trim()).map((label, index) => ({
      id: `preview-opt-${index}`,
      label,
      votes: 0
    })),
    allowMultiple: false,
    showResults: 'after-vote' as const,
    closesAt: Date.now() + (form.watch('pollDurationDays') || 7) * 24 * 60 * 60 * 1000,
    category: category || 'General',
    platforms: selectedPlatforms,
    createdAt: Date.now(),
    author: { id: 'user', name: 'You', avatar: undefined },
    status: 'active' as const
  };

  const timeLeft = Math.max(0, previewPoll.closesAt - Date.now());
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
  const timeDisplay = daysLeft > 0 ? `${daysLeft}d left` : `${hoursLeft}h left`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentSubtype === 'poll' ? 'Create a Poll' : 'Create a Thread'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Content Type Selection */}
          <div className="space-y-2">
            <Label>Content Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={currentSubtype === 'thread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => form.setValue('subtype', 'thread')}
                data-testid="subtype-thread"
              >
                Thread
              </Button>
              <Button
                type="button"
                variant={currentSubtype === 'poll' ? 'default' : 'outline'}
                size="sm"
                onClick={() => form.setValue('subtype', 'poll')}
                data-testid="subtype-poll"
              >
                Poll
              </Button>
            </div>
          </div>
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="What's your post about?"
              {...form.register('title')}
              data-testid="post-title-input"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="body">
              {currentSubtype === 'poll' ? 'Poll Description *' : 'Content *'}
            </Label>
            <Textarea
              id="body"
              placeholder={
                currentSubtype === 'poll'
                  ? 'Provide context for your poll question..'
                  : 'Share your thoughts with the community...'
              }
              className="min-h-[120px]"
              {...form.register('body')}
              data-testid="post-body-input"
            />
            {form.formState.errors.body && (
              <p className="text-sm text-red-500">{form.formState.errors.body.message}</p>
            )}
          </div>

          {/* Poll-specific fields */}
          {currentSubtype === 'poll' && (
            <>
              {/* Poll Question */}
              <div className="space-y-2">
                <Label htmlFor="pollQuestion">Poll Question *</Label>
                <Input
                  id="pollQuestion"
                  placeholder="What question would you like to ask?"
                  {...form.register('pollQuestion')}
                  data-testid="poll-question-input"
                />
                {form.formState.errors.pollQuestion && (
                  <p className="text-sm text-red-500">{form.formState.errors.pollQuestion.message}</p>
                )}
              </div>

              {/* Poll Options */}
              <div className="space-y-2">
                <Label>Poll Options (2-10 options)</Label>
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handlePollOptionChange(index, e.target.value)}
                      data-testid={`poll-option-${index}`}
                    />
                    {pollOptions.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removePollOption(index)}
                        data-testid={`remove-poll-option-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPollOption}
                    className="w-full"
                    data-testid="add-poll-option"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>

              {/* Poll Duration */}
              <div className="space-y-2">
                <Label htmlFor="pollDurationDays">Poll Duration</Label>
                <Select
                  defaultValue="7"
                  onValueChange={(value) => form.setValue('pollDurationDays', parseInt(value))}
                >
                  <SelectTrigger data-testid="poll-duration-select">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              defaultValue="General" 
              onValueChange={(value) => form.setValue('category', value)}
            >
              <SelectTrigger data-testid="post-category-select">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (optional)</Label>
            <Input
              id="price"
              placeholder="e.g., Free, $50, $10-25"
              {...form.register('price')}
              data-testid="post-price-input"
            />
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <Label>Platforms (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => (
                <Badge
                  key={platform.key}
                  variant={selectedPlatforms.includes(platform.key) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handlePlatformToggle(platform.key)}
                  data-testid={`platform-${platform.key}`}
                >
                  {platform.label}
                </Badge>
              ))}
            </div>
            {form.formState.errors.platforms && (
              <p className="text-sm text-red-500">{form.formState.errors.platforms.message}</p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-2">
            <Label>Links (optional)</Label>
            {links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  data-testid={`post-link-${index}`}
                />
                {links.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeLink(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {links.length < 10 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLink}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            )}
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Images (max 5, 10MB each, jpg/png/webp/gif)</Label>
            <div className="grid grid-cols-3 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {imageFiles.length < 5 && (
                <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    data-testid="image-upload-input"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="post-submit-button"
            >
              {isSubmitting
                ? 'Publishing...'
                : currentSubtype === 'poll'
                ? 'Create Poll'
                : 'Publish Thread'
              }
            </Button>
          </div>
        </form>

        {/* Right side - Live Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Live Preview</h3>
          
          {currentSubtype === 'thread' ? (
            /* Thread Preview */
            <div className="enhanced-card hover-lift p-6 space-y-4 transition-all duration-200">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-medium text-lg">
                    {previewThread.author.name.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{previewThread.author.name}</span>
                      <Badge variant="secondary" className="text-xs">Thread</Badge>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">now</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {previewThread.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {previewThread.body}
                  </p>
                  
                  {previewThread.price && (
                    <div className="mb-3">
                      <Badge variant="outline" className="text-green-600">
                        {previewThread.price}
                      </Badge>
                    </div>
                  )}
                  
                  {previewThread.links.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground">{previewThread.links.length} link(s) attached</p>
                    </div>
                  )}
                  
                  {previewThread.images.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground">{previewThread.images.length} image(s) attached</p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <Button variant="ghost" size="sm" disabled>
                      <Heart className="w-4 h-4 mr-1" />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" disabled>
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" disabled>
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Poll Preview */
            <div className="enhanced-card hover-lift p-6 space-y-4 transition-all duration-200">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-medium text-lg">
                    <BarChart3 className="w-6 h-6" />
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{previewPoll.author.name}</span>
                      <Badge variant="secondary" className="text-xs">Poll</Badge>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">now</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    {previewPoll.question}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    {previewPoll.options.length > 0 ? (
                      previewPoll.options.map((option, index) => (
                        <div
                          key={option.id}
                          className="w-full p-3 text-left border border-border rounded-lg opacity-80"
                        >
                          <span className="text-sm font-medium">
                            {previewPoll.allowMultiple ? '☐' : '○'} {option.label || `Option ${index + 1}`}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        Add poll options to see preview
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      0 votes
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {timeDisplay}
                    </span>
                  </div>
                  
                  <Button className="w-full" disabled>
                    Vote
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p>This is how your {currentSubtype} will appear in:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Community feed (mixed with posts)</li>
              {currentSubtype === 'poll' && <li>Pulse Reports → Active Polls section</li>}
            </ul>
          </div>
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
}