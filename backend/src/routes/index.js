import { Router } from 'express';

import { movieRouter } from './movie.routes.js';
import { authRouter } from './auth.routes.js';
import { statsRouter } from './stats.routes.js';
import { adminRouter } from './admin.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/stats', statsRouter);
router.use('/admin', adminRouter);

export { router };

