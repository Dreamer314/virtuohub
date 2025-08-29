import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPostSchema, CATEGORIES, PLATFORMS, type Category, type Platform } from "@shared/schema";
import { ObjectUploader } from "@/components/ObjectUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Paperclip, Link2, Plus } from "lucide-react";
import { z } from "zod";

const createPostSchema = insertPostSchema.extend({
  authorId: z.string().optional(),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
      images: [],
      files: [],
      links: [],
      category: "General",
      platforms: [],
      price: "",
      type: "regular",
      pollData: null,
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostFormData) =>
      apiRequest("POST", "/api/posts", { ...data, authorId: 'user1' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({ title: "Post created successfully!" });
      form.reset();
      setSelectedPlatforms([]);
      onClose();
    },
    onError: () => {
      toast({ 
        title: "Failed to create post", 
        variant: "destructive" 
      });
    },
  });

  const handlePlatformToggle = (platform: Platform) => {
    const updatedPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    
    setSelectedPlatforms(updatedPlatforms);
    form.setValue('platforms', updatedPlatforms);
  };

  const handleGetUploadParameters = async () => {
    const response = await apiRequest('POST', '/api/objects/upload');
    return {
      method: 'PUT' as const,
      url: response.uploadURL,
    };
  };

  const handleImageUploadComplete = (uploadedUrls: string[]) => {
    const updatedImages = [...uploadedImages, ...uploadedUrls];
    setUploadedImages(updatedImages);
    form.setValue('images', updatedImages);
  };

  const handleFileUploadComplete = (uploadedUrls: string[]) => {
    const updatedFiles = [...uploadedFiles, ...uploadedUrls];
    setUploadedFiles(updatedFiles);
    form.setValue('files', updatedFiles);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    form.setValue('images', updatedImages);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    form.setValue('files', updatedFiles);
  };

  const handleAddLink = () => {
    if (newLink.trim() && !links.includes(newLink.trim())) {
      const updatedLinks = [...links, newLink.trim()];
      setLinks(updatedLinks);
      form.setValue('links', updatedLinks);
      setNewLink('');
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    form.setValue('links', updatedLinks);
  };

  const onSubmit = (data: CreatePostFormData) => {
    createPostMutation.mutate({
      ...data,
      platforms: selectedPlatforms,
      images: uploadedImages,
      files: uploadedFiles,
      links: links,
    });
  };

  const handleModalClose = () => {
    form.reset();
    setSelectedPlatforms([]);
    setUploadedImages([]);
    setUploadedFiles([]);
    setLinks([]);
    setNewLink('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="create-post-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-semibold gradient-text">
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Give your post a catchy title..." 
                      {...field}
                      data-testid="post-title-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your thoughts, showcase your work, or start a discussion..."
                      className="min-h-32"
                      {...field}
                      data-testid="post-content-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Upload Images */}
            <div className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Upload Images (optional)
              </FormLabel>
              <div className="flex flex-col gap-3">
                <ObjectUploader
                  maxNumberOfFiles={5}
                  maxFileSize={10485760} // 10MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleImageUploadComplete}
                  buttonClassName="w-full"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Upload Images (Max 5, 10MB each)
                  </div>
                </ObjectUploader>
                
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                          data-testid={`remove-image-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Upload Files (optional)
              </FormLabel>
              <div className="flex flex-col gap-3">
                <ObjectUploader
                  maxNumberOfFiles={10}
                  maxFileSize={50485760} // 50MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleFileUploadComplete}
                  buttonClassName="w-full"
                  accept="*/*"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Upload Files (Max 10, 50MB each)
                  </div>
                </ObjectUploader>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((fileUrl, index) => {
                      const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                      return (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm flex-1 truncate" title={fileName}>
                            {fileName}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleRemoveFile(index)}
                            data-testid={`remove-file-${index}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Links Section */}
            <div className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Links (optional)
              </FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="https://your-portfolio.com"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLink();
                    }
                  }}
                  data-testid="add-link-input"
                />
                <Button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newLink.trim()}
                  data-testid="add-link-button"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {links.length > 0 && (
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm flex-1 truncate" title={link}>
                        {link}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleRemoveLink(index)}
                        data-testid={`remove-link-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="category-select">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.filter(cat => cat !== 'All').map((category) => (
                          <SelectItem key={category} value={category} data-testid={`category-option-${category}`}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="$50 or Free" 
                        {...field}
                        value={field.value || ''}
                        data-testid="post-price-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Platforms */}
            <div className="space-y-3">
              <FormLabel>Platforms</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PLATFORMS.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={() => handlePlatformToggle(platform)}
                      data-testid={`platform-checkbox-${platform}`}
                    />
                    <label
                      htmlFor={platform}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {platform}
                    </label>
                  </div>
                ))}
              </div>
              {selectedPlatforms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedPlatforms.map((platform) => (
                    <Badge key={platform} variant="secondary" className="flex items-center space-x-1">
                      <span>{platform}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handlePlatformToggle(platform)}
                        data-testid={`remove-platform-${platform}`}
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleModalClose}
                data-testid="cancel-post-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPostMutation.isPending}
                className="bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                data-testid="submit-post-button"
              >
                {createPostMutation.isPending ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
