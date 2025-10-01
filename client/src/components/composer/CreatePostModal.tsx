import React, 'react';
import { useState, useEffect } from 'react';
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
import { X, Plus, Upload, Link2 } from 'lucide-react';
import { Platform, PLATFORMS, CATEGORIES } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ObjectUploader } from "@/components/ObjectUploader";
import { useQueryClient } from '@tanstack/react-query';

// A single unified schema for creating any type of post
const createPostSchema = z.object({
  subtype: z.enum(['thread', 'poll']).default('thread'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  body: z.string().min(1, 'Content or a poll description is required').max(5000, 'Content too long'),
  category: z.string().min(1, 'Category is required'),
  price: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  // Poll-specific fields are nested
  subtypeData: z.object({
    options: z.array(z.string().min(1, "Option can't be empty")).optional(),
  }).optional(),
}).refine((data) => {
  // Rule: If it's a poll, it must have at least 2 options.
  if (data.subtype === 'poll') {
    return data.subtypeData?.options && data.subtypeData.options.length >= 2;
  }
  return true;
}, {
  message: 'Polls must have at least 2 options',
  path: ['subtypeData', 'options'], // Point error to the options field
});

type CreatePostForm = z.infer<typeof createPostSchema>;

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: () => void;
  initialCategory?: string;
  initialSubtype?: 'thread' | 'poll';
}

