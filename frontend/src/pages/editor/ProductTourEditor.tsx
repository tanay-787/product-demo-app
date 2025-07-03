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
import { useSearchParams } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'motion/react';

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
  stepOrder?: number;
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
  const [direction, setDirection] = useState(0);
  const [tourCurrentStatus, setTourCurrentStatus] = useState<'draft' | 'published' | 'private'>('draft'); // New state for tour status

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
          const sortedSteps = data.tourSteps.sort((a: TourStep, b: TourStep) => (a.stepOrder || 0) - (b.stepOrder || 0));
          setTourSteps(sortedSteps.map((step: TourStep) => ({ ...step, id: step.id || Date.now().toString() })));
          setSelectedStepIndex(0);
          setTourCurrentStatus(data.status); // Set tour status from fetched data
        } catch (e: any) {
          console.error('Error loading tour:', e);
          setLoadTourError(e.message);
        } finally {
          setIsLoadingTour(false);
        }
      };
      fetchTour();
    } else {
      if (tourSteps.length === 0) {
        handleAddStep();
      }
      setTourCurrentStatus('draft'); // Default to draft for new tours
    }
  }, [urlTourId]);

  useEffect(() => {
    if (!urlTourId && tourSteps.length === 0) {
      handleAddStep();
    }
  }, [urlTourId, tourSteps]);

  const currentStep = tourSteps[selectedStepIndex];

  const handleAddStep = () => {
    const newStep: TourStep = {
      id: Date.now().toString(),
      imageUrl: null,
      description: '',
      annotations: [],
    };
    setTourSteps((prevSteps) => [...prevSteps, newStep]);
    setSelectedStepIndex(tourSteps.length); 
  };

  const handleDeleteStep = (index: number) => {
    if (tourSteps.length === 1) {
      alert("Cannot delete the last step. A tour must have at least one step.");
      return;
    }
    setTourSteps((prevSteps) => prevSteps.filter((_, i) => i !== index));
    if (selectedStepIndex === index) {
      setSelectedStepIndex(Math.max(0, index - 1));
    } else if (selectedStepIndex > index) {
      setSelectedStepIndex(selectedStepIndex - 1);
    }
  };

  const handleSelectStep = (index: number) => {
    if (index > selectedStepIndex) setDirection(1);
    else setDirection(-1);
    setSelectedStepIndex(index);
  };

  const handleImageUpload = (imageUrl: string | null) => {
    setTourSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === selectedStepIndex
          ? { ...step, imageUrl, annotations: [] }
          : step
      )
    );
  };

  const handleStepDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setTourSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === selectedStepIndex
          ? { ...step, description: newDescription }
          : step
      )
    );
  };

  const handleAddAnnotation = (text: string, x: number, y: number) => {
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
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

  const handleUpdateAnnotationPosition = (annotationId: string, newX: number, newY: number) => {
    setTourSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === selectedStepIndex
          ? {
              ...step,
              annotations: step.annotations.map((ann) =>
                ann.id === annotationId ? { ...ann, x: newX, y: newY } : ann
              ),
            }
          : step
      )
    );
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    setTourSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === selectedStepIndex
          ? {
              ...step,
              annotations: step.annotations.filter((ann) => ann.id !== annotationId),
            }
          : step
      )
    );
  };

  const handleMoveStep = (index: number, moveDirection: 'up' | 'down') => {
    setTourSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      const [movedStep] = newSteps.splice(index, 1);
      const newIndex = moveDirection === 'up' ? index - 1 : index + 1;
      newSteps.splice(newIndex, 0, movedStep);
      setSelectedStepIndex(newIndex);
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
          status: tourCurrentStatus, // Use the current tour status from state
          steps: tourSteps.map((step, index) => ({
            id: step.id.includes('-') ? undefined : step.id,
            imageUrl: step.imageUrl,
            description: step.description,
            stepOrder: index,
            annotations: step.annotations.map(ann => ({ ...ann, id: ann.id.includes('-') ? undefined : ann.id }))
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
      setTourId(savedTour.id);
      if (savedTour.id) {
        window.history.replaceState(null, '', `/editor?tourId=${savedTour.id}`);
      }

    } catch (e: any) {
      console.error('Error saving tour:', e);
      setSaveError(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextStepInEditor = () => {
    if (selectedStepIndex < tourSteps.length - 1) {
      setDirection(1);
      setSelectedStepIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousStepInEditor = () => {
    if (selectedStepIndex > 0) {
      setDirection(-1);
      setSelectedStepIndex((prevIndex) => prevIndex - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
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
            onMoveStep={handleMoveStep}
          />

          {currentStep && (
            <>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="step-description">Step Description</Label>
                  <Textarea
                    id="step-description"
                    value={currentStep.description}
                    onChange={handleStepDescriptionChange}
                    placeholder="Describe what's happening in this step..."
                    rows={3}
                  />
                </div>
              </div>
              <ImageUploader onImageUpload={handleImageUpload} currentImageUrl={currentStep.imageUrl} />
              <AnnotationTool onAddAnnotation={handleAddAnnotation} />
            </>
          )}
          <ScreenRecorder />
          <PublishControls
            tourId={tourId}
            initialStatus={tourCurrentStatus}
            onStatusChange={(newStatus) => {
              setTourCurrentStatus(newStatus); // Update local status state
              console.log('Tour status changed to:', newStatus);
            }}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Tour Preview</h2>
          <div className="relative mb-6 overflow-hidden border rounded-md min-h-96 flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={selectedStepIndex} 
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full h-full absolute"
              >
                <TourPreview
                  imageUrl={currentStep?.imageUrl || null}
                  annotations={currentStep?.annotations || []}
                  onUpdateAnnotationPosition={handleUpdateAnnotationPosition}
                  onDeleteAnnotation={handleDeleteAnnotation}
                />
              </motion.div>
            </AnimatePresence>
            {currentStep?.description && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white p-3 rounded-md max-w-xs text-sm text-center z-10">
                {currentStep.description}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePreviousStepInEditor} disabled={selectedStepIndex === 0} variant="outline">
              Previous Step
            </Button>
            <span className="text-lg font-semibold">{selectedStepIndex + 1} / {tourSteps.length}</span>
            <Button onClick={handleNextStepInEditor} disabled={selectedStepIndex === tourSteps.length - 1}>
              Next Step
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTourEditor;
