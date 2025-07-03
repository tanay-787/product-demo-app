import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AnnotationToolProps {
  onAddAnnotation: (text: string, x: number, y: number) => void;
}

const AnnotationTool: React.FC<AnnotationToolProps> = ({ onAddAnnotation }) => {
  const [annotationText, setAnnotationText] = useState('');
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);

  const handleAdd = () => {
    if (annotationText.trim() !== '') {
      onAddAnnotation(annotationText, positionX, positionY);
      setAnnotationText('');
    }
  };

  return (
    <div className="border border-border p-6 rounded-lg mt-8 bg-card shadow-sm">
      <h3 className="text-xl font-semibold text-card-foreground mb-4">Add Annotation</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="annotation-text" className="text-muted-foreground">Annotation Text</Label>
          <Input
            id="annotation-text"
            type="text"
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            placeholder="Enter annotation text"
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="position-x" className="text-muted-foreground">Position X (%)</Label>
            <Input
              id="position-x"
              type="number"
              value={positionX}
              onChange={(e) => setPositionX(parseInt(e.target.value))}
              min="0"
              max="100"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="position-y" className="text-muted-foreground">Position Y (%)</Label>
            <Input
              id="position-y"
              type="number"
              value={positionY}
              onChange={(e) => setPositionY(parseInt(e.target.value))}
              min="0"
              max="100"
              className="mt-1"
            />
          </div>
        </div>
        <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Add Annotation
        </Button>
      </div>
    </div>
  );
};

export default AnnotationTool;
