import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { type TourStep, type Annotation } from '../editor/ProductTourEditor';
import TourPreview from '../editor/TourPreview';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '@stackframe/react'; // Import useUser

interface TourData {
  id: string;
  title: string;
  description?: string;
  status: string;
  tourSteps: TourStep[];
}

const TourViewer: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const [tour, setTour] = useState<TourData | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser(); // Get user session (null if not logged in)

  // Function to send analytics events
  const trackEvent = useCallback(async (event: string, data: Record<string, any>) => {
    if (!tourId) return; // Cannot track without a tourId

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          tourId,
          timestamp: new Date().toISOString(),
          ...data,
        }),
      });
    } catch (e) {
      console.error('Failed to send analytics event:', e);
    }
  }, [tourId]);

  useEffect(() => {
    if (tourId) {
      const fetchTour = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/view/${tourId}`); // Fetch from public view endpoint
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
          const data: TourData = await response.json();
          // Ensure steps are sorted by stepOrder for correct playback
          data.tourSteps.sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0));
          setTour(data);

          // Track tour viewed event
          trackEvent('tour_viewed', { tourTitle: data.title });

        } catch (e: any) {
          console.error('Error fetching tour for viewer:', e);
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTour();
    }
  }, [tourId, trackEvent]);

  // Track step viewed event when currentStepIndex changes
  useEffect(() => {
    if (tour && currentStepIndex !== -1) { // Only track if a tour is loaded and a step is selected
      trackEvent('step_viewed', { stepIndex: currentStepIndex, stepDescription: tour.tourSteps[currentStepIndex]?.description });
    }
  }, [currentStepIndex, tour, trackEvent]);

  const handleNextStep = () => {
    if (tour && currentStepIndex < tour.tourSteps.length - 1) {
      paginate(1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      paginate(-1);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xl">Loading tour...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading tour: {error}</div>;
  }

  if (!tour) {
    return <div className="p-8 text-center text-gray-500">Tour not found.</div>;
  }

  const currentStep = tour.tourSteps[currentStepIndex];

  // Define animation variants for slide transition
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

  // State to determine animation direction
  const [direction, setDirection] = useState(0);
  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentStepIndex((prev) => prev + newDirection);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-4">{tour.title}</h1>
        {tour.description && <p className="text-center text-muted-foreground mb-6">{tour.description}</p>}

        <div className="relative mb-6 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentStepIndex} // Key is crucial for AnimatePresence to detect changes
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full"
            >
              <TourPreview
                imageUrl={currentStep?.imageUrl || null}
                annotations={currentStep?.annotations || []}
              />
              {currentStep?.description && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white p-3 rounded-md max-w-xs text-sm text-center">
                  {currentStep.description}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button onClick={handlePreviousStep} disabled={currentStepIndex === 0} variant="outline">
            Previous
          </Button>
          <span className="text-lg font-semibold">{currentStepIndex + 1} / {tour.tourSteps.length}</span>
          <Button onClick={handleNextStep} disabled={currentStepIndex === tour.tourSteps.length - 1}>
            Next
          </Button>
        </div>

        {user && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Want to create your own interactive tours?</p>
            <div className="flex justify-center space-x-4">
              <Link to="/projects">
                <Button>Go to Dashboard</Button>
              </Link>
              <Link to="/editor">
                <Button variant="outline">Create New Tour</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Powered by Miniature Full-Stack Collaborative Product Demo Platform
      </footer>
    </div>
  );
};

export default TourViewer;
