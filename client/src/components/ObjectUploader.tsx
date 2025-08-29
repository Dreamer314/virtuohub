import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (files: File[]) => void;
  buttonClassName?: string;
  children: ReactNode;
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
}: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    // Validate file count and size
    if (files.length > maxNumberOfFiles) {
      alert(`Maximum ${maxNumberOfFiles} files allowed`);
      return;
    }
    
    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size: ${maxFileSize / 1024 / 1024}MB`);
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
        
        return file;
      });
      
      const uploadedFiles = await Promise.all(uploadPromises);
      onComplete?.(uploadedFiles);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
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
        accept="image/*"
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