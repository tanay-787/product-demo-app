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
      userId?: string // Explicitly add authUserId for convenience
      authToken?: string
      projectId?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Corrected: Read 'x-stack-auth' header and parse its JSON content
    const stackAuthHeader = req.headers['x-stack-auth'] as string;

    if (!stackAuthHeader) {
      return res.status(401).json({ error: "Missing 'x-stack-auth' header" })
    }

    let parsedAuth;
    try {
      parsedAuth = JSON.parse(stackAuthHeader);
    } catch (parseError) {
      console.error("Error parsing x-stack-auth header:", parseError);
      return res.status(401).json({ error: "Invalid 'x-stack-auth' header format" });
    }

    const token = parsedAuth.accessToken; // Extract the accessToken from the parsed JSON

    if (!token) {
      return res.status(401).json({ error: "Access token not found in 'x-stack-auth' header" });
    }

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
    req.userId = payload.sub as string;

    // Store the full token for database authentication
    req.authToken = token

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}
