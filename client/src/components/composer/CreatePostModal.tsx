import React, { useState } from 'react';
import { X, Plus, Upload, Link as LinkIcon, ImageIcon, FileIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Post, PlatformKey } from '@/types/content';
import { CATEGORIES, PLATFORM_LABELS } from '@/types/content';
import { mockApi } from '@/data/mockApi';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (post: Post) => void;
}

interface FilePreview {
  name: string;
  size: number;
  b64: string;
  preview?: string;
}

const MAX_IMAGES = 5;
const MAX_FILES = 10;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function CreatePostModal({ open, onOpenChange, onSuccess }: CreatePostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('General');
  const [platforms, setPlatforms] = useState<PlatformKey[]>([]);
  const [links, setLinks] = useState<string[]>(['']);
  const [images, setImages] = useState<FilePreview[]>([]);
  const [files, setFiles] = useState<FilePreview[]>([]);
  
  const { toast } = useToast();
  
  const resetForm = () => {
    setTitle('');
    setBody('');
    setPrice('');
    setCategory('General');
    setPlatforms([]);
    setLinks(['']);
    setImages([]);
    setFiles([]);
  };
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };
  
  const handleFileRead = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    
    if (images.length + uploadedFiles.length > MAX_IMAGES) {
      toast({
        title: 'Too many images',
        description: `Maximum ${MAX_IMAGES} images allowed`,
        variant: 'destructive'
      });
      return;
    }
    
    const validFiles = uploadedFiles.filter(file => {
      if (file.size > MAX_IMAGE_SIZE) {
        toast({
          title: 'File too large',
          description: `${file.name} is larger than 10MB`,
          variant: 'destructive'
        });
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not an image`,
          variant: 'destructive'
        });
        return false;
      }
      return true;
    });
    
    try {
      const newImages = await Promise.all(
        validFiles.map(async (file) => {
          const b64 = await handleFileRead(file);
          return {
            name: file.name,
            size: file.size,
            b64,
            preview: b64
          };
        })
      );
      
      setImages(prev => [...prev, ...newImages]);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to process images',
        variant: 'destructive'
      });
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    
    if (files.length + uploadedFiles.length > MAX_FILES) {
      toast({
        title: 'Too many files',
        description: `Maximum ${MAX_FILES} files allowed`,
        variant: 'destructive'
      });
      return;
    }
    
    const validFiles = uploadedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: `${file.name} is larger than 50MB`,
          variant: 'destructive'
        });
        return false;
      }
      return true;
    });
    
    try {
      const newFiles = await Promise.all(
        validFiles.map(async (file) => {
          const b64 = await handleFileRead(file);
          return {
            name: file.name,
            size: file.size,
            b64
          };
        })
      );
      
      setFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to process files',
        variant: 'destructive'
      });
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const addLink = () => {
    setLinks(prev => [...prev, '']);
  };
  
  const updateLink = (index: number, value: string) => {
    setLinks(prev => prev.map((link, i) => i === index ? value : link));
  };
  
  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };
  
  const togglePlatform = (platform: PlatformKey) => {
    setPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };
  
  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your post',
        variant: 'destructive'
      });
      return false;
    }
    
    if (!body.trim()) {
      toast({
        title: 'Content required',
        description: 'Please enter content for your post',
        variant: 'destructive'
      });
      return false;
    }
    
    // Validate URLs
    const validLinks = links.filter(link => link.trim());
    for (const link of validLinks) {
      try {
        new URL(link);
      } catch {
        toast({
          title: 'Invalid URL',
          description: `"${link}" is not a valid URL`,
          variant: 'destructive'
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const postData = {
        type: 'post' as const,
        title: title.trim(),
        body: body.trim(),
        links: links.filter(link => link.trim()),
        images: images.map(img => img.b64),
        files: files.map(f => ({ name: f.name, b64: f.b64 })),
        price: price.trim() || undefined,
        category,
        platforms,
        author: {
          id: 'user1',
          name: 'VirtualCreator',
          avatar: undefined
        }
      };
      
      const post = mockApi.createFeedPost(postData);
      
      toast({
        title: 'Post published',
        description: 'Your post has been published successfully'
      });
      
      onSuccess?.(post);
      handleClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        title: 'Failed to publish',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your post about?"
              data-testid="post-title-input"
            />
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts, project updates, or ask for feedback..."
              rows={6}
              data-testid="post-content-input"
            />
          </div>
          
          {/* Images */}
          <div className="space-y-2">
            <Label>Images (max {MAX_IMAGES})</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                data-testid="image-upload"
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button type="button" variant="outline" className="flex items-center gap-2" asChild>
                  <span>
                    <ImageIcon className="w-4 h-4" />
                    Upload Images
                  </span>
                </Button>
              </Label>
              <span className="text-sm text-muted-foreground">10MB max each</span>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={image.name}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`remove-image-${index}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Files */}
          <div className="space-y-2">
            <Label>Files (max {MAX_FILES})</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                data-testid="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" variant="outline" className="flex items-center gap-2" asChild>
                  <span>
                    <FileIcon className="w-4 h-4" />
                    Upload Files
                  </span>
                </Button>
              </Label>
              <span className="text-sm text-muted-foreground">50MB max each</span>
            </div>
            
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-destructive hover:text-destructive/80"
                      data-testid={`remove-file-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Links</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLink}
                className="flex items-center gap-1"
                data-testid="add-link-button"
              >
                <Plus className="w-3 h-3" />
                Add Link
              </Button>
            </div>
            
            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  placeholder="https://example.com"
                  data-testid={`link-input-${index}`}
                />
                {links.length > 1 && (
                  <button
                    onClick={() => removeLink(index)}
                    className="text-destructive hover:text-destructive/80"
                    data-testid={`remove-link-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Category and Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (optional)</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Free or $50"
                data-testid="price-input"
              />
            </div>
          </div>
          
          {/* Platforms */}
          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PLATFORM_LABELS).map(([key, label]) => {
                const isSelected = platforms.includes(key as PlatformKey);
                return (
                  <Badge
                    key={key}
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => togglePlatform(key as PlatformKey)}
                    data-testid={`platform-${key}`}
                  >
                    {label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            data-testid="cancel-post-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !body.trim()}
            data-testid="publish-post-button"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}