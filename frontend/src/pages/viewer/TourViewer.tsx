import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { type TourStep, type Annotation } from '../editor/ProductTourEditor';
import TourPreview from '../editor/TourPreview';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '@stackframe/react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface TourData {
  id: string;
  title: string;
  description?: string;
  status: string;
  tourSteps: TourStep[];
}

const TourViewer: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const user = useUser(); // Get user object to access auth headers

  const trackEvent = useCallback(async (event: string, data: Record<string, any>) => {
    if (!tourId) return;

    try {
      // Only send auth headers if the user is logged in
      const authHeaders = user ? await user.getAuthHeaders() : {};

      await api.post('/analytics', {
        event,
        tourId,
        timestamp: new Date().toISOString(),
        ...data,
      }, { headers: authHeaders }); // Pass headers here
    } catch (e) {
      console.error('Failed to send analytics event:', e);
    }
  }, [tourId, user]); // Added user to dependency array

  const { data: tour, isLoading, isError, error, isSuccess } = useQuery<TourData, Error>({
    queryKey: ['publicTour', tourId],
    queryFn: async () => {
      if (!tourId) {
        throw new Error("Tour ID is missing.");
      }
      // Public route, no auth headers needed for fetching the tour itself
      const response = await api.get<TourData>(`/view/${tourId}`);
      response.data.tourSteps.sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0));
      return response.data;
    },
    enabled: !!tourId,
  });

  // Handle tour viewed event using useEffect after successful query
  useEffect(() => {
    if (isSuccess && tour) {
      trackEvent('tour_viewed', { tourTitle: tour.title });
    }
  }, [isSuccess, tour, trackEvent]);

  // Track step viewed event when currentStepIndex changes, and tour data is available
  useEffect(() => {
    if (tour && currentStepIndex !== -1) { 
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

  if (isError) {
    return <div className="p-8 text-center text-red-500">Error loading tour: {error?.message}</div>;
  }

  if (!tour) {
    return <div className="p-8 text-center text-gray-500">Tour not found.</div>;
  }

  const currentStep = tour.tourSteps[currentStepIndex];

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
              key={currentStepIndex}
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
