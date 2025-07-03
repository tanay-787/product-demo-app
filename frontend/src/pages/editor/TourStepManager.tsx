"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { TourStep } from "./ProductTourEditor"

interface TourStepManagerProps {
  tourSteps: TourStep[]
  selectedStepIndex: number
  onSelectStep: (index: number) => void
  onAddStep: () => void
  onDeleteStep: (index: number) => void
  onMoveStep: (index: number, direction: "up" | "down") => void
  onReorderSteps: (oldIndex: number, newIndex: number) => void
}

interface SortableStepItemProps {
  step: TourStep
  index: number
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

const SortableStepItem: React.FC<SortableStepItemProps> = ({ step, index, isSelected, onSelect, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id || `step-${index}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? "ring-2 ring-primary border-primary bg-primary/5" : "hover:border-primary/50"
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  Step {index + 1}
                </Badge>
                {step.imageUrl && (
                  <Badge variant="outline" className="text-xs">
                    Image
                  </Badge>
                )}
                {step.annotations && step.annotations.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {step.annotations.length} annotations
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground truncate">{step.description || "No description"}</p>

              {step.imageUrl && (
                <div className="mt-2">
                  <img
                    src={step.imageUrl || "/placeholder.svg"}
                    alt={`Step ${index + 1}`}
                    className="w-full h-16 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const TourStepManager: React.FC<TourStepManagerProps> = ({
  tourSteps,
  selectedStepIndex,
  onSelectStep,
  onAddStep,
  onDeleteStep,
  onMoveStep,
  onReorderSteps,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = tourSteps.findIndex((step) => (step.id || `step-${tourSteps.indexOf(step)}`) === active.id)
      const newIndex = tourSteps.findIndex((step) => (step.id || `step-${tourSteps.indexOf(step)}`) === over.id)

      onReorderSteps(oldIndex, newIndex)
    }
  }

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-card-foreground">Tour Steps</h3>
        <Button onClick={onAddStep} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Step
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={tourSteps.map((step, index) => step.id || `step-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
            <AnimatePresence>
              {tourSteps.map((step, index) => (
                <SortableStepItem
                  key={step.id || `step-${index}`}
                  step={step}
                  index={index}
                  isSelected={selectedStepIndex === index}
                  onSelect={() => onSelectStep(index)}
                  onDelete={() => onDeleteStep(index)}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {tourSteps.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No steps yet. Add your first step to get started!</p>
        </div>
      )}
    </div>
  )
}

export default TourStepManager
