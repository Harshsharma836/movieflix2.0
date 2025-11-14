import { authenticateAdmin } from '../services/auth.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authenticateAdmin({ email, password });

  res.json({
    success: true,
    ...result,
  });
});

export const profileController = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

