import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (uploadedUrls: string[]) => void;
  buttonClassName?: string;
  children: ReactNode;
  accept?: string;
}

/**
 * A simple file upload component that renders as a button
 */
export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
  accept = "image/*",
}: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    // Validate file count and size
    if (files.length > maxNumberOfFiles) {
      toast({
        title: 'Too many files',
        description: `Maximum ${maxNumberOfFiles} files allowed`,
        variant: 'destructive'
      });
      return;
    }
    
    for (const file of files) {
      if (file.size > maxFileSize) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds the maximum size of ${maxFileSize / 1024 / 1024}MB`,
          variant: 'destructive'
        });
        return;
      }
    }

    setIsUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const uploadParams = await onGetUploadParameters();
        
        const response = await fetch(uploadParams.url, {
          method: uploadParams.method,
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        // Return the uploaded URL
        return uploadParams.url.split('?')[0]; // Remove query params to get clean URL
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      onComplete?.(uploadedUrls);
      
      toast({
        title: `Successfully uploaded ${uploadedUrls.length} file(s)!`
      });
      
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={accept}
        multiple={maxNumberOfFiles > 1}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <Button 
        asChild
        className={buttonClassName}
        disabled={isUploading}
      >
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          {isUploading ? 'Uploading...' : children}
        </label>
      </Button>
    </div>
  );
}