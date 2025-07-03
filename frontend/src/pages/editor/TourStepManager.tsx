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
  onMoveStep: (index: number, direction: 'up' | 'down') => void; // New prop for reordering
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
    <div className="border p-4 rounded-md mt-4">
      <h3 className="text-lg font-semibold mb-2">Manage Tour Steps</h3>
      <div className="space-y-2 mb-4">
        {tourSteps.map((step, index) => (
          <div
            key={step.id} // Use the step's unique ID as key
            className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${
              index === selectedStepIndex ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => onSelectStep(index)}
          >
            <span className="font-medium">Step {index + 1}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 truncate ml-2 mr-auto">
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
                disabled={index === 0} // Disable if it's the first step
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
                disabled={index === tourSteps.length - 1} // Disable if it's the last step
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              {tourSteps.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting the step when deleting
                    onDeleteStep(index);
                  }}
                  className="ml-2"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button onClick={onAddStep} className="w-full bg-blue-500 text-white">
        Add New Step
      </Button>
    </div>
  );
};

export default TourStepManager;
