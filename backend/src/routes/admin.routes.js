import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import { refreshCacheController, deleteMovieController } from '../controllers/admin.controller.js';

const adminRouter = Router();

adminRouter.use(authenticate, authorizeAdmin);

adminRouter.post('/cache/refresh', refreshCacheController);
adminRouter.delete('/movies/:id', deleteMovieController);

export { adminRouter };

