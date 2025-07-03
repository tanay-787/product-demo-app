import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import TourStepManager from './TourStepManager';
import ScreenRecorder from './ScreenRecorder';
import PublishControls from './PublishControls';
import TourPreview from './TourPreview';
import AnnotationTool from './AnnotationTool';
import { useUser } from '@stackframe/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams

export interface Annotation {
  id: string;
  text: string;
  x: number;
  y: number;
}

export interface TourStep {
  id: string;
  imageUrl: string | null;
  description: string;
  annotations: Annotation[];
  stepOrder?: number; // Optional as it might not be present when creating a new step client-side
}

const ProductTourEditor: React.FC = () => {
  const user = useUser({ or: "redirect" });
  const [searchParams] = useSearchParams();
  const urlTourId = searchParams.get('tourId');

  const [tourId, setTourId] = useState<string | null>(null);
  const [tourTitle, setTourTitle] = useState<string>('');
  const [tourDescription, setTourDescription] = useState<string>('');
  const [tourSteps, setTourSteps] = useState<TourStep[]>([]);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isLoadingTour, setIsLoadingTour] = useState<boolean>(false);
  const [loadTourError, setLoadTourError] = useState<string | null>(null);

  // Effect to load tour data if tourId is present in the URL
  useEffect(() => {
    if (urlTourId) {
      const fetchTour = async () => {
        setIsLoadingTour(true);
        setLoadTourError(null);
        try {
          const response = await fetch(`/api/tours/${urlTourId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          
          setTourId(data.id);
          setTourTitle(data.title);
          setTourDescription(data.description || '');
          // Ensure steps are ordered and have client-side IDs if not already from DB
          const sortedSteps = data.tourSteps.sort((a: TourStep, b: TourStep) => (a.stepOrder || 0) - (b.stepOrder || 0));
          setTourSteps(sortedSteps.map((step: TourStep) => ({ ...step, id: step.id || Date.now().toString() })));
          setSelectedStepIndex(0);
        } catch (e: any) {
          console.error('Error loading tour:', e);
          setLoadTourError(e.message);
        } finally {
          setIsLoadingTour(false);
        }
      };
      fetchTour();
    } else {
      // If no tourId, initialize with one empty step for new tour creation
      if (tourSteps.length === 0) {
        handleAddStep();
      }
    }
  }, [urlTourId]);

  // Initialize with one empty step if no steps exist and not loading a tour
  useEffect(() => {
    if (!urlTourId && tourSteps.length === 0) {
      handleAddStep();
    }
  }, [urlTourId, tourSteps]); // Add tourSteps as dependency to ensure it runs only if steps are truly empty

  const currentStep = tourSteps[selectedStepIndex];

  const handleAddStep = () => {
    const newStep: TourStep = {
      id: Date.now().toString(), // Client-side ID for now, will be replaced by DB ID on save
      imageUrl: null,
      description: '',
      annotations: [],
    };
    setTourSteps((prevSteps) => [...prevSteps, newStep]);
    setSelectedStepIndex(tourSteps.length); // Select the newly added step
  };

  const handleDeleteStep = (index: number) => {
    if (tourSteps.length === 1) {
      alert("Cannot delete the last step. A tour must have at least one step.");
      return;
    }
    setTourSteps((prevSteps) => prevSteps.filter((_, i) => i !== index));
    if (selectedStepIndex === index) {
      setSelectedStepIndex(Math.max(0, index - 1)); // Select previous step or first step
    } else if (selectedStepIndex > index) {
      setSelectedStepIndex(selectedStepIndex - 1); // Adjust index if a preceding step was deleted
    }
  };

  const handleSelectStep = (index: number) => {
    setSelectedStepIndex(index);
  };

  const handleImageUpload = (imageUrl: string | null) => {
    setTourSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === selectedStepIndex
          ? { ...step, imageUrl, annotations: [] } // Clear annotations when new image is uploaded
          : step
      )
    );
  };

  const handleAddAnnotation = (text: string, x: number, y: number) => {
    const newAnnotation: Annotation = {
      id: Date.now().toString(), // Client-side ID for now
      text,
      x,
      y,
    };
    setTourSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === selectedStepIndex
          ? { ...step, annotations: [...step.annotations, newAnnotation] }
          : step
      )
    );
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    setTourSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      const [movedStep] = newSteps.splice(index, 1);
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      newSteps.splice(newIndex, 0, movedStep);
      setSelectedStepIndex(newIndex); // Select the moved step
      return newSteps;
    });
  };

  const handleSaveTour = async () => {
    if (!tourTitle.trim()) {
      setSaveError("Tour title cannot be empty.");
      return;
    }
    if (tourSteps.some(step => !step.imageUrl && step.annotations.length > 0)) {
        setSaveError("Steps with annotations must have an image.");
        return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const method = tourId ? 'PUT' : 'POST';
      const url = tourId ? `/api/tours/${tourId}` : '/api/tours';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: tourTitle,
          description: tourDescription,
          status: 'draft', // Default status when saving
          steps: tourSteps.map((step, index) => ({
            // For PUT, include existing DB IDs if available, for POST, new IDs will be generated
            id: step.id.includes('-') ? undefined : step.id, // Only send DB IDs to backend for existing steps
            imageUrl: step.imageUrl,
            description: step.description,
            stepOrder: index, // Ensure steps are ordered for backend
            annotations: step.annotations.map(ann => ({ ...ann, id: ann.id.includes('-') ? undefined : ann.id })) // Same for annotations
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const savedTour = await response.json();
      console.log('Tour saved successfully:', savedTour);
      setSaveSuccess(true);
      setTourId(savedTour.id); // Set the tour ID if it's a new tour
      // Re-fetch the tour to get correct DB IDs for newly created steps/annotations
      if (savedTour.id) {
        // This will trigger the useEffect to load the tour with fresh data
        // A more sophisticated approach might update state directly with returned IDs
        window.history.replaceState(null, '', `/editor?tourId=${savedTour.id}`);
      }

    } catch (e: any) {
      console.error('Error saving tour:', e);
      setSaveError(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingTour) {
    return <div className="p-4 text-center text-lg">Loading tour...</div>;
  }

  if (loadTourError) {
    return <div className="p-4 text-center text-red-500">Error loading tour: {loadTourError}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Tour Editor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="space-y-4 mb-4">
            <div>
              <Label htmlFor="tour-title">Tour Title</Label>
              <Input
                id="tour-title"
                type="text"
                value={tourTitle}
                onChange={(e) => setTourTitle(e.target.value)}
                placeholder="e.g., Onboarding Flow for New Users"
              />
            </div>
            <div>
              <Label htmlFor="tour-description">Tour Description (Optional)</Label>
              <Input
                id="tour-description"
                type="text"
                value={tourDescription}
                onChange={(e) => setTourDescription(e.target.value)}
                placeholder="A brief description of this tour"
              />
            </div>
            <Button onClick={handleSaveTour} disabled={isSaving} className="w-full bg-green-500 text-white">
              {isSaving ? 'Saving...' : 'Save Tour'}
            </Button>
            {saveError && <p className="text-red-500 text-sm">Error: {saveError}</p>}
            {saveSuccess && <p className="text-green-500 text-sm">Tour saved successfully!</p>}
          </div>

          <TourStepManager
            tourSteps={tourSteps}
            selectedStepIndex={selectedStepIndex}
            onSelectStep={handleSelectStep}
            onAddStep={handleAddStep}
            onDeleteStep={handleDeleteStep}
            onMoveStep={handleMoveStep} // Pass the new handler
          />

          {currentStep && (
            <>
              <ImageUploader onImageUpload={handleImageUpload} currentImageUrl={currentStep.imageUrl} />
              <AnnotationTool onAddAnnotation={handleAddAnnotation} />
            </>
          )}
          <ScreenRecorder />
          <PublishControls
            tourId={tourId}
            initialStatus={user?.status || 'draft' as 'draft' | 'published' | 'private'} // Pass actual user status if available
            onStatusChange={(newStatus) => {
              // Optionally update local tour status here if needed
              console.log('Tour status changed to:', newStatus);
            }}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Tour Preview</h2>
          <TourPreview
            imageUrl={currentStep?.imageUrl || null}
            annotations={currentStep?.annotations || []}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductTourEditor;
