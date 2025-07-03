"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Move } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Annotation } from "./ProductTourEditor"

interface TourPreviewProps {
  imageUrl: string | null
  videoUrl: string | null // Added videoUrl
  annotations: Annotation[]
  onUpdateAnnotationPosition: (annotationId: string, newX: number, newY: number) => void
  onDeleteAnnotation: (annotationId: string) => void
}

interface DraggableAnnotationProps {
  annotation: Annotation
  onUpdatePosition: (newX: number, newY: number) => void
  onDelete: () => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

function DraggableAnnotation({ annotation, onUpdatePosition, onDelete, containerRef }: DraggableAnnotationProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const annotationRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || !annotationRef.current) return

    setIsDragging(true)
    const containerRect = containerRef.current.getBoundingClientRect()
    const annotationRect = annotationRef.current.getBoundingClientRect()

    setDragStart({
      x: e.clientX - annotationRect.left,
      y: e.clientY - annotationRect.top,
    })

    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newX = ((e.clientX - dragStart.x - containerRect.left) / containerRect.width) * 100
    const newY = ((e.clientY - dragStart.y - containerRect.top) / containerRect.height) * 100

    const clampedX = Math.max(0, Math.min(95, newX))
    const clampedY = Math.max(0, Math.min(95, newY))

    onUpdatePosition(clampedX, clampedY)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  return (
    <div
      ref={annotationRef}
      className={cn(
        "absolute bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs shadow-lg cursor-move select-none group border-2 border-primary/20",
        isDragging && "opacity-75 shadow-xl border-primary",
      )}
      style={{
        left: `${annotation.x}%`,
        top: `${annotation.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-1">
        <Move className="w-2 h-2 opacity-50" />
        <span>{annotation.text}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="h-4 w-4 p-0 hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-2 h-2" />
        </Button>
      </div>
    </div>
  )
}

export default function TourPreview({
  imageUrl,
  videoUrl,
  annotations,
  onUpdateAnnotationPosition,
  onDeleteAnnotation,
}: TourPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center bg-muted/20">
      {imageUrl || videoUrl ? (
        <div className="relative max-w-full max-h-full">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Tour step preview"
              className="max-w-full max-h-full object-contain rounded border shadow-sm"
            />
          )}
          {videoUrl && (
            <video
              src={videoUrl}
              controls
              className="max-w-full max-h-full object-contain rounded border shadow-sm"
            />
          )}
          {annotations.map((annotation) => (
            <DraggableAnnotation
              key={annotation.id}
              annotation={annotation}
              onUpdatePosition={(newX, newY) => onUpdateAnnotationPosition(annotation.id!, newX, newY)}
              onDelete={() => onDeleteAnnotation(annotation.id!)}
              containerRef={containerRef}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground p-8">
          <div className="text-sm">Upload an image or record your screen to see a preview.</div>
        </div>
      )}
    </div>
  )
}