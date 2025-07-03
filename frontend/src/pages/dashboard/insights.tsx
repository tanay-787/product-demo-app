"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, MousePointer, Clock, Target, TrendingUp, TrendingDown, HelpCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useUser } from "@stackframe/react"

interface InsightsData {
  overview: {
    totalViews: number
    viewsChange: number
    completionRate: number
    completionChange: number
    ctaClicks: number
    ctaClicksChange: number
    avgPlayTime: string
    playTimeChange: number
  }
  tourMetrics: Array<{
    id: string
    name: string
    players: number
    playersChange: number
    completionRate: number
    completionRateChange: number
    ctaClickRate: number
    ctaClickRateChange: number
  }>
}

const TrendIndicator = ({ value, showPercentage = true }: { value: number; showPercentage?: boolean }) => {
  const isPositive = value > 0
  const isNeutral = value === 0

  if (isNeutral) {
    return <span className="text-muted-foreground text-sm">→ 0%</span>
  }

  return (
    <span className={`text-sm flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {showPercentage ? `${Math.abs(value)}%` : Math.abs(value)}
    </span>
  )
}

export default function Insights() {
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
      <div className="flex-1 space-y-8 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (isError || !insights) {
    return (
      <div className="flex-1 space-y-8 p-6">
        <div className="text-center text-red-500">Failed to load insights data. Please try again later.</div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">Detailed analytics and performance metrics for your tours</p>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.overview.totalViews.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <TrendIndicator value={insights.overview.viewsChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.overview.completionRate}%
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {Math.round((insights.overview.totalViews * insights.overview.completionRate) / 100)}
              </span>
            </div>
            <div className="flex items-center mt-1">
              <TrendIndicator value={insights.overview.completionChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CTA Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(insights.overview.ctaClicks)}%
              <span className="text-sm font-normal text-muted-foreground ml-2">{insights.overview.ctaClicks}</span>
            </div>
            <div className="flex items-center mt-1">
              <TrendIndicator value={insights.overview.ctaClicksChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Play Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.overview.avgPlayTime}</div>
            <div className="flex items-center mt-1">
              <TrendIndicator value={insights.overview.playTimeChange} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tour Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tour Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Arcade</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    Players <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    Completion Rate <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    CTA Click Rate <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insights.tourMetrics.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">{tour.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-medium">{tour.players}</span>
                      <TrendIndicator value={tour.playersChange} />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-medium">{tour.completionRate}%</span>
                      <TrendIndicator value={tour.completionRateChange} />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-medium">{tour.ctaClickRate}%</span>
                      <TrendIndicator value={tour.ctaClickRateChange} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
