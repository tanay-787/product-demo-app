import express,{ Application, Request, Response, NextFunction} from "express"
import cors from "cors"
import { authMiddleware } from "./middleware/auth"
import toursRouter from "./routes/tours"
import publicToursRouter from "./routes/publicTours"
import analyticsRouter from "./routes/analytics"
import insightsRouter from "./routes/insights"
import mediaRouter from "./routes/media"

const app: Application = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// 1. All API Routes (MUST come before serving static files or fallback)
app.use("/api/tours", authMiddleware, toursRouter)
app.use("/api/view", publicToursRouter) // Public routes for viewing tours
app.use("/api/analytics", analyticsRouter)
app.use("/api/insights", authMiddleware, insightsRouter)
app.use("/api/media", authMiddleware, mediaRouter)

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})



// Error handling middleware
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error("Error:", err)
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app;
