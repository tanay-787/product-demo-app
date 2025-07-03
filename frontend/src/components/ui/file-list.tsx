"use client"

import { Primitive } from "@radix-ui/react-primitive"
import { File, X, ImageIcon, Video } from "lucide-react"
import type * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function FileList({ className, ...props }: React.ComponentProps<typeof Primitive.div>) {
  return <Primitive.div className={cn("space-y-2", className)} {...props} />
}

function FileListItem({ className, ...props }: React.ComponentProps<typeof Primitive.div>) {
  return <Primitive.div className={cn("rounded-lg border border-border bg-card p-3 shadow-sm", className)} {...props} />
}

function FileListHeader({ className, ...props }: React.ComponentProps<typeof Primitive.div>) {
  return <Primitive.div className={cn("flex items-center gap-3", className)} {...props} />
}

function FileListIcon({ file, className, ...props }: { file?: File } & React.ComponentProps<typeof Primitive.div>) {
  const getIcon = () => {
    if (!file) return <File className="h-4 w-4" />

    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    } else if (file.type.startsWith("video/")) {
      return <Video className="h-4 w-4 text-purple-500" />
    }
    return <File className="h-4 w-4" />
  }

  return (
    <Primitive.div className={cn("flex h-8 w-8 items-center justify-center rounded-md bg-muted", className)} {...props}>
      {getIcon()}
    </Primitive.div>
  )
}

function FileListInfo({ className, ...props }: React.ComponentProps<typeof Primitive.div>) {
  return <Primitive.div className={cn("flex-1 space-y-1", className)} {...props} />
}

function FileListName({ className, ...props }: React.ComponentProps<typeof Primitive.p>) {
  return <Primitive.p className={cn("text-sm font-medium leading-none", className)} {...props} />
}

function FileListDescription({ className, ...props }: React.ComponentProps<typeof Primitive.div>) {
  return <Primitive.div className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)} {...props} />
}

function FileListSize({ size }: { size: number }) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return <span>{formatSize(size)}</span>
}

function FileListAction({
  onClick,
  className,
  ...props
}: { onClick?: () => void } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn("h-6 w-6 p-0 text-muted-foreground hover:text-destructive", className)}
      {...props}
    >
      <X className="h-3 w-3" />
    </Button>
  )
}

export {
  FileList,
  FileListItem,
  FileListHeader,
  FileListIcon,
  FileListInfo,
  FileListName,
  FileListDescription,
  FileListSize,
  FileListAction,
}
