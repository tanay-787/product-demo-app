import React from 'react';
import { Button } from '@/components/ui/button';
import type { TourStep } from './ProductTourEditor';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TourStepManagerProps {
  tourSteps: TourStep[];
  selectedStepIndex: number;
  onSelectStep: (index: number) => void;
  onAddStep: () => void;
  onDeleteStep: (index: number) => void;
  onMoveStep: (index: number, direction: 'up' | 'down') => void; 
}

const TourStepManager: React.FC<TourStepManagerProps> = ({
  tourSteps,
  selectedStepIndex,
  onSelectStep,
  onAddStep,
  onDeleteStep,
  onMoveStep,
}) => {
  return (
    <div className="border border-border p-6 rounded-lg mt-8 bg-card shadow-sm">
      <h3 className="text-xl font-semibold text-card-foreground mb-4">Manage Tour Steps</h3>
      <div className="space-y-3 mb-4">
        {tourSteps.map((step, index) => (
          <div
            key={step.id} 
            className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors duration-200 \
              ${index === selectedStepIndex ? 'bg-primary/10 border-primary text-primary-foreground' : 'bg-background hover:bg-muted/50 border-border text-foreground'}
            }`}
            onClick={() => onSelectStep(index)}
          >
            <span className="font-medium">Step {index + 1}</span>
            <span className="text-sm text-muted-foreground truncate ml-2 mr-auto">
              {step.description || (step.imageUrl ? 'Image uploaded' : 'No content')}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveStep(index, 'up');
                }}
                disabled={index === 0} 
                className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveStep(index, 'down');
                }}
                disabled={index === tourSteps.length - 1} 
                className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              {tourSteps.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onDeleteStep(index);
                  }}
                  className="ml-2 h-8"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button onClick={onAddStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Add New Step
      </Button>
    </div>
  );
};

export default TourStepManager;
