"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Edit3, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TourDetailsDialogProps {
  title: string
  description: string
  status: "draft" | "published" | "private"
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onSave: () => void
  isSaving?: boolean
}

export function TourDetailsDialog({
  title,
  description,
  status,
  onTitleChange,
  onDescriptionChange,
  onSave,
  isSaving = false,
}: TourDetailsDialogProps) {
  const [open, setOpen] = React.useState(false)

  const handleSave = () => {
    onSave()
    setOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "private":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer group hover:bg-muted/30 px-4 py-2 transition-colors flex items-center justify-center">
          <div className="flex items-center gap-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold group-hover:text-primary transition-colors">
                {title || "Untitled Tour"}
              </h2>
              <Badge variant="outline" className={`text-xs ${getStatusColor(status)}`}>
                {status}
              </Badge>
            </div>
            <div className="h-4 w-px bg-border" />
            <p className="text-sm text-muted-foreground">
              {description ? truncateText(description, 60) : "Click to add description..."}
            </p>
            <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground ml-2" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Tour Details</DialogTitle>
          <DialogDescription>Update your tour title and description.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="dialog-title" className="text-sm font-medium">
              Tour Title
            </Label>
            <Input
              id="dialog-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter tour title..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dialog-description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="dialog-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Brief description of your tour..."
              rows={3}
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
