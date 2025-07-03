import React from 'react';

interface Annotation {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface TourPreviewProps {
  imageUrl: string | null;
  annotations: Annotation[];
}

const TourPreview: React.FC<TourPreviewProps> = ({ imageUrl, annotations }) => {
  return (
    <div className="relative w-full h-96 border rounded-md flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt="Tour Preview" className="max-w-full max-h-full object-contain" />
      ) : (
        <p className="text-gray-500">Upload an image or record your screen to see a preview.</p>
      )}
      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          className="absolute p-2 bg-blue-500 text-white text-sm rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${annotation.x}%`,
            top: `${annotation.y}%`,
          }}
        >
          {annotation.text}
        </div>
      ))}
    </div>
  );
};

export default TourPreview;
