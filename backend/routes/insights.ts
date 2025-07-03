import { Router } from "express"
import { db } from "../db"
import { tours } from "../db/schema/product-tours"
import { eq } from "drizzle-orm"

const router: Router = Router()

// Get insights data for the authenticated user
router.get("/", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found." })
    }

    // Get user's tours for the insights
    const userTours = await db.query.tours.findMany({
      where: eq(tours.userId, userId),
      with: {
        tourSteps: true,
      },
    })

    // Mock insights data - replace with real analytics later
    const mockMetrics = {
      totalViews: 2206,
      viewsChange: 16,
      completionRate: 19,
      completionChange: -7,
      ctaClicks: 154,
      ctaChange: 2,
      avgPlayTime: "1m 4s",
      playTimeChange: 2,
    }

    const mockTourNames = [
      "Digital Odyssey",
      "Interactive Journey",
      "Visionary Nexus",
      "Pixel Fusion Showcase",
      "Quantum Spark Demo",
      "Horizon Explorer",
      "CodeCanvas Prelude",
    ]

    const tourInsights = userTours.slice(0, 7).map((tour, index) => ({
      tourId: tour.id,
      tourTitle: tour.title || mockTourNames[index] || `Tour ${index + 1}`,
      players: 0,
      playersChange: 0,
      completionRate: Math.floor(Math.random() * 80) + 10, // 10-90%
      completionChange: Math.floor(Math.random() * 50) - 25, // -25 to +25
      ctaClickRate: Math.floor(Math.random() * 70) + 5, // 5-75%
      ctaChange: Math.floor(Math.random() * 40) - 20, // -20 to +20
    }))

    // Fill with mock data if user has fewer than 7 tours
    while (tourInsights.length < 7) {
      const index = tourInsights.length
      tourInsights.push({
        tourId: `mock-${index}`,
        tourTitle: mockTourNames[index],
        players: 0,
        playersChange: 0,
        completionRate: Math.floor(Math.random() * 80) + 10,
        completionChange: Math.floor(Math.random() * 50) - 25,
        ctaClickRate: Math.floor(Math.random() * 70) + 5,
        ctaChange: Math.floor(Math.random() * 40) - 20,
      })
    }

    const insightsData = {
      metrics: mockMetrics,
      tourInsights: tourInsights,
    }

    res.json(insightsData)
  } catch (error) {
    next(error)
  }
})

export default router
