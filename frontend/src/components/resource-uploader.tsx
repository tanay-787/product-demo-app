"use client"

import type * as React from "react"
import { useRef, useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Dropzone,
  DropzoneDescription,
  DropzoneGroup,
  DropzoneInput,
  DropzoneTitle,
  DropzoneUploadIcon,
  DropzoneZone,
} from "@/components/ui/dropzone"
import {
  FileList,
  FileListDescription,
  FileListHeader,
  FileListIcon,
  FileListInfo,
  FileListItem,
  FileListName,
  FileListSize,
  FileListAction,
} from "@/components/ui/file-list"
import { Upload, Video, Square, ImageIcon, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResourceUploaderProps {
  onResourceUpload: (url: string | null, type: "image" | "video" | null) => void
  currentResourceUrl?: string | null
  currentResourceType?: "image" | "video" | null
}

export default function ResourceUploader({
  onResourceUpload,
  currentResourceUrl,
  currentResourceType,
}: ResourceUploaderProps) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState<number>(0)
  const [previewPlaying, setPreviewPlaying] = useState<boolean>(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null)

  // Reset internal state when dialog closes or a new resource is selected externally
  useEffect(() => {
    if (!open) {
      setFiles([])
      setRecordedVideoUrl(null)
      setRecordingTime(0)
      setPreviewPlaying(false)
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [])

  const handleFileDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setFiles([file])
        setRecordedVideoUrl(null) // Clear any recorded video

        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            onResourceUpload(result, "image")
            setOpen(false)
          }
          reader.readAsDataURL(file)
        } else if (file.type.startsWith("video/")) {
          const url = URL.createObjectURL(file)
          onResourceUpload(url, "video")
          setOpen(false)
        }
      }
    },
    [onResourceUpload],
  )

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      })

      mediaRecorderRef.current = mediaRecorder
      recordedChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setRecordedVideoUrl(url)
        onResourceUpload(url, "video")

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())

        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current)
        }

        setOpen(false)
      }

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      mediaRecorder.start(1000) // Record in 1-second chunks
      setIsRecording(true)
      setRecordedVideoUrl(null)
      setFiles([])
      setRecordingTime(0)
    } catch (error) {
      console.error("Error starting screen recording:", error)
      alert("Failed to start screen recording. Please ensure you grant screen sharing permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const handleRemoveResource = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    onResourceUpload(null, null)
    setFiles([])
    setRecordedVideoUrl(null)
  }

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter((f) => f !== fileToRemove))
  }

  const toggleVideoPreview = () => {
    if (videoPreviewRef.current) {
      if (previewPlaying) {
        videoPreviewRef.current.pause()
      } else {
        videoPreviewRef.current.play()
      }
      setPreviewPlaying(!previewPlaying)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {currentResourceUrl ? (
          <div className="relative group w-full">
            {currentResourceType === "image" ? (
              <div className="relative">
                <img
                  src={currentResourceUrl || "/placeholder.svg"}
                  alt="Uploaded resource"
                  className="w-full h-20 object-cover rounded border cursor-pointer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <video src={currentResourceUrl} className="w-full h-20 object-cover rounded border cursor-pointer" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center">
                  <Video className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveResource}
              className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </Button>
            <Button variant="outline" size="sm" className="w-full mt-1 h-6 text-xs bg-transparent">
              <Upload className="w-2.5 h-2.5 mr-1" />
              Replace
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed p-3 text-center cursor-pointer transition-colors w-full rounded-md",
              "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
            )}
          >
            <div className="flex flex-col items-center gap-1.5">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
              <div className="text-xs text-muted-foreground text-center">
                <p className="font-medium">Upload or Record</p>
                <p className="text-xs opacity-75">PNG, JPG, MP4, WebM</p>
              </div>
            </div>
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Resource</DialogTitle>
          <DialogDescription className="text-sm">
            Upload an image/video or record your screen for this step.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Dropzone */}
          <Dropzone
            accept={{
              "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
              "video/*": [".mp4", ".webm", ".mov", ".avi"],
            }}
            maxSize={10 * 1024 * 1024} // 10MB
            onDropAccepted={handleFileDrop}
            onDropRejected={(rejectedFiles) => {
              const errors = rejectedFiles[0]?.errors || []
              if (errors.some((e) => e.code === "file-too-large")) {
                alert("File is too large. Maximum size is 10MB.")
              } else if (errors.some((e) => e.code === "file-invalid-type")) {
                alert("Invalid file type. Please upload an image or video.")
              }
            }}
          >
            <DropzoneZone className="p-4">
              <DropzoneInput />
              <DropzoneGroup className="gap-3">
                <DropzoneUploadIcon className="w-6 h-6" />
                <DropzoneGroup className="gap-1">
                  <DropzoneTitle className="text-sm">Drop files here or click to browse</DropzoneTitle>
                  <DropzoneDescription className="text-xs">Images and videos up to 10MB</DropzoneDescription>
                </DropzoneGroup>
              </DropzoneGroup>
            </DropzoneZone>
          </Dropzone>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground bg-background px-2">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Screen Recording */}
          <div className="space-y-3">
            {!isRecording ? (
              <Button onClick={startRecording} className="w-full gap-2 h-9 bg-transparent" variant="outline">
                <Video className="h-4 w-4" />
                Start Screen Recording
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Recording...</span>
                    <span className="text-sm text-muted-foreground">{formatTime(recordingTime)}</span>
                  </div>
                  <Button onClick={stopRecording} size="sm" variant="destructive" className="gap-1 h-7">
                    <Square className="h-3 w-3" />
                    Stop
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">Click "Stop" when you're finished recording</p>
              </div>
            )}
          </div>

          {/* File Preview */}
          {(files.length > 0 || recordedVideoUrl) && (
            <div className="space-y-3 pt-2 border-t">
              <h4 className="font-medium text-sm">Preview:</h4>
              <FileList>
                {files.map((file, index) => (
                  <FileListItem key={`${file.name}-${index}`}>
                    <FileListHeader>
                      <FileListIcon file={file} />
                      <FileListInfo>
                        <FileListName>{file.name}</FileListName>
                        <FileListDescription>
                          <FileListSize size={file.size} />
                          <span>•</span>
                          <span>{file.type.split("/")[1].toUpperCase()}</span>
                        </FileListDescription>
                      </FileListInfo>
                      <FileListAction onClick={() => handleRemoveFile(file)} />
                    </FileListHeader>

                    {/* File Preview */}
                    {file.type.startsWith("image/") && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full max-h-32 object-contain rounded border bg-muted"
                        />
                      </div>
                    )}

                    {file.type.startsWith("video/") && (
                      <div className="mt-2 relative">
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full max-h-32 object-contain rounded border bg-black"
                          controls
                        />
                      </div>
                    )}
                  </FileListItem>
                ))}

                {recordedVideoUrl && (
                  <FileListItem>
                    <FileListHeader>
                      <FileListIcon />
                      <FileListInfo>
                        <FileListName>Screen Recording</FileListName>
                        <FileListDescription>
                          <span>WebM Video</span>
                          <span>•</span>
                          <span>{formatTime(recordingTime)} duration</span>
                        </FileListDescription>
                      </FileListInfo>
                      <FileListAction onClick={() => setRecordedVideoUrl(null)} />
                    </FileListHeader>
                    <div className="mt-2 relative">
                      <video
                        ref={videoPreviewRef}
                        src={recordedVideoUrl}
                        className="w-full max-h-32 object-contain rounded border bg-black"
                        controls
                        onPlay={() => setPreviewPlaying(true)}
                        onPause={() => setPreviewPlaying(false)}
                      />
                    </div>
                  </FileListItem>
                )}
              </FileList>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
