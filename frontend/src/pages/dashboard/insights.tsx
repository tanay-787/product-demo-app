"use client"

import type React from "react"
import { useQuery } from "@tanstack/react-query"
import { useUser } from "@stackframe/react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, MousePointer, Clock, CheckCircle } from "lucide-react"

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

interface TourInsight {
  tourId: string
  tourTitle: string
  players: number
  playersChange: number
  completionRate: number
  completionChange: number
  ctaClickRate: number
  ctaChange: number
}

interface InsightsData {
  metrics: InsightMetrics
  tourInsights: TourInsight[]
}

const TrendIndicator: React.FC<{ value: number; className?: string }> = ({ value, className = "" }) => {
  const isPositive = value > 0
  const Icon = isPositive ? TrendingUp : TrendingDown

  return (
    <div
      className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"} ${className}`}
    >
      <Icon className="w-3 h-3" />
      <span>{Math.abs(value)}%</span>
    </div>
  )
}

const MetricCard: React.FC<{
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  subtitle?: string
}> = ({ title, value, change, icon, subtitle }) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-md dark:hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {subtitle && <span className="text-sm font-normal text-muted-foreground ml-1">{subtitle}</span>}
        </div>
        <TrendIndicator value={change} className="mt-1" />
      </CardContent>
    </Card>
  )
}

const Insights: React.FC = () => {
  const user = useUser({ or: "redirect" })

  const {
    data: insights,
    isLoading,
    isError,
  } = useQuery<InsightsData>({
    queryKey: ["insights"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated")
      const authHeaders = await user.getAuthHeaders()
      const response = await api.get<InsightsData>("/insights", { headers: authHeaders })
      return response.data
    },
    enabled: !!user,
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (isError || !insights) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Failed to load insights data</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <Badge variant="secondary" className="text-xs">
          Last 30 days
        </Badge>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Views"
          value={insights.metrics.totalViews.toLocaleString()}
          change={insights.metrics.viewsChange}
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          title="Completions"
          value={`${insights.metrics.completionRate}%`}
          change={insights.metrics.completionChange}
          icon={<CheckCircle className="w-4 h-4" />}
          subtitle={`${Math.round((insights.metrics.totalViews * insights.metrics.completionRate) / 100)}`}
        />
        <MetricCard
          title="CTA Clicks"
          value={`${Math.round(insights.metrics.ctaClicks)}%`}
          change={insights.metrics.ctaChange}
          icon={<MousePointer className="w-4 h-4" />}
          subtitle={`${insights.metrics.ctaClicks}`}
        />
        <MetricCard
          title="Play Time"
          value={insights.metrics.avgPlayTime}
          change={insights.metrics.playTimeChange}
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      {/* Tours Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tour Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tour</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Players
                    <span className="ml-1 text-xs">ⓘ</span>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Completion Rate
                    <span className="ml-1 text-xs">ⓘ</span>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    CTA Click Rate
                    <span className="ml-1 text-xs">ⓘ</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {insights.tourInsights.map((tour, index) => (
                  <tr key={tour.tourId} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium">{tour.tourTitle}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tour.players}</span>
                        <TrendIndicator value={tour.playersChange} />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tour.completionRate}%</span>
                        <TrendIndicator value={tour.completionChange} />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tour.ctaClickRate}%</span>
                        <TrendIndicator value={tour.ctaChange} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Insights
