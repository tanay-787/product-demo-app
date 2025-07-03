import { Router } from 'express';
import { db } from '../db';
import { tours, tourSteps, annotations } from '../db/schema/product-tours';
import { eq } from 'drizzle-orm';

const router: Router = Router();

// Get a single tour by ID for public viewing (only if status is 'published')
router.get('/:id', async (req, res, next) => {
  try {
    const tourId = req.params.id;
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
    });

    if (!tour || tour.status !== 'published') {
      return res.status(404).json({ error: 'Tour not found or not published.' });
    }

    res.json(tour);
  } catch (error) {
    // Ensure all errors are sent as JSON
    console.error("Error in publicTours route:", error);
    res.status(500).json({ error: (error as Error).message || 'An unexpected error occurred.' });
  }
});

export default router;
