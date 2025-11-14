import { getStats } from '../services/stats.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const getStatsController = asyncHandler(async (_req, res) => {
  const stats = await getStats();
  res.json({
    success: true,
    stats,
  });
});

