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
import { X, Upload, Plus, Link as LinkIcon } from 'lucide-react';
import { PlatformKey, CATEGORIES, PLATFORMS } from '@/types/content';
import { createFeedPost, getCurrentUser } from '@/data/mockApi';
import { useToast } from '@/hooks/use-toast';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  body: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  category: z.string().min(1, 'Category is required'),
  price: z.string().optional(),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  links: z.array(z.string().url('Invalid URL')).max(10, 'Max 10 links'),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: () => void;
  // COMPOSER ROUTING - Add initial category support
  initialCategory?: string;
}

export function CreatePostModal({ open, onOpenChange, onPostCreated, initialCategory }: CreatePostModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformKey[]>([]);
  const [links, setLinks] = useState<string[]>(['']);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<{ name: string; b64: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      body: '',
      // COMPOSER ROUTING - Use initialCategory if provided, otherwise default to General
      category: initialCategory || 'General',
      price: '',
      platforms: [],
      links: [],
    },
  });

  // COMPOSER ROUTING - Sync initialCategory prop changes into form when modal opens
  useEffect(() => {
    console.log('Modal useEffect triggered:', { open, initialCategory, currentFormCategory: form.getValues('category') });
    if (!open) return;
    const nextCategory = initialCategory || 'General';
    console.log('Setting category to:', nextCategory);
    if (form.getValues('category') !== nextCategory) {
      form.setValue('category', nextCategory, { shouldDirty: false, shouldValidate: true });
      console.log('Category updated to:', form.getValues('category'));
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 10MB limit`,
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && images.length < 5) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = Array.from(event.target.files || []);
    
    uploadFiles.forEach(file => {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 50MB limit`,
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && files.length < 10) {
          setFiles(prev => [...prev, {
            name: file.name,
            b64: e.target!.result as string
          }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
      
      const post = createFeedPost({
        type: 'post',
        title: data.title,
        body: data.body,
        category: data.category,
        price: data.price || undefined,
        platforms: selectedPlatforms,
        links: data.links || [],
        images,
        files,
        author: getCurrentUser(),
      });

      toast({
        title: 'Post published',
        description: 'Your post has been shared with the community',
      });

      // Reset form
      form.reset();
      setSelectedPlatforms([]);
      setLinks(['']);
      setImages([]);
      setFiles([]);
      
      onPostCreated?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Failed to publish post',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Label htmlFor="body">Content *</Label>
            <Textarea
              id="body"
              placeholder="Share your thoughts with the community..."
              className="min-h-[120px]"
              {...form.register('body')}
              data-testid="post-body-input"
            />
            {form.formState.errors.body && (
              <p className="text-sm text-red-500">{form.formState.errors.body.message}</p>
            )}
          </div>

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
            <Label>Platforms *</Label>
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
            <Label>Images (max 5, 10MB each)</Label>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
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
              {images.length < 5 && (
                <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    data-testid="image-upload-input"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Files */}
          <div className="space-y-2">
            <Label>Files (max 10, 50MB each)</Label>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {files.length < 10 && (
                <label className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <Upload className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Files</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    data-testid="file-upload-input"
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
              disabled={isSubmitting || selectedPlatforms.length === 0}
              data-testid="post-submit-button"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}