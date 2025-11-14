import { Router } from 'express';
import { loginController, profileController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/login', loginController);
authRouter.get('/me', authenticate, profileController);

export { authRouter };

