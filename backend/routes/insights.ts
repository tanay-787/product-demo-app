import { Router } from "express"

const router: Router = Router()

// Mock insights data endpoint
router.get("/", (req, res) => {
  // In a real application, this would query the database for detailed insights
  const mockInsights = {
    overview: {
      totalViews: 2206,
      viewsChange: 16,
      completionRate: 19,
      completionChange: -7,
      ctaClicks: 154,
      ctaClicksChange: 2,
      avgPlayTime: "1m 4s",
      playTimeChange: 2,
    },
    tourMetrics: [
      {
        id: "1",
        name: "Digital Odyssey",
        players: 0,
        playersChange: 0,
        completionRate: 19,
        completionRateChange: 0,
        ctaClickRate: 13,
        ctaClickRateChange: 12,
      },
      {
        id: "2",
        name: "Interactive Journey",
        players: 0,
        playersChange: 0,
        completionRate: 13,
        completionRateChange: -12,
        ctaClickRate: 9,
        ctaClickRateChange: 2,
      },
      {
        id: "3",
        name: "Visionary Nexus",
        players: 0,
        playersChange: 0,
        completionRate: 10,
        completionRateChange: 24,
        ctaClickRate: 8,
        ctaClickRateChange: -6,
      },
      {
        id: "4",
        name: "Pixel Fusion Showcase",
        players: 0,
        playersChange: 0,
        completionRate: 0,
        completionRateChange: 0,
        ctaClickRate: 0,
        ctaClickRateChange: 0,
      },
      {
        id: "5",
        name: "Quantum Spark Demo",
        players: 0,
        playersChange: 0,
        completionRate: 80,
        completionRateChange: 12,
        ctaClickRate: 65,
        ctaClickRateChange: -3,
      },
      {
        id: "6",
        name: "Horizon Explorer",
        players: 0,
        playersChange: 0,
        completionRate: 32,
        completionRateChange: 1,
        ctaClickRate: 17,
        ctaClickRateChange: 2,
      },
      {
        id: "7",
        name: "CodeCanvas Prelude",
        players: 0,
        playersChange: 0,
        completionRate: 23,
        completionRateChange: -1,
        ctaClickRate: 38,
        ctaClickRateChange: -1,
      },
    ],
  }

  res.json(mockInsights)
})

export default router