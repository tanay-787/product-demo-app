import type { Request, Response, NextFunction } from "express"
import { jwtVerify, createRemoteJWKSet } from "jose"

declare global {
  namespace Express {
    interface Request {
      auth?: {
        id: string
        email?: string
        [key: string]: any
      }
      authUserId?: string // Explicitly add authUserId for convenience
      authToken?: string
      projectId?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" })
    }

    const token = authHeader.substring(7)

    if (!process.env.JWKS_URL) {
      return res.status(500).json({ error: "JWKS_URL not configured" })
    }

    // Verify the JWT using the JWKS endpoint
    const JWKS = createRemoteJWKSet(new URL(process.env.JWKS_URL))

    const { payload } = await jwtVerify(token, JWKS)

    // Extract user information from the JWT payload
    req.auth = {
      id: payload.sub as string,
      email: payload.email as string,
      ...payload,
    }

    // Store the auth user ID directly for convenience
    req.authUserId = payload.sub as string;

    // Store the full token for database authentication
    req.authToken = token

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}