export function CreatePostModal({
  open,
  onOpenChange,
  onPostCreated,
  initialCategory,
  initialSubtype = 'thread',
}: CreatePostModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>(['']);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      subtype: initialSubtype,
      title: '',
      body: '',
      category: initialCategory || 'General',
    },
  });

  const currentSubtype = form.watch('subtype');

  // Reset state when modal opens or subtype changes
  useEffect(() => {
    if (open) {
      form.reset({
        subtype: initialSubtype,
        title: '',
        body: '',
        category: initialCategory || 'General',
        platforms: [],
        images: [],
        files: [],
        links: [],
        price: '',
        subtypeData: { options: ['', ''] }
      });
      setSelectedPlatforms([]);
      setUploadedImages([]);
      setUploadedFiles([]);
      setLinks(['']);
      setPollOptions(['', '']);
    }
  }, [open, initialSubtype, initialCategory, form]);

  const handlePlatformToggle = (platform: Platform) => {
    const updated = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    setSelectedPlatforms(updated);
    form.setValue('platforms', updated);
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
    form.setValue('subtypeData', { options: updated.filter(o => o.trim()) });
  };

  const addPollOption = () => { if (pollOptions.length < 10) setPollOptions([...pollOptions, '']); };
  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const updated = pollOptions.filter((_, i) => i !== index);
      setPollOptions(updated);
      form.setValue('subtypeData', { options: updated.filter(o => o.trim()) });
    }
  };

  const handleGetUploadParameters = async () => {
    const response = await apiRequest('POST', '/api/objects/upload');
    return { method: 'PUT' as const, url: response.url };
  };

  const handleImageUploadComplete = (urls: string[]) => {
    const updated = [...uploadedImages, ...urls];
    setUploadedImages(updated);
    form.setValue('images', updated);
  };

  const handleFileUploadComplete = (urls: string[]) => {
    const updated = [...uploadedFiles, ...urls];
    setUploadedFiles(updated);
    form.setValue('files', updated);
  };

  const handleRemoveImage = (index: number) => {
    const updated = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updated);
    form.setValue('images', updated);
  };

  const handleRemoveFile = (index: number) => {
    const updated = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updated);
    form.setValue('files', updated);
  };

  const addLink = () => { if (links.length < 10) setLinks([...links, '']); };
  const handleLinkChange = (index: number, value: string) => {
    const updated = [...links];
    updated[index] = value;
    setLinks(updated);
    form.setValue('links', updated.filter(l => l.trim()));
  };
  const removeLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    form.setValue('links', updated.filter(l => l.trim()));
  };

  const onSubmit = async (data: CreatePostForm) => {
    try {
      setIsSubmitting(true);
      // Clean poll options before submitting
      if (data.subtype === 'poll' && data.subtypeData?.options) {
        data.subtypeData.options = data.subtypeData.options.filter(o => o.trim());
      }

      await apiRequest('POST', '/api/posts', data);

      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({ title: `Your ${data.subtype} has been published!` });
      onPostCreated?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Failed to publish post', description: e.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Create a new Post</DialogTitle></DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <div className="flex gap-2">
                <Button type="button" variant={currentSubtype === 'thread' ? 'secondary' : 'outline'} size="sm" onClick={() => form.setValue('subtype', 'thread')}>Thread</Button>
                <Button type="button" variant={currentSubtype === 'poll' ? 'secondary' : 'outline'} size="sm" onClick={() => form.setValue('subtype', 'poll')}>Poll</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder={currentSubtype === 'poll' ? "What's the poll about?" : "What's your post about?"} {...form.register('title')} />
              {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">{currentSubtype === 'poll' ? 'Description (optional)' : 'Content *'}</Label>
              <Textarea id="body" placeholder={currentSubtype === 'poll' ? 'Add some context to your poll...' : 'Share your thoughts, ask a question, or show your work...'} className="min-h-[120px]" {...form.register('body')} />
              {form.formState.errors.body && <p className="text-sm text-red-500">{form.formState.errors.body.message}</p>}
            </div>

            {currentSubtype === 'poll' && (
              <div className="space-y-2">
                <Label>Poll Options (2–10) *</Label>
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => handlePollOptionChange(i, e.target.value)} />
                    {pollOptions.length > 2 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removePollOption(i)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 10 && (
                  <Button type="button" variant="outline" size="sm" onClick={addPollOption} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Option
                  </Button>
                )}
                {form.formState.errors.subtypeData?.options && <p className="text-sm text-red-500">{form.formState.errors.subtypeData.options.message}</p>}
              </div>
            )}

            <div className="space-y-3">
              <Label>Attachments (optional)</Label>
              <div className="p-4 border rounded-lg space-y-4">
                <ObjectUploader maxNumberOfFiles={5} maxFileSize={10485760} onGetUploadParameters={handleGetUploadParameters} onComplete={handleImageUploadComplete} buttonClassName="w-full">
                  <div className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Images</div>
                </ObjectUploader>
                {uploadedImages.length > 0 && <div className="text-xs text-muted-foreground">{uploadedImages.length} image(s) attached.</div>}

                <ObjectUploader maxNumberOfFiles={2} maxFileSize={52428800} onGetUploadParameters={handleGetUploadParameters} onComplete={handleFileUploadComplete} buttonClassName="w-full" accept="*/*">
                  <div className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Files</div>
                </ObjectUploader>
                {uploadedFiles.length > 0 && <div className="text-xs text-muted-foreground">{uploadedFiles.length} file(s) attached.</div>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Links (optional)</Label>
              {links.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder="https://example.com" value={link} onChange={(e) => handleLinkChange(i, e.target.value)} />
                  {links.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(i)}><X className="h-4 w-4" /></Button>
                  )}
                </div>
              ))}
              {links.length < 5 && <Button type="button" variant="outline" size="sm" onClick={addLink} className="w-full"><Plus className="h-4 w-4 mr-2" /> Add Link</Button>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={form.watch('category')} onValueChange={(v) => form.setValue('category', v)}>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (optional)</Label>
                  <Input id="price" placeholder="e.g., Free, $50" {...form.register('price')} />
                </div>
            </div>

            <div className="space-y-2">
              <Label>Platforms (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <Badge
                    key={p}
                    variant={selectedPlatforms.includes(p) ? 'secondary' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handlePlatformToggle(p)}
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing…' : 'Publish'}
              </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}