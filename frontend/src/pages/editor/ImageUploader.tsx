import React, { useState, useEffect } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string | null) => void;
  currentImageUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImageUrl,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);

  useEffect(() => {
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
      onImageUpload(null);
    }
  };

  return (
    <div className="border border-border p-4 rounded-lg mt-4 bg-card shadow-sm">
      <h3 className="text-lg font-semibold text-card-foreground mb-2">Upload Screenshot</h3>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2 text-foreground file:text-primary file:bg-primary-foreground file:border-border file:rounded-md file:border file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-primary-foreground/80" />
      {previewUrl ? (
        <div className="mt-4 p-2 border border-border rounded-md bg-background">
          <img src={previewUrl} alt="Uploaded Screenshot" className="max-w-full h-auto rounded-md object-contain mx-auto" />
        </div>
      ) : (
        <div className="mt-4 p-4 border border-dashed border-muted-foreground rounded-md text-center text-muted-foreground bg-muted/30">
          No image uploaded for this step. Upload one or it will appear blank in the tour.
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
