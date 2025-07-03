import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useUser } from "@stackframe/react"
import TourPreview from "../editor/tour-preview"
import type { Annotation, TourStep } from "../editor/product-tour-editor"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"

interface TourData {
  id: string
  title: string
  description?: string
  status: "draft" | "published" | "private"
  tourSteps: TourStep[]
}

export default function TourViewer() {
  const { tourId } = useParams<{ tourId: string }>()
  const user = useUser()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const {
    data: tour,
    isLoading,
    isError,
    error,
  } = useQuery<TourData, Error>({
    queryKey: ["viewTour", tourId],
    queryFn: async () => {
      if (!tourId) {
        throw new Error("Tour ID is missing.")
      }
      const authHeaders = user ? await user.getAuthHeaders() : {}
      // FIX: Changed `/api/view/${tourId}` to `/view/${tourId}` to avoid double `/api/api/`
      const response = await api.get<TourData>(`/view/${tourId}`, { headers: authHeaders })
      
      // Debugging: Log the raw response data
      console.log("Raw tour data from backend (TourViewer):", response.data);

      // Ensure tourSteps is an array before sorting
      if (response.data.tourSteps && Array.isArray(response.data.tourSteps)) {
        response.data.tourSteps.sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0))
      } else {
        console.warn("tourSteps is not an array or is missing from backend response:", response.data.tourSteps);
        response.data.tourSteps = []; // Ensure it's an empty array to prevent sort errors
      }
      
      return response.data
    },
    enabled: !!tourId,
  })

  // Debugging: Log the tour object after useQuery
  useEffect(() => {
    if (tour) {
      console.log("Tour object in TourViewer (after query):", tour);
      console.log("Tour steps in TourViewer (after query):", tour.tourSteps);
    }
  }, [tour]);

  const currentStep = tour?.tourSteps[currentStepIndex]

  const handleNextStep = () => {
    if (tour && currentStepIndex < tour.tourSteps.length - 1) {
      setDirection(1)
      setCurrentStepIndex((prev) => prev + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setDirection(-1)
      setCurrentStepIndex((prev) => prev - 1)
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading tour...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-destructive p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Error Loading Tour</h1>
          <p>{error?.message || "An unexpected error occurred."}</p>
          {error?.message === "Tour not found." && (
            <p className="mt-2">Please check the tour ID or ensure the tour is public/shared correctly.</p>
          )}
        </div>
      </div>
    )
  }

  if (!tour || tour.tourSteps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">No tour steps found for this tour.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative">
      <h1 className="text-2xl font-bold mb-4 text-foreground">{tour.title}</h1>

      <div className="relative w-full max-w-4xl h-[70vh] border rounded-lg shadow-lg overflow-hidden bg-muted/20 flex items-center justify-center">
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
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <TourPreview
              imageUrl={currentStep?.imageUrl || null}
              videoUrl={currentStep?.videoUrl || null} // Pass videoUrl here
              annotations={currentStep?.annotations || []}
              // onUpdateAnnotationPosition and onDeleteAnnotation are optional, so no need to pass them
            />
          </motion.div>
        </AnimatePresence>

        {currentStep?.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground p-3 rounded-md max-w-xs text-sm text-center shadow-lg z-10"
          >
            {currentStep.description}
          </motion.div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={handlePreviousStep} disabled={currentStepIndex === 0}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <span className="text-muted-foreground text-sm">
          Step {currentStepIndex + 1} of {tour.tourSteps.length}
        </span>
        <Button onClick={handleNextStep} disabled={currentStepIndex === tour.tourSteps.length - 1}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <Toaster />
    </div>
  )
}
