import { Router } from 'express';

const router: Router = Router();

// Mock Analytics data endpoint
router.get('/', (req, res) => {
  // In a real application, this would query the database for aggregated analytics
  const mockAnalytics = {
    totalTours: 50,
    publishedTours: 35,
    draftTours: 15,
    totalViews: 12500,
    averageViewsPerTour: 250,
    topTours: [
      { id: '1', title: 'Product Onboarding Guide', views: 3500 },
      { id: '2', title: 'Feature X Walkthrough', views: 2800 },
      { id: '3', title: 'Sales Pitch Demo', views: 1500 },
    ],
  };
  res.json(mockAnalytics);
});

export default router;
