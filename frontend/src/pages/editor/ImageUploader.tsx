"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string | null) => void
  currentImageUrl?: string | null
}

export default function ImageUploader({ onImageUpload, currentImageUrl }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    setIsUploading(true)
    try {
      // Create a data URL for the image
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageUpload(result)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image")
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleRemoveImage = () => {
    onImageUpload(null)
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

      {currentImageUrl ? (
        <Card className="p-2">
          <div className="relative">
            <img
              src={currentImageUrl || "/placeholder.svg"}
              alt="Uploaded screenshot"
              className="w-full h-24 object-cover rounded border"
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleChooseFile}
            className="w-full mt-2 h-7 text-xs bg-transparent"
            disabled={isUploading}
          >
            <Upload className="w-3 h-3 mr-1" />
            Replace Image
          </Button>
        </Card>
      ) : (
        <Card
          className={cn(
            "border-2 border-dashed p-4 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleChooseFile}
        >
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
            <div className="text-xs text-muted-foreground text-center">
              {isUploading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <p>Drop image here or click to upload</p>
                  <p className="text-xs opacity-75">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
