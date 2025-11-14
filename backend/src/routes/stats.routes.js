import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getStatsController } from '../controllers/stats.controller.js';

const statsRouter = Router();

statsRouter.get('/', authenticate, getStatsController);

export { statsRouter };

