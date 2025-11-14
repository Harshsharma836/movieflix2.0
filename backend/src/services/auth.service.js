import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ApiError } from '../utils/api-error.js';

export const authenticateAdmin = async ({ email, password }) => {
  if (email !== config.adminEmail || password !== config.adminPassword) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    {
      email,
      isAdmin: true,
    },
    config.jwtSecret,
    {
      expiresIn: '12h',
    },
  );

  return {
    token,
    user: {
      email,
      isAdmin: true,
    },
  };
};

