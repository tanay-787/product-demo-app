"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, GripVertical, Trash2, ChevronUp, ChevronDown, ImageIcon, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
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

interface SortableStepCardProps {
  step: TourStep
  index: number
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

function SortableStepCard({
  step,
  index,
  isSelected,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SortableStepCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id || `step-${index}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          "p-2 cursor-pointer transition-all duration-200 hover:shadow-md border",
          isSelected
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          isDragging && "opacity-50 shadow-lg",
        )}
        onClick={onSelect}
      >
        <div className="flex items-center gap-2">
          <div {...listeners} className="cursor-grab hover:cursor-grabbing p-1 hover:bg-muted rounded">
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium">Step {index + 1}</span>
              <div className="flex gap-1">
                {step.imageUrl && (
                  <Badge variant="secondary" className="h-4 px-1">
                    <ImageIcon className="w-2 h-2" />
                  </Badge>
                )}
                {step.annotations && step.annotations.length > 0 && (
                  <Badge variant="secondary" className="h-4 px-1">
                    <MessageSquare className="w-2 h-2" />
                    <span className="ml-1 text-xs">{step.annotations.length}</span>
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{step.description || "No description"}</p>
          </div>

          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onMoveUp()
              }}
              disabled={!canMoveUp}
              className="h-4 w-4 p-0 hover:bg-muted"
            >
              <ChevronUp className="w-2 h-2" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onMoveDown()
              }}
              disabled={!canMoveDown}
              className="h-4 w-4 p-0 hover:bg-muted"
            >
              <ChevronDown className="w-2 h-2" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function TourStepManager({
  tourSteps,
  selectedStepIndex,
  onSelectStep,
  onAddStep,
  onDeleteStep,
  onMoveStep,
  onReorderSteps,
}: TourStepManagerProps) {
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

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderSteps(oldIndex, newIndex)
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Tour Steps</h3>
        <Button onClick={onAddStep} size="sm" className="gap-1 h-7 px-2 text-xs">
          <Plus className="w-3 h-3" />
          Add Step
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={tourSteps.map((step, index) => step.id || `step-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tourSteps.map((step, index) => (
              <SortableStepCard
                key={step.id || `step-${index}`}
                step={step}
                index={index}
                isSelected={selectedStepIndex === index}
                onSelect={() => onSelectStep(index)}
                onDelete={() => onDeleteStep(index)}
                onMoveUp={() => onMoveStep(index, "up")}
                onMoveDown={() => onMoveStep(index, "down")}
                canMoveUp={index > 0}
                canMoveDown={index < tourSteps.length - 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
