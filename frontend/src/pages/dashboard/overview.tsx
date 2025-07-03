import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BarChart3, Folder, Eye, TrendingUp, DraftingCompass } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useUser } from "@stackframe/react"
import TourList from './TourList';
import { Link } from 'react-router-dom';

interface AnalyticsData {
  totalTours: number;
  publishedTours: number;
  draftTours: number;
  totalViews: number;
  averageViewsPerTour: number;
  topTours: { id: string; title: string; views: number }[];
}

export default function Overview() {
  const user = useUser({ or: "redirect"})
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      setAnalyticsError(null);
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AnalyticsData = await response.json();
        setAnalytics(data);
      } catch (e: any) {
        console.error('Error fetching analytics:', e);
        setAnalyticsError(e.message);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="flex-1 space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Tour Dashboard</h1>
          <p className="text-muted-foreground">Overview of your interactive product tours and analytics</p>
        </div>
        <Link to="/editor">
          <Button className="bg-primary hover:bg-primary/90">
            + New Tour
          </Button>
        </Link>
      </div>

      {/* Overview Metrics Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
        </div>

        {loadingAnalytics ? (
          <div className="text-center text-lg">Loading analytics...</div>
        ) : analyticsError ? (
          <div className="text-center text-red-500">Error: {analyticsError}</div>
        ) : analytics ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="metric-label">Total Tours</CardTitle>
                <Folder className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="metric-value">{analytics.totalTours}</div>
                <p className="text-xs text-muted-foreground">Total demos created</p>
              </CardContent>
            </Card>

            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="metric-label">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="metric-value">{analytics.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all published tours</p>
              </CardContent>
            </Card>

            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="metric-label">Published Tours</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="metric-value">{analytics.publishedTours}</div>
                <p className="text-xs text-muted-foreground">Demos live and shareable</p>
              </CardContent>
            </Card>

            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="metric-label">Draft Tours</CardTitle>
                <DraftingCompass className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="metric-value">{analytics.draftTours}</div>
                <p className="text-xs text-muted-foreground">Demos in progress</p>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </section>

      <Separator className="my-8" />

      {/* Tour List Section */}
      <section className="space-y-6">
        <TourList />
      </section>
    </div>
  )
}
