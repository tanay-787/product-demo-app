"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { EditorHeader } from "@/components/editor-header"
import { TourDetailsDialog } from "@/components/tour-details-dialog"
import ResourceUploader from "@/components/resource-uploader"
import TourStepManager from "./TourStepManager"
import TourPreview from "./TourPreview"
import AnnotationTool from "./AnnotationTool"
import PublishControls from "./PublishControls" // Import PublishControls
import { useUser } from "@stackframe/react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "motion/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { arrayMove } from "@dnd-kit/sortable"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog" // Import Dialog components

export interface Annotation {
  id?: string
  text: string
  x: number
  y: number
}

export interface TourStep {
  id?: string
  imageUrl: string | null
  videoUrl: string | null
  description: string
  annotations: Annotation[]
  stepOrder?: number
}

interface TourData {
  id: string
  title: string
  description?: string
  status: "draft" | "published" | "private"
  sharingStatus?: "private" | "public" | "password_protected"
  tourSteps: TourStep[]
}

const ProductTourEditor: React.FC = () => {
  const user = useUser({ or: "redirect" })
  const [searchParams] = useSearchParams()
  const urlTourId = searchParams.get("tourId")
  const queryClient = useQueryClient()

  const [tourId, setTourId] = useState<string | null>(null)
  const [tourTitle, setTourTitle] = useState<string>("")
  const [tourDescription, setTourDescription] = useState<string>("")
  const [tourSteps, setTourSteps] = useState<TourStep[]>([])
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0)
  const [direction, setDirection] = useState(0)
  const [tourCurrentStatus, setTourCurrentStatus] = useState<"draft" | "published" | "private">("draft")
  const [isPublishControlsOpen, setIsPublishControlsOpen] = useState(false) // New state for PublishControls dialog

  const {
    data: fetchedTour,
    isLoading: isLoadingTour,
    isError: isLoadTourError,
    error: loadTourError,
    isSuccess: isLoadTourSuccess,
  } = useQuery<TourData, Error>({
    queryKey: ["tour", urlTourId],
    queryFn: async () => {
      if (!urlTourId) {
        throw new Error("Tour ID is missing.")
      }
      if (!user) {
        throw new Error("User not authenticated.")
      }
      const authHeaders = await user.getAuthHeaders()
      const response = await api.get<TourData>(`/tours/${urlTourId}`, { headers: authHeaders })
      return response.data
    },
    enabled: !!urlTourId && !!user,
  })

  useEffect(() => {
    if (isLoadTourSuccess && fetchedTour) {
      setTourId(fetchedTour.id)
      setTourTitle(fetchedTour.title)
      setTourDescription(fetchedTour.description || "")
      const sortedSteps = fetchedTour.tourSteps.sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0))
      setTourSteps(
        sortedSteps.map((step) => ({
          ...step,
          id: step.id || Date.now().toString(),
          videoUrl: step.videoUrl || null,
        })),
      )
      setSelectedStepIndex(0)
      setTourCurrentStatus(fetchedTour.status)
    }
  }, [isLoadTourSuccess, fetchedTour])

  useEffect(() => {
    if (!urlTourId && tourSteps.length === 0 && !isLoadingTour && !isLoadTourError) {
      handleAddStep()
    } else if (urlTourId && !isLoadingTour && isLoadTourError && !tourId) {
      if (tourSteps.length === 0) {
        handleAddStep()
      }
    }
  }, [urlTourId, tourSteps.length, isLoadingTour, isLoadTourError, tourId])

  const currentStep = tourSteps[selectedStepIndex]

  const saveTourMutation = useMutation<
    TourData,
    Error,
    { title: string; description: string; status: string; steps: TourStep[] }
  >({
    mutationFn: async (tourData) => {
      if (!user) {
        throw new Error("User not authenticated.")
      }
      const authHeaders = await user.getAuthHeaders()

      if (tourId) {
        const response = await api.put<TourData>(`/tours/${tourId}`, tourData, { headers: authHeaders })
        return response.data
      } else {
        const response = await api.post<TourData>("/tours", tourData, { headers: authHeaders })
        return response.data
      }
    },
    onSuccess: (data) => {
      console.log('Data received in onSuccess:', data); // Added for debugging
      setTourId(data.id)
      setTourTitle(data.title)
      setTourDescription(data.description || "")
      setTourCurrentStatus(data.status)
      const sortedSteps = data.tourSteps.sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0))
      setTourSteps(
        sortedSteps.map((step) => ({
          ...step,
          id: step.id || Date.now().toString(),
          videoUrl: step.videoUrl || null,
        })),
      )
      setSelectedStepIndex(0)

      queryClient.invalidateQueries({ queryKey: ["tours"] })
      queryClient.invalidateQueries({ queryKey: ["tour", data.id] })

      if (!urlTourId && data.id) {
        window.history.replaceState(null, "", `/editor?tourId=${data.id}`)
      }
    },
    onError: (err) => {
      console.error("Error saving tour:", err)
    },
  })

  const handleSaveTour = () => {
    if (!tourTitle.trim()) {
      alert("Tour title cannot be empty.")
      return
    }
    if (tourSteps.some((step) => !step.imageUrl && !step.videoUrl && step.annotations.length > 0)) {
      alert("Steps with annotations must have an image or video.")
      return
    }

    console.log("Sending tour steps to backend:", tourSteps); // Added for debugging

    saveTourMutation.mutate({
      title: tourTitle,
      description: tourDescription,
      status: tourCurrentStatus,
      steps: tourSteps.map((step, index) => ({
        id: step.id?.includes("-") ? undefined : step.id,
        imageUrl: step.imageUrl,
        videoUrl: step.videoUrl,
        description: step.description,
        stepOrder: index,
        annotations: step.annotations.map((ann) => ({
          ...ann,
          id: ann.id?.includes("-") ? undefined : ann.id,
        })),
      })),
    })
  }

  const handleAddStep = () => {
    const newStep: TourStep = {
      id: Date.now().toString(),
      imageUrl: null,
      videoUrl: null,
      description: "",
      annotations: [],
    }
    setTourSteps((prevSteps) => [...prevSteps, newStep])
    setSelectedStepIndex(tourSteps.length)
  }

  const handleDeleteStep = (index: number) => {
    if (tourSteps.length === 1) {
      alert("Cannot delete the last step. A tour must have at least one step.")
      return
    }
    setTourSteps((prevSteps) => prevSteps.filter((_, i) => i !== index))
    if (selectedStepIndex === index) {
      setSelectedStepIndex(Math.max(0, index - 1))
    } else if (selectedStepIndex > index) {
      setSelectedStepIndex(selectedStepIndex - 1)
    }
  }

  const handleSelectStep = (index: number) => {
    if (index > selectedStepIndex) setDirection(1)
    else setDirection(-1)
    setSelectedStepIndex(index)
  }

  const handleReorderSteps = (oldIndex: number, newIndex: number) => {
    setTourSteps((prevSteps) => {
      const newSteps = arrayMove(prevSteps, oldIndex, newIndex)

      if (selectedStepIndex === oldIndex) {
        setSelectedStepIndex(newIndex)
      } else if (selectedStepIndex > oldIndex && selectedStepIndex <= newIndex) {
        setSelectedStepIndex(selectedStepIndex - 1)
      } else if (selectedStepIndex < oldIndex && selectedStepIndex >= newIndex) {
        setSelectedStepIndex(selectedStepIndex + 1)
      }

      return newSteps
    })
  }

  const handleResourceUpload = (url: string | null, type: "image" | "video" | null) => {
    console.log("handleResourceUpload received - URL:", url, "Type:", type); // Added for debugging
    setTourSteps((prevSteps) => {
      const updatedSteps = prevSteps.map((step, idx) =>
        idx === selectedStepIndex
          ? {
              ...step,
              imageUrl: type === "image" ? url : null,
              videoUrl: type === "video" ? url : null,
              annotations: [], // Clear annotations when changing resource
            }
          : step,
      );
      console.log("Tour steps after handleResourceUpload:", updatedSteps); // Added for debugging
      return updatedSteps;
    });
  };

  const handleStepDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value
    setTourSteps((prevSteps) =>
      prevSteps.map((step, idx) => (idx === selectedStepIndex ? { ...step, description: newDescription } : step)),
    )
  }

  const handleAddAnnotation = (text: string, x: number, y: number) => {
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      text,
      x,
      y,
    }
    setTourSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === selectedStepIndex ? { ...step, annotations: [...step.annotations, newAnnotation] } : step,
      ),
    )
  }

  const handleUpdateAnnotationPosition = (annotationId: string, newX: number, newY: number) => {
    setTourSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === selectedStepIndex
          ? {
              ...step,
              annotations: step.annotations.map((ann) =>
                ann.id === annotationId ? { ...ann, x: newX, y: newY } : ann,
              ),
            }
          : step,
      ),
    )
  }

  const handleDeleteAnnotation = (annotationId: string) => {
    setTourSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === selectedStepIndex
          ? {
              ...step,
              annotations: step.annotations.filter((ann) => ann.id !== annotationId),
            }
          : step,
      ),
    )
  }

  const handleMoveStep = (index: number, moveDirection: "up" | "down") => {
    setTourSteps((prevSteps) => {
      const newSteps = [...prevSteps]
      const [movedStep] = newSteps.splice(index, 1)
      const newIndex = moveDirection === "up" ? index - 1 : index + 1
      newSteps.splice(newIndex, 0, movedStep)
      setSelectedStepIndex(newIndex)
      return newSteps
    })
  }

  const handleNextStepInEditor = () => {
    if (selectedStepIndex < tourSteps.length - 1) {
      setDirection(1)
      setSelectedStepIndex((prevIndex) => prevIndex + 1)
    }
  }

  const handlePreviousStepInEditor = () => {
    if (selectedStepIndex > 0) {
      setDirection(-1)
      setSelectedStepIndex((prevIndex) => prevIndex - 1)
    }
  }

  const handleUpdateTourStatus = async (newStatus: "draft" | "published" | "private") => {
    if (!user || !tourId) return;
    try {
      const authHeaders = await user.getAuthHeaders();
      await api.patch(`/tours/${tourId}/status`, { status: newStatus }, { headers: authHeaders });
      setTourCurrentStatus(newStatus);
      queryClient.invalidateQueries({ queryKey: ["tour", tourId] });
      queryClient.invalidateQueries({ queryKey: ["tours"] }); // Invalidate tour list to update status there too
    } catch (error) {
      console.error("Failed to update tour status:", error);
      alert("Failed to update tour status.");
    }
  };

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

  if (isLoadingTour) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-sm">Loading tour...</div>
      </div>
    )
  }

  if (isLoadTourError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-destructive text-sm">
          <p>Error loading tour: {loadTourError?.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background text-sm">
      {/* Header */}
      <EditorHeader
        currentTourId={tourId}
        currentTourTitle={tourTitle || "Untitled Tour"}
        onSave={handleSaveTour}
        isSaving={saveTourMutation.isPending}
        onShareClick={() => {
          console.log("Share button in EditorHeader clicked!"); // <-- Added/Confirmed this log
          setIsPublishControlsOpen(true);
        }} // Open dialog on share button click
      />

      {/* Tour Details - Compact Header */}
      <div className="border-b border-border">
        <TourDetailsDialog
          title={tourTitle}
          description={tourDescription}
          status={tourCurrentStatus}
          onTitleChange={setTourTitle}
          onDescriptionChange={setTourDescription}
          onSave={handleSaveTour}
          isSaving={saveTourMutation.isPending}
        />
      </div>

      {/* Main Content - Resizable Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Tour Steps */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full flex flex-col border-r border-border">
              <ScrollArea className="flex-1">
                <div className="p-3">
                  <TourStepManager
                    tourSteps={tourSteps}
                    selectedStepIndex={selectedStepIndex}
                    onSelectStep={handleSelectStep}
                    onAddStep={handleAddStep}
                    onDeleteStep={handleDeleteStep}
                    onMoveStep={handleMoveStep}
                    onReorderSteps={handleReorderSteps}
                  />
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Preview */}
          <ResizablePanel defaultSize={50} minSize={40}>
            <div className="h-full flex flex-col">
              <div className="p-2 border-b border-border">
                <h3 className="font-semibold text-sm">Preview</h3>
              </div>

              <div className="flex-1 p-3">
                <div className="h-full relative overflow-hidden border border-border rounded-lg bg-muted/30">
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
                        opacity: { duration: 0.2 },
                      }}
                      className="absolute inset-0"
                    >
                      <TourPreview
                        imageUrl={currentStep?.imageUrl || null}
                        videoUrl={currentStep?.videoUrl || null}
                        annotations={currentStep?.annotations || []}
                        onUpdateAnnotationPosition={handleUpdateAnnotationPosition}
                        onDeleteAnnotation={handleDeleteAnnotation}
                      />
                    </motion.div>
                  </AnimatePresence>

                    {/* Tour Description below preview */}
                  {currentStep?.description && (
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground p-2 rounded-md max-w-xs text-xs text-center shadow-lg z-10 border"
                      >
                          {currentStep.description}
                      </motion.div>
                  )}
                </div>

                  {/* Navigation */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                  <Button
                    onClick={handlePreviousStepInEditor}
                    disabled={selectedStepIndex === 0}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs bg-transparent"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Step {selectedStepIndex + 1} of {tourSteps.length}
                    </span>
                  </div>
                  <Button
                    onClick={handleNextStepInEditor}
                    disabled={selectedStepIndex === tourSteps.length - 1}
                    size="sm"
                    className="h-7 px-2 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div> {/* <-- Added the missing closing div here */} 
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Step Content Editor */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full flex flex-col">
              <div className="p-2 border-b border-border">
                <h3 className="font-semibold text-sm">Step Content</h3>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-3 space-y-3">
                  {currentStep && (
                      <>
                        {/* Step Description */}
                        <div>
                          <Label htmlFor="step-description" className="text-xs font-medium">
                            Description
                          </Label>
                          <Textarea
                            id="step-description"
                            value={currentStep.description}
                            onChange={handleStepDescriptionChange}
                            placeholder="Describe this step..."
                            rows={2}
                            className="mt-1 text-xs"
                          />
                        </div>

                        <Separator />

                        {/* Resource Upload */}
                        <div>
                          <Label className="text-xs font-medium mb-2 block">Media</Label>
                          <ResourceUploader
                            onResourceUpload={handleResourceUpload}
                            currentResourceUrl={currentStep.imageUrl || currentStep.videoUrl}
                            currentResourceType={currentStep.imageUrl ? "image" : currentStep.videoUrl ? "video" : null}
                          />
                        </div>

                        <Separator />

                        {/* Annotations */}
                        <div>
                          <Label className="text-xs font-medium mb-2 block">Add Annotation</Label>
                          <AnnotationTool onAddAnnotation={handleAddAnnotation} />
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
                
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

      {/* Publish Controls Dialog - Correctly placed as an overlay */}
      <Dialog open={isPublishControlsOpen} onOpenChange={setIsPublishControlsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Publish & Share Tour</DialogTitle>
            <DialogDescription>
              Control your tour's visibility and get shareable links.
            </DialogDescription>
          </DialogHeader>
          <PublishControls 
            tourId={tourId}
            initialStatus={tourCurrentStatus}
            onStatusChange={handleUpdateTourStatus}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductTourEditor
