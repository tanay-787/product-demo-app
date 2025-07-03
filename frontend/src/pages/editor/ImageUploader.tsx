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
    <div className="border p-4 rounded-md mt-4">
      <h3 className="text-lg font-semibold mb-2">Upload Screenshot</h3>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
      {previewUrl ? (
        <div className="mt-4">
          <img src={previewUrl} alt="Uploaded Screenshot" className="max-w-full h-auto rounded-md" />
        </div>
      ) : (
        <div className="mt-4 p-4 border border-dashed rounded-md text-center text-gray-500">
          No image uploaded for this step. Upload one or it will appear blank in the tour.
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
