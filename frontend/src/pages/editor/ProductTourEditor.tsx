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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Annotation {
  id?: string;
  text: string;
  x: number;
  y: number;
}

export interface TourStep {
  id?: string;
  imageUrl: string | null;
  description: string;
  annotations: Annotation[];
  stepOrder?: number;
}

interface TourData {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'private';
  tourSteps: TourStep[];
}

const ProductTourEditor: React.FC = () => {
  const user = useUser({ or: "redirect" });
  const [searchParams] = useSearchParams();
  const urlTourId = searchParams.get('tourId');
  const queryClient = useQueryClient();

  const [tourId, setTourId] = useState<string | null>(null);
  const [tourTitle, setTourTitle] = useState<string>('');
  const [tourDescription, setTourDescription] = useState<string>('');
  const [tourSteps, setTourSteps] = useState<TourStep[]>([]);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [direction, setDirection] = useState(0);
  const [tourCurrentStatus, setTourCurrentStatus] = useState<'draft' | 'published' | 'private'>('draft');

  const { data: fetchedTour, isLoading: isLoadingTour, isError: isLoadTourError, error: loadTourError, isSuccess: isLoadTourSuccess } = useQuery<TourData, Error>({
    queryKey: ['tour', urlTourId],
    queryFn: async () => {
      if (!urlTourId) {
        throw new Error("Tour ID is missing.");
      }
      if (!user) {
        throw new Error("User not authenticated.");
      }
      const authHeaders = await user.getAuthHeaders();
      const response = await api.get<TourData>(`/tours/${urlTourId}`, { headers: authHeaders });
      return response.data;
    },
    enabled: !!urlTourId && !!user, // Only fetch if urlTourId and user are available
  });

  useEffect(() => {
    if (isLoadTourSuccess && fetchedTour) {
      setTourId(fetchedTour.id);
      setTourTitle(fetchedTour.title);
      setTourDescription(fetchedTour.description || '');
      const sortedSteps = fetchedTour.tourSteps.sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0));
      setTourSteps(sortedSteps.map((step) => ({ ...step, id: step.id || Date.now().toString() })));
      setSelectedStepIndex(0);
      setTourCurrentStatus(fetchedTour.status);
    }
  }, [isLoadTourSuccess, fetchedTour]);

  useEffect(() => {
    if (!urlTourId && tourSteps.length === 0 && !isLoadingTour && !isLoadTourError) {
      handleAddStep();
    } else if (urlTourId && !isLoadingTour && isLoadTourError && !tourId) {
      if (tourSteps.length === 0) {
        handleAddStep();
      }
    }
  }, [urlTourId, tourSteps.length, isLoadingTour, isLoadTourError, tourId]);

  const currentStep = tourSteps[selectedStepIndex];

  const saveTourMutation = useMutation<TourData, Error, { title: string, description: string, status: string, steps: TourStep[] }>({
    mutationFn: async (tourData) => {
      if (!user) {
        throw new Error("User not authenticated.");
      }
      const authHeaders = await user.getAuthHeaders();

      if (tourId) {
        const response = await api.put<TourData>(`/tours/${tourId}`, tourData, { headers: authHeaders });
        return response.data;
      } else {
        const response = await api.post<TourData>('/tours', tourData, { headers: authHeaders });
        return response.data;
      }
    },
    onSuccess: (data) => {
      setTourId(data.id);
      setTourTitle(data.title);
      setTourDescription(data.description || '');
      setTourCurrentStatus(data.status);
      const sortedSteps = data.tourSteps.sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0));
      setTourSteps(sortedSteps.map((step) => ({ ...step, id: step.id || Date.now().toString() })));
      setSelectedStepIndex(0);
      
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['tour', data.id] });

      alert('Tour saved successfully!');
      if (!urlTourId && data.id) {
        window.history.replaceState(null, '', `/editor?tourId=${data.id}`);
      }
    },
    onError: (err) => {
      console.error('Error saving tour:', err);
      alert(`Failed to save tour: ${err.message}`);
    },
  });

  const handleSaveTour = () => {
    if (!tourTitle.trim()) {
      alert("Tour title cannot be empty.");
      return;
    }
    if (tourSteps.some(step => !step.imageUrl && step.annotations.length > 0)) {
        alert("Steps with annotations must have an image.");
        return;
    }

    saveTourMutation.mutate({
      title: tourTitle,
      description: tourDescription,
      status: tourCurrentStatus,
      steps: tourSteps.map((step, index) => ({
        id: step.id?.includes('-') ? undefined : step.id,
        imageUrl: step.imageUrl,
        description: step.description,
        stepOrder: index,
        annotations: step.annotations.map(ann => ({ ...ann, id: ann.id?.includes('-') ? undefined : ann.id }))
      })),
    });
  };

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

  if (isLoadingTour || saveTourMutation.isPending) {
    return <div className="p-4 text-center text-lg">{isLoadingTour ? 'Loading tour...' : 'Saving tour...'}</div>;
  }

  if (isLoadTourError) {
    return <div className="p-4 text-center text-red-500">Error loading tour: {loadTourError?.message}</div>;
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
            <Button onClick={handleSaveTour} disabled={saveTourMutation.isPending} className="w-full bg-green-500 text-white">
              {saveTourMutation.isPending ? 'Saving...' : 'Save Tour'}
            </Button>
            {saveTourMutation.isError && <p className="text-red-500 text-sm">Error: {saveTourMutation.error?.message}</p>}
            {saveTourMutation.isSuccess && <p className="text-green-500 text-sm">Tour saved successfully!</p>}
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
              setTourCurrentStatus(newStatus);
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
