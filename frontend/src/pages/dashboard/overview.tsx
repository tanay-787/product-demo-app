"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { useUser } from "@stackframe/react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { Plus, Eye, Edit, Share2, BarChart3, Users, TrendingUp, Clock } from "lucide-react"
import { motion } from "motion/react"

interface Tour {
  id: string
  title: string
  description?: string
  status: "draft" | "published" | "private"
  createdAt: string
  updatedAt: string
  viewCount?: number
  stepCount?: number
}

interface InsightsData {
  totalViews: number
  averageCompletionRate: number
  totalEngagementTime: number
  topPerformingTour: string
  recentActivity: Array<{
    tourTitle: string
    action: string
    timestamp: string
  }>
}

export default function DashboardOverview() {
  const user = useUser({ or: "redirect" })
  const navigate = useNavigate()

  const { data: tours = [], isLoading: isLoadingTours } = useQuery<Tour[]>({
    queryKey: ["tours"],
    queryFn: async () => {
      if (!user) return []
      const authHeaders = await user.getAuthHeaders()
      const response = await api.get<{ tours: Tour[] }>("/tours", { headers: authHeaders })
      return response.data.tours
    },
    enabled: !!user,
  })

  const { data: insights, isLoading: isLoadingInsights } = useQuery<InsightsData>({
    queryKey: ["insights"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated")
      const authHeaders = await user.getAuthHeaders()
      const response = await api.get<InsightsData>("/insights", { headers: authHeaders })
      return response.data
    },
    enabled: !!user,
  })

  const recentTours = tours
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  const totalTours = tours.length
  const publishedTours = tours.filter((tour) => tour.status === "published").length
  const draftTours = tours.filter((tour) => tour.status === "draft").length
  const totalViews = insights?.totalViews || 0

  const handleCreateTour = () => {
    navigate("/editor")
  }

  const handleViewAllTours = () => {
    navigate("/dashboard/tours")
  }

  const handleEditTour = (tourId: string) => {
    navigate(`/editor?tourId=${tourId}`)
  }

  const handleViewTour = (tourId: string) => {
    navigate(`/viewer/${tourId}`)
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

  if (isLoadingTours || isLoadingInsights) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Product Tour Dashboard</h1>
            <p className="text-muted-foreground">Overview of your interactive product tours and analytics</p>
          </div>
          <Button onClick={handleCreateTour} className="gap-2">
            <Plus className="w-4 h-4" />
            New Tour
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
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
          <h1 className="text-3xl font-bold">Product Tour Dashboard</h1>
          <p className="text-muted-foreground">Overview of your interactive product tours and analytics</p>
        </div>
        <Button onClick={handleCreateTour} className="gap-2">
          <Plus className="w-4 h-4" />
          New Tour
        </Button>
      </motion.div>

      {/* Analytics Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                </div>
                Total Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTours}</div>
              <p className="text-xs text-muted-foreground">Total demos created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Eye className="w-4 h-4 text-green-500" />
                </div>
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all published tours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                Published Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedTours}</div>
              <p className="text-xs text-muted-foreground">Demos live and shareable</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Clock className="w-4 h-4 text-orange-500" />
                </div>
                Draft Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftTours}</div>
              <p className="text-xs text-muted-foreground">Demos in progress</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Recent Tours */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your Product Tours
                </CardTitle>
                <CardDescription>Recently updated tours</CardDescription>
              </div>
              <Button variant="outline" onClick={handleViewAllTours}>
                View All Tours
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTours.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tours created yet. Click "New Tour" to start!</p>
                <Button onClick={handleCreateTour} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Tour
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{tour.title}</h3>
                        <Badge variant="outline" className={getStatusColor(tour.status)}>
                          {tour.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{tour.description || "No description"}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Updated {formatDate(tour.updatedAt)}</span>
                        {tour.stepCount && <span>{tour.stepCount} steps</span>}
                        {tour.viewCount && <span>{tour.viewCount} views</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => handleViewTour(tour.id)} className="gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditTour(tour.id)} className="gap-1">
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Share2 className="w-3 h-3" />
                        Share
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
