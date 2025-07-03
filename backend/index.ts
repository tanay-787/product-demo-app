import express from "express"
import cors from "cors"
import path from "path"
import { authMiddleware } from "./middleware/auth"
import toursRouter from "./routes/tours"
import publicToursRouter from "./routes/publicTours"
import analyticsRouter from "./routes/analytics"
import insightsRouter from "./routes/insights"
import mediaRouter from "./routes/media"

const app = express()
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

// Health check (also an API endpoint)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// 2. Serve static files from the frontend's dist directory
// This middleware will serve files like index.html, CSS, JS, etc.
// It should be placed after API routes to prevent it from intercepting API calls.
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')))

// 3. Fallback for client-side routing (MUST be the LAST route definition)
// For any request that didn't match an API route or a static file,
// serve the main index.html to allow client-side routing (React Router) to take over.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'))
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
