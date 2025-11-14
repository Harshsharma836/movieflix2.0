import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/movieflix',
  omdbApiKey: process.env.OMDB_API_KEY,
  jwtSecret: process.env.JWT_SECRET || 'movieflix-secret',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123',
  cacheTtlHours: parseInt(process.env.CACHE_TTL_HOURS || '24', 10),
};

