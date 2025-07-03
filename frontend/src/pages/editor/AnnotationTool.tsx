"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface AnnotationToolProps {
  onAddAnnotation: (text: string, x: number, y: number) => void
}

export default function AnnotationTool({ onAddAnnotation }: AnnotationToolProps) {
  const [annotationText, setAnnotationText] = useState("")
  const [positionX, setPositionX] = useState(50)
  const [positionY, setPositionY] = useState(50)

  const handleAddAnnotation = () => {
    if (!annotationText.trim()) {
      alert("Please enter annotation text")
      return
    }

    onAddAnnotation(annotationText, positionX, positionY)
    setAnnotationText("")
    setPositionX(50)
    setPositionY(50)
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="annotation-text" className="text-xs font-medium">
          Annotation Text
        </Label>
        <Input
          id="annotation-text"
          value={annotationText}
          onChange={(e) => setAnnotationText(e.target.value)}
          placeholder="Enter annotation..."
          className="mt-1 h-8 text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="position-x" className="text-xs font-medium">
            Position X (%)
          </Label>
          <Input
            id="position-x"
            type="number"
            min="0"
            max="100"
            value={positionX}
            onChange={(e) => setPositionX(Number(e.target.value))}
            className="mt-1 h-8 text-xs"
          />
        </div>
        <div>
          <Label htmlFor="position-y" className="text-xs font-medium">
            Position Y (%)
          </Label>
          <Input
            id="position-y"
            type="number"
            min="0"
            max="100"
            value={positionY}
            onChange={(e) => setPositionY(Number(e.target.value))}
            className="mt-1 h-8 text-xs"
          />
        </div>
      </div>

      <Button onClick={handleAddAnnotation} size="sm" className="w-full gap-1 h-7 text-xs">
        <Plus className="w-3 h-3" />
        Add Annotation
      </Button>
    </div>
  )
}
