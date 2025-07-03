import express from "express"
import cors from "cors"
import { authMiddleware } from "./middleware/auth"
import toursRouter from "./routes/tours"
import publicToursRouter from "./routes/publicTours"
import analyticsRouter from "./routes/analytics"
import insightsRouter from "./routes/insights"
import mediaRouter from "./routes/media" // Import the new media router

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/tours", authMiddleware, toursRouter)
app.use("/api/view", publicToursRouter) // Public routes for viewing tours
app.use("/api/analytics", analyticsRouter)
app.use("/api/insights", authMiddleware, insightsRouter)
app.use("/api/media", authMiddleware, mediaRouter) // Add the new media router

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err)
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
