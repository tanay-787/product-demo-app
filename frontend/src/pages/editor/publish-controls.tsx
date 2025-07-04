"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Share2, Eye, Lock, Globe, ExternalLink } from "lucide-react"
import { useUser } from "@stackframe/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { motion } from "motion/react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog" // Import Dialog components

interface PublishControlsProps {
  tourId: string | null
  initialStatus: "draft" | "published" | "private"
  onStatusChange: (status: "draft" | "published" | "private") => void
  children?: React.ReactNode // Allow a trigger element to be passed as children
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ShareData {
  shareId: string
  isPublic: boolean
  shareUrl: string
}

const PublishControls: React.FC<PublishControlsProps> = ({ tourId, initialStatus, onStatusChange, children, open, onOpenChange }) => {
  const user = useUser({ or: "redirect" })
  const queryClient = useQueryClient()
  const [status, setStatus] = useState(initialStatus)
  const [isPublic, setIsPublic] = useState(false)

  const { data: shareData, isLoading: isLoadingShare } = useQuery<ShareData>({
    queryKey: ["tourShare", tourId],
    queryFn: async () => {
      if (!tourId || !user) throw new Error("Tour ID or user missing")
      const authHeaders = await user.getAuthHeaders()
      const response = await api.get<ShareData>(`/tours/${tourId}/share`, { headers: authHeaders })
      return response.data
    },
    enabled: !!tourId && !!user && open, // Only fetch when dialog is open
  })

  const createShareMutation = useMutation<ShareData, Error, { isPublic: boolean }>({
    mutationFn: async ({ isPublic }) => {
      if (!tourId || !user) throw new Error("Tour ID or user missing")
      const authHeaders = await user.getAuthHeaders()
      const response = await api.post<ShareData>(`/tours/${tourId}/share`, { isPublic }, { headers: authHeaders })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["tourShare", tourId], data)
      toast.success("Share settings updated successfully!")
    },
    onError: (error) => {
      toast.error(`Failed to update share settings: ${error.message}`)
    },
  })

  const updateStatusMutation = useMutation<void, Error, { status: string }>({
    mutationFn: async ({ status }) => {
      if (!tourId || !user) throw new Error("Tour ID or user missing")
      const authHeaders = await user.getAuthHeaders()
      await api.patch(`/tours/${tourId}/status`, { status }, { headers: authHeaders })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour", tourId] })
      toast.success("Tour status updated successfully!")
    },
    onError: (error) => {
      toast.error(`Failed to update tour status: ${error.message}`)
    },
  })

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])
  

  useEffect(() => {
    if (shareData) {
      setIsPublic(shareData.isPublic)
    }
  }, [shareData])

  const handleStatusChange = (newStatus: "draft" | "published" | "private") => {
    setStatus(newStatus)
    onStatusChange(newStatus)
    updateStatusMutation.mutate({ status: newStatus })
  }

  const handlePublicToggle = (checked: boolean) => {
    setIsPublic(checked)
    createShareMutation.mutate({ isPublic: checked })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Link copied to clipboard!")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <Globe className="w-4 h-4" />
      case "private":
        return <Lock className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Publish & Share Tour
          </DialogTitle>
          <DialogDescription>
            Control your tour's visibility and get shareable links.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {tourId ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                {/* <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Publish & Share
                  </CardTitle>
                </CardHeader> */}
                <CardContent className="space-y-6">
                  {/* Status Controls */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tour Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {(["draft", "published", "private"] as const).map((statusOption) => (
                        <Button
                          key={statusOption}
                          variant={status === statusOption ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(statusOption)}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-2 capitalize transition-all duration-200"
                        >
                          {getStatusIcon(statusOption)}
                          {statusOption}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {status === "draft" && "Only you can see this tour"}
                        {status === "published" && "Tour is live and discoverable"}
                        {status === "private" && "Tour is live but not discoverable"}
                      </span>
                    </div>
                  </div>

                  {/* Public Sharing Toggle */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Public Sharing</Label>
                        <p className="text-xs text-muted-foreground">Allow anyone with the link to view this tour</p>
                      </div>
                      <Switch
                        checked={isPublic}
                        onCheckedChange={handlePublicToggle}
                        disabled={createShareMutation.isPending || isLoadingShare}
                      />
                    </div>
                  </div>

                  {/* Share URL */}
                  {shareData && isPublic && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-medium">Share URL</Label>
                      <div className="flex gap-2">
                        <Input value={shareData.shareUrl} readOnly className="font-mono text-sm" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(shareData.shareUrl)}
                          className="shrink-0"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(shareData.shareUrl, "_blank")}
                          className="shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Publish & Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Save your tour first to enable publishing and sharing options.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PublishControls