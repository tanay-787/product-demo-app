import { Router } from "express"
import { db } from "../db"
import { tours, tourSteps, annotations, tourShares } from "../db/schema/product-tours"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

const router: Router = Router()

// Get all tours for the authenticated user
router.get("/", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.userId // userId is set by authMiddleware
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found." })
    }
    const userTours = await db.query.tours.findMany({
      where: eq(tours.userId, userId),
      with: {
        tourSteps: {
          with: {
            annotations: true,
          },
          orderBy: [tourSteps.stepOrder], // Order steps for consistent display
        },
      },
    })
    res.json({ tours: userTours }) // Modified line: Wrap userTours in an object with 'tours' key
  } catch (error) {
    next(error)
  }
})

// Get a single tour by ID for the authenticated user
router.get("/:id", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found." })
    }

    const tourId = req.params.id
    const tour = await db.query.tours.findFirst({
      where: eq(tours.id, tourId),
      with: {
        tourSteps: {
          with: {
            annotations: true,
          },
          orderBy: [tourSteps.stepOrder],
        },
      },
    })

    if (!tour) {
      return res.status(404).json({ error: "Tour not found." })
    }

    if (tour.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not own this tour." })
    }

    res.json(tour)
  } catch (error) {
    next(error)
  }
})

// Create a new tour with steps and annotations
router.post("/", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found." })
    }
    const { title, description, status, steps } = req.body
    if (!title) {
      return res.status(400).json({ error: "Title is required." })
    }

    const newTourId = uuidv4()
    const newTour = await db
      .insert(tours)
      .values({
        id: newTourId,
        userId,
        title,
        description,
        status: status || "draft",
      })
      .returning()

    if (steps && steps.length > 0) {
      const stepInserts = steps.map((stepData: any, index: number) => ({
        id: uuidv4(),
        tourId: newTourId,
        stepOrder: index,
        imageUrl: stepData.imageUrl,
        description: stepData.description,
      }))

      const newSteps = await db.insert(tourSteps).values(stepInserts).returning()

      for (const newStep of newSteps) {
        const originalStepData = steps.find((s: any) => s.stepOrder === newStep.stepOrder) // Find original step by order
        if (originalStepData && originalStepData.annotations && originalStepData.annotations.length > 0) {
          const annotationValues = originalStepData.annotations.map((ann: any) => ({
            id: uuidv4(),
            stepId: newStep.id,
            text: ann.text,
            x: ann.x,
            y: ann.y,
          }))
          await db.insert(annotations).values(annotationValues)
        }
      }
    }

    res.status(201).json(newTour[0])
  } catch (error) {
    next(error)
  }
})

// Update an existing tour, its steps and annotations
router.put("/:id", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found." })
    }

    const tourId = req.params.id
    const { title, description, status, steps } = req.body

    if (!title) {
      return res.status(400).json({ error: "Title is required." })
    }

    const existingTour = await db.query.tours.findFirst({
      where: eq(tours.id, tourId),
    })

    if (!existingTour) {
      return res.status(404).json({ error: "Tour not found." })
    }

    if (existingTour.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not own this tour." })
    }

    // Update tour details
    await db
      .update(tours)
      .set({
        title,
        description,
        status: status || "draft",
        updatedAt: new Date(),
      })
      .where(eq(tours.id, tourId))

    // Delete existing steps and annotations for this tour
    // This assumes cascade delete is set up correctly in your schema for annotations to tourSteps
    await db.delete(tourSteps).where(eq(tourSteps.tourId, tourId))

    // Insert new/updated steps and their annotations
    if (steps && steps.length > 0) {
      for (const stepData of steps) {
        const newStepId = uuidv4()
        await db.insert(tourSteps).values({
          id: newStepId,
          tourId: tourId,
          stepOrder: stepData.stepOrder || 0,
          imageUrl: stepData.imageUrl,
          description: stepData.description,
        })

        if (stepData.annotations && stepData.annotations.length > 0) {
          const annotationValues = stepData.annotations.map((ann: any) => ({
            id: uuidv4(),
            stepId: newStepId,
            text: ann.text,
            x: ann.x,
            y: ann.y,
          }))
          await db.insert(annotations).values(annotationValues)
        }
      }
    }

    res.json({ message: "Tour updated successfully." })
  } catch (error) {
    next(error)
  }
})

// Update tour status
router.patch("/:id/status", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found." })
    }

    const tourId = req.params.id
    const { status } = req.body

    if (!status || !["draft", "published", "private"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be draft, published, or private." })
    }

    const existingTour = await db.query.tours.findFirst({
      where: eq(tours.id, tourId),
    })

    if (!existingTour) {
      return res.status(404).json({ error: "Tour not found." })
    }

    if (existingTour.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not own this tour." })
    }

    await db
      .update(tours)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(tours.id, tourId))

    res.json({ message: "Tour status updated successfully." })
  } catch (error) {
    next(error)
  }
})

// Get tour share settings
router.get("/:id/share", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found." })
    }

    const tourId = req.params.id

    const existingTour = await db.query.tours.findFirst({
      where: eq(tours.id, tourId),
    })

    if (!existingTour) {
      return res.status(404).json({ error: "Tour not found." })
    }

    if (existingTour.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not own this tour." })
    }

    const shareData = await db.query.tourShares.findFirst({
      where: eq(tourShares.tourId, tourId),
    })

    if (!shareData) {
      // Create default share settings
      const shareId = crypto.randomBytes(16).toString("hex")
      const newShare = await db
        .insert(tourShares)
        .values({
          tourId,
          shareId,
          isPublic: false,
        })
        .returning()

      return res.json({
        shareId: newShare[0].shareId,
        isPublic: false,
        shareUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/view/${tourId}`,
      })
    }

    res.json({
      shareId: shareData.shareId,
      isPublic: shareData.isPublic,
      shareUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/view/${tourId}`,
    })
  } catch (error) {
    next(error)
  }
})

// Create or update tour share settings
router.post("/:id/share", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found." })
    }

    const tourId = req.params.id
    const { isPublic, password } = req.body

    const existingTour = await db.query.tours.findFirst({
      where: eq(tours.id, tourId),
    })

    if (!existingTour) {
      return res.status(404).json({ error: "Tour not found." })
    }

    if (existingTour.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not own this tour." })
    }

    const existingShare = await db.query.tourShares.findFirst({
      where: eq(tourShares.tourId, tourId),
    })

    let shareData
    if (existingShare) {
      // Update existing share
      shareData = await db
        .update(tourShares)
        .set({
          isPublic: isPublic || false,
          passwordHash: password ? crypto.createHash("sha256").update(password).digest("hex") : null,
          updatedAt: new Date(),
        })
        .where(eq(tourShares.tourId, tourId))
        .returning()
    } else {
      // Create new share
      const shareId = crypto.randomBytes(16).toString("hex")
      shareData = await db
        .insert(tourShares)
        .values({
          tourId,
          shareId,
          isPublic: isPublic || false,
          passwordHash: password ? crypto.createHash("sha256").update(password).digest("hex") : null,
        })
        .returning()
    }

    res.json({
      shareId: shareData[0].shareId,
      isPublic: shareData[0].isPublic,
      shareUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/view/${tourId}`,
    })
  } catch (error) {
    next(error)
  }
})

// Delete a tour
router.delete("/:id", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found." })
    }

    const tourId = req.params.id

    const existingTour = await db.query.tours.findFirst({
      where: eq(tours.id, tourId),
    })

    if (!existingTour) {
      return res.status(404).json({ error: "Tour not found." })
    }

    if (existingTour.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not own this tour." })
    }

    await db.delete(tours).where(eq(tours.id, tourId))

    res.status(204).send() // No content for successful deletion
  } catch (error) {
    next(error)
  }
})

export default router
