import { Router } from "express"
import { v2 as cloudinary } from "cloudinary"
import { db } from "../db"
import { cloudinaryFiles } from "../db/schema/product-tours"
import { eq } from "drizzle-orm"

const router: Router = Router()

// Configure Cloudinary (ensure environment variables are set in .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Middleware to ensure user is authenticated and userId is available
// In a real application, replace this with your actual auth middleware
const authMiddleware = (req: any, res: any, next: any) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized: User ID not found." })
  }
  next()
}

// Endpoint 1: Generate signature for client-side direct upload to Cloudinary
router.get("/generate-signature", authMiddleware, (req, res, next) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const paramsToSign = { timestamp: timestamp }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string // Type assertion as it comes from env
    )

    res.json({
      success: true,
      signature: signature,
      timestamp: timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
    })
  } catch (error) {
    console.error("Signature Generation Error:", error)
    next(error)
  }
})

// Endpoint 2: Save metadata after client confirms successful upload to Cloudinary
router.post("/save-metadata", authMiddleware, async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.userId // userId is set by authMiddleware
    const { public_id, secure_url, resource_type } = req.body

    if (!public_id || !secure_url || !resource_type) {
      return res.status(400).json({ error: "public_id, secure_url, and resource_type are required" })
    }

    // Insert metadata into Neon database
    await db.insert(cloudinaryFiles).values({
      publicId: public_id,
      mediaUrl: secure_url,
      resourceType: resource_type,
      userId: userId!,
    })

    console.log(`Metadata saved for Cloudinary asset: ${public_id}`)
    res.status(201).json({ success: true })
  } catch (error) {
    console.error("Metadata Save Error:", error)
    next(error)
  }
})

export default router
