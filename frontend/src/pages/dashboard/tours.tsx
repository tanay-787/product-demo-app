"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useUser } from "@stackframe/react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { Plus, Search, Filter, Eye, Edit, Share2, Trash2, MoreHorizontal, Calendar } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import PublishControls from "../editor/publish-controls" // Import PublishControls

interface Tour {
  id: string
  title: string
  description?: string
  status: "draft" | "published" | "private"
  createdAt: string
  updatedAt: string
  viewCount?: number
  stepCount?: number
  shareCount?: number
}

export default function ToursPage() {
  const user = useUser({ or: "redirect" })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("updated")
  const [isPublishControlsOpen, setIsPublishControlsOpen] = useState(false)
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null)
  const [selectedTourStatus, setSelectedTourStatus] = useState<"draft" | "published" | "private">("draft")

  const { data: tours = [], isLoading } = useQuery<Tour[]>({
    queryKey: ["tours"] as const,
    queryFn: async () => {
      if (!user) return []
      const authHeaders = await user.getAuthHeaders()
      const response = await api.get<{ tours: Tour[] }>("/tours", { headers: authHeaders })
      return response.data.tours
    },
    enabled: !!user,
  })

  const deleteTourMutation = useMutation({
    mutationFn: async (tourId: string) => {
      if (!user) throw new Error("User not authenticated")
      const authHeaders = await user.getAuthHeaders()
      await api.delete(`/tours/${tourId}`, { headers: authHeaders })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] })
    },
  })

  const updateTourStatusMutation = useMutation<void, Error, { tourId: string; status: "draft" | "published" | "private" }>({
    mutationFn: async ({ tourId, status }) => {
      if (!user) throw new Error("User not authenticated")
      const authHeaders = await user.getAuthHeaders()
      await api.patch(`/tours/${tourId}/status`, { status }, { headers: authHeaders })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tour", variables.tourId] })
      queryClient.invalidateQueries({ queryKey: ["tours"] })
    },
  })

  const filteredAndSortedTours = tours
    .filter((tour) => {
      const matchesSearch =
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tour.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesStatus = statusFilter === "all" || tour.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "views":
          return (b.viewCount || 0) - (a.viewCount || 0)
        case "updated":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

  const handleCreateTour = () => {
    navigate("/editor")
  }

  const handleEditTour = (tourId: string) => {
    navigate(`/editor?tourId=${tourId}`)
  }

  const handleDeleteTour = (tourId: string, tourTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${tourTitle}"? This action cannot be undone.`)) {
      deleteTourMutation.mutate(tourId)
    }
  }

  const handleOpenPublishControls = (tourId: string, status: "draft" | "published" | "private") => {
    setSelectedTourId(tourId)
    setSelectedTourStatus(status)
    setIsPublishControlsOpen(true)
  }

  const handleStatusChange = (newStatus: "draft" | "published" | "private") => {
    if (selectedTourId) {
      updateTourStatusMutation.mutate({ tourId: selectedTourId, status: newStatus })
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tours</h1>
            <p className="text-muted-foreground">Manage all your product tours</p>
          </div>
          <Button onClick={handleCreateTour} className="gap-2">
            <Plus className="w-4 h-4" />
            New Tour
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Tours</h1>
          <p className="text-muted-foreground">Manage all your product tours</p>
        </div>
        <Button onClick={handleCreateTour} className="gap-2">
          <Plus className="w-4 h-4" />
          New Tour
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last Updated</SelectItem>
            <SelectItem value="created">Date Created</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="views">View Count</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Tours Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {filteredAndSortedTours.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "No tours match your current filters."
                  : "No tours created yet. Click 'New Tour' to start!"}
              </div>
              {!searchQuery && statusFilter === "all" && (
                <Button onClick={handleCreateTour} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Tour
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                          {tour.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={cn("text-xs", getStatusColor(tour.status))}>
                            {tour.status}
                          </Badge>
                          {tour.stepCount && (
                            <span className="text-xs text-muted-foreground">{tour.stepCount} steps</span>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/viewer/${tour.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Tour
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTour(tour.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Tour
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenPublishControls(tour.id, tour.status)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Controls
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTour(tour.id, tour.title)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Tour
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-2">
                      {tour.description || "No description provided"}
                    </CardDescription>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(tour.updatedAt)}</span>
                      </div>
                      {tour.viewCount !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{tour.viewCount}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <PublishControls
        tourId={selectedTourId}
        initialStatus={selectedTourStatus}
        onStatusChange={handleStatusChange}
        open={isPublishControlsOpen}
        onOpenChange={setIsPublishControlsOpen}
      />
    </div>
  )
}
