// backend/src/index.ts  (or backend/index.ts if that is your source)
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth";
import toursRouter from "./routes/tours";
import publicToursRouter from "./routes/publicTours";
import analyticsRouter from "./routes/analytics";
import insightsRouter from "./routes/insights";
import mediaRouter from "./routes/media";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes (must come BEFORE any static fallback if you ever serve them here)
app.use("/api/tours", authMiddleware, toursRouter);
app.use("/api/view", publicToursRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/insights", authMiddleware, insightsRouter);
app.use("/api/media", authMiddleware, mediaRouter);

// health
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error", message: err?.message });
});

// IMPORTANT: DO NOT call `app.listen()` here in the file that will be exported to Vercel.
// Export the app for Vercel to use as a function
export default app;
