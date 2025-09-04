import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Plus, Upload, Link as LinkIcon, DollarSign } from 'lucide-react';
import { mockApi } from '@/data/mockApi';
import { useToast } from '@/hooks/use-toast';
import type { PlatformKey } from '@/types/content';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PLATFORMS: { key: PlatformKey; label: string }[] = [
  { key: 'roblox', label: 'Roblox' },
  { key: 'vrchat', label: 'VRChat' },
  { key: 'secondlife', label: 'Second Life' },
  { key: 'unity', label: 'Unity' },
  { key: 'unreal', label: 'Unreal Engine' },
  { key: 'imvu', label: 'IMVU' },
  { key: 'horizon', label: 'Horizon Worlds' },
  { key: 'other', label: 'Other' }
];

const CATEGORIES = [
  'General',
  'Assets for Sale',
  'Jobs & Gigs',
  'Collaboration & WIP'
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    links: [''],
    price: '',
    category: 'General',
    platforms: [] as PlatformKey[]
  });
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<{ name: string; b64: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  const addLink = () => {
    setFormData(prev => ({ ...prev, links: [...prev.links, ''] }));
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      links: prev.links.filter((_, i) => i !== index) 
    }));
  };

  const togglePlatform = (platform: PlatformKey) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'Image too large', description: 'Images must be under 10MB', variant: 'destructive' });
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
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach(file => {
      if (file.size > 50 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Files must be under 50MB', variant: 'destructive' });
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

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({ title: 'Title required', variant: 'destructive' });
      return false;
    }
    if (!formData.body.trim()) {
      toast({ title: 'Content required', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const validLinks = formData.links.filter(link => link.trim());
      
      mockApi.createFeedPost({
        type: 'post',
        title: formData.title.trim(),
        body: formData.body.trim(),
        links: validLinks,
        images,
        files,
        price: formData.price || undefined,
        category: formData.category,
        platforms: formData.platforms,
        author: { id: 'user1', name: 'Alex Chen', avatar: '' }
      });

      toast({ title: 'Post published successfully!' });
      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        body: '',
        links: [''],
        price: '',
        category: 'General',
        platforms: []
      });
      setImages([]);
      setFiles([]);
    } catch (error) {
      toast({ 
        title: 'Failed to publish post', 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What's your post about?"
              data-testid="post-title-input"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              placeholder="Share your thoughts, ideas, or updates..."
              rows={4}
              data-testid="post-content-textarea"
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Images (max 5, 10MB each)</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </label>
              </Button>
              <span className="text-sm text-muted-foreground">
                {images.length}/5 uploaded
              </span>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image} 
                      alt={`Upload ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Files */}
          <div className="space-y-2">
            <Label>Files (max 10, 50MB each)</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </label>
              </Button>
              <span className="text-sm text-muted-foreground">
                {files.length}/10 uploaded
              </span>
            </div>
            {files.length > 0 && (
              <div className="space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
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
            <Label>Links</Label>
            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder="https://example.com"
                    className="pl-10"
                  />
                </div>
                {formData.links.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeLink(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addLink}>
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
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
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Free or $50"
                className="pl-10"
              />
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(platform => (
                <Badge
                  key={platform.key}
                  variant={formData.platforms.includes(platform.key) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => togglePlatform(platform.key)}
                >
                  {platform.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              data-testid="publish-post-button"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};