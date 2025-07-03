"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BarChart3, Folder, Eye, TrendingUp, DraftingCompass, Plus, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useUser } from "@stackframe/react"
import { Badge } from "@/components/ui/badge"

interface AnalyticsData {
  totalTours: number
  publishedTours: number
  draftTours: number
  totalViews: number
  averageViewsPerTour: number
  topTours: { id: string; title: string; views: number }[]
}

interface Tour {
  id: string
  title: string
  status: string
  views?: number
  createdAt: string
  description?: string
  tourSteps?: any[]
}

interface InsightMetrics {
  totalViews: number
  viewsChange: number
  completionRate: number
  completionChange: number
  ctaClicks: number
  ctaChange: number
  avgPlayTime: string
  playTimeChange: number
}

interface InsightsData {
  metrics: InsightMetrics
  tourInsights: any[]
}

export default function Overview() {
  const user = useUser({ or: "redirect" })

  // Fetch insights data for analytics overview
  const { data: insights, isLoading: insightsLoading } = useQuery<InsightsData, Error>({
    queryKey: ["insights"],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated for insights.")
      }
      const authHeaders = await user.getAuthHeaders()
      const response = await api.get<InsightsData>("/insights", { headers: authHeaders })
      return response.data
    },
    enabled: !!user,
  })

  // Fetch tours data for recent tours section
  const { data: tours, isLoading: toursLoading } = useQuery<Tour[], Error>({
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

  // Get recent tours (last 3)
  const recentTours = tours?.slice(0, 3) || []

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

  return (
    <div className="flex-1 space-y-8 p-6 bg-background min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Tour Dashboard</h1>
          <p className="text-muted-foreground">Overview of your interactive product tours and analytics</p>
        </div>
        <Link to="/editor">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Tour
          </Button>
        </Link>
      </div>

      {/* Analytics Overview Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
        </div>

        {insightsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-0 pb-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : insights ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-all duration-200 hover:shadow-md dark:hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tours</CardTitle>
                <Folder className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tours?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total demos created</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md dark:hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insights.metrics.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all published tours</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md dark:hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Published Tours</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tours?.filter((tour) => tour.status === "published").length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Demos live and shareable</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md dark:hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Draft Tours</CardTitle>
                <DraftingCompass className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tours?.filter((tour) => tour.status === "draft").length || 0}</div>
                <p className="text-xs text-muted-foreground">Demos in progress</p>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </section>

      <Separator className="my-8" />

      {/* Recent Tours Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Product Tours</h2>
          <Link to="/dashboard/tours">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              View All Tours
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {toursLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentTours.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentTours.map((tour) => (
              <Card key={tour.id} className="transition-all duration-200 hover:shadow-md dark:hover:shadow-lg group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {tour.title}
                    </CardTitle>
                    <Badge className={`text-xs ${getStatusColor(tour.status)}`}>{tour.status}</Badge>
                  </div>
                  {tour.description && <p className="text-sm text-muted-foreground line-clamp-2">{tour.description}</p>}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{tour.tourSteps?.length || 0} steps</span>
                    <span>{tour.views || 0} views</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">
                      {new Date(tour.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Link to={`/editor?tourId=${tour.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      {tour.status === "published" && (
                        <Link to={`/view/${tour.id}`}>
                          <Button size="sm">View</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Folder className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No tours created yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Create New Tour" to start building your first interactive product tour!
                </p>
                <Link to="/editor">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Tour
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </section>
    </div>
  )
}
