import React from 'react';
import Draggable, { type DraggableEventHandler } from 'react-draggable';
import { XCircle } from 'lucide-react';

interface Annotation {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface TourPreviewProps {
  imageUrl: string | null;
  annotations: Annotation[];
  onUpdateAnnotationPosition?: (annotationId: string, x: number, y: number) => void;
  onDeleteAnnotation?: (annotationId: string) => void;
}

const TourPreview: React.FC<TourPreviewProps> = ({
  imageUrl,
  annotations,
  onUpdateAnnotationPosition,
  onDeleteAnnotation,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleDrag: DraggableEventHandler = (e, ui) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = ui.x;
    const newY = ui.y;

    // Calculate position as percentage relative to the image container
    const xPercent = (newX / containerRect.width) * 100;
    const yPercent = (newY / containerRect.height) * 100;

    // You might want to debounce or throttle this update in a real app
    // For simplicity, we are passing the raw pixel values for the drag operation
    // and will convert them to percentage on stop.
  };

  const handleStop: DraggableEventHandler = (e, ui) => {
    if (!containerRef.current) return;

    const annotationId = (e.target as HTMLElement).dataset.annotationId;
    if (!annotationId) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    // ui.x and ui.y are relative to the draggable's initial position
    // We need the absolute position of the annotation relative to its container
    const targetElement = e.target as HTMLElement;
    const currentX = parseFloat(targetElement.style.left || '0');
    const currentY = parseFloat(targetElement.style.top || '0');

    // Convert pixel values to percentage
    const xPercent = (ui.x / containerRect.width) * 100;
    const yPercent = (ui.y / containerRect.height) * 100;

    // Ensure positions are within bounds (0-100)
    const clampedX = Math.max(0, Math.min(100, xPercent));
    const clampedY = Math.max(0, Math.min(100, yPercent));

    onUpdateAnnotationPosition?.(annotationId, clampedX, clampedY);
  };

  const handleDeleteClick = (annotationId: string) => {
    onDeleteAnnotation?.(annotationId);
  };

  return (
    <div className="relative w-full h-96 border rounded-md flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden" ref={containerRef}>
      {imageUrl ? (
        <img src={imageUrl} alt="Tour Preview" className="max-w-full max-h-full object-contain" />
      ) : (
        <p className="text-gray-500">Upload an image or record your screen to see a preview.</p>
      )}
      {annotations.map((annotation) => (
        <Draggable
          key={annotation.id}
          bounds="parent"
          onDrag={handleDrag}
          onStop={handleStop}
          defaultPosition={{ x: (annotation.x / 100) * (containerRef.current?.getBoundingClientRect().width || 0), y: (annotation.y / 100) * (containerRef.current?.getBoundingClientRect().height || 0) }}
        >
          <div
            data-annotation-id={annotation.id} // Store ID for easy retrieval on drag stop
            className="absolute p-2 bg-blue-500 text-white text-sm rounded-md shadow-lg cursor-grab flex items-center whitespace-nowrap"
            style={{
              left: `${annotation.x}%`,
              top: `${annotation.y}%`,
              transform: 'translate(-50%, -50%)', // Center the annotation on its coordinates
            }}
          >
            {annotation.text}
            {onDeleteAnnotation && (
              <XCircle
                className="h-4 w-4 ml-2 cursor-pointer text-red-300 hover:text-red-100"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent drag event from firing on delete click
                  handleDeleteClick(annotation.id);
                }}
              />
            )}
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default TourPreview;
