import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import { authMiddleware } from "./middleware/auth"
import toursRouter from "./routes/tours"
import publicToursRouter from "./routes/publicTours"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Public routes
app.use("/view", publicToursRouter)

// Mock Analytics endpoint
app.post("/api/analytics", (req, res) => {
  const { event, tourId, stepIndex, timestamp } = req.body;
  console.log(`[ANALYTICS EVENT] Type: ${event}, Tour ID: ${tourId}, Step: ${stepIndex}, Time: ${timestamp}`);
  res.status(200).json({ message: "Analytics event received" });
});

app.use("/api", authMiddleware)


app.use("/api/tours", toursRouter)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})
