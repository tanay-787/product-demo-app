"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { useUser } from "@stackframe/react"
import { Plus, Search, Filter, MoreVertical, Edit, Eye, Share2, Trash2, Calendar, BarChart3, Clock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Tour {
  id: string
  title: string
  description?: string
  status: string
  views?: number
  createdAt: string
  updatedAt?: string
  tourSteps?: any[]
}

const Tours: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useUser({ or: "redirect" })

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")

  const {
    data: tours,
    isLoading,
    isError,
    error,
  } = useQuery<Tour[], Error>({
    queryKey: ["tours"],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated.")
      }
      const authHeaders = await user.getAuthHeaders()
      const response = await api.get<Tour[]>("/tours", { headers: authHeaders })
      return response.data
    },
    enabled: !!user,
  })

  const deleteTourMutation = useMutation<void, Error, string>({
    mutationFn: async (tourId: string) => {
      if (!user) {
        throw new Error("User not authenticated.")
      }
      const { accessToken } = await user.getAuthJson()
      await api.delete(`/tours/${tourId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] })
    },
    onError: (err) => {
      console.error("Error deleting tour:", err)
    },
  })

  const handleDeleteTour = (tourId: string, tourTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${tourTitle}"? This action cannot be undone.`)) {
      deleteTourMutation.mutate(tourId)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "private":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  // Filter and sort tours
  const filteredTours =
    tours?.filter((tour) => {
      const matchesSearch =
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || tour.status === statusFilter
      return matchesSearch && matchesStatus
    }) || []

  const sortedTours = [...filteredTours].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "title":
        return a.title.localeCompare(b.title)
      case "views":
        return (b.views || 0) - (a.views || 0)
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Error: {error?.message}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tours</h1>
          <p className="text-muted-foreground">Manage and organize your product tours</p>
        </div>
        <Link to="/editor">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create New Tour
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
            <SelectItem value="views">Most Views</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tours Grid */}
      {sortedTours.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || statusFilter !== "all" ? "No tours found" : "No tours created yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first interactive product tour to get started!"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Link to="/editor">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Tour
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedTours.map((tour) => (
            <Card key={tour.id} className="group transition-all duration-200 hover:shadow-lg dark:hover:shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {tour.title}
                    </CardTitle>
                    {tour.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{tour.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge className={`text-xs ${getStatusColor(tour.status)}`}>{tour.status}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/editor?tourId=${tour.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {tour.status === "published" && (
                          <DropdownMenuItem onClick={() => navigate(`/view/${tour.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteTour(tour.id, tour.title)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{tour.tourSteps?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Steps</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{tour.views || 0}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">0</div>
                      <div className="text-xs text-muted-foreground">Shares</div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(tour.createdAt).toLocaleDateString()}</span>
                    </div>
                    {tour.updatedAt && tour.updatedAt !== tour.createdAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated {new Date(tour.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => navigate(`/editor?tourId=${tour.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    {tour.status === "published" && (
                      <Button size="sm" className="flex-1" onClick={() => navigate(`/view/${tour.id}`)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Summary */}
      {tours && tours.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {sortedTours.length} of {tours.length} tours
        </div>
      )}
    </div>
  )
}

export default Tours
