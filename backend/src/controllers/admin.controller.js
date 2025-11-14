import { refreshCache, deleteMovie } from '../services/movie.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const refreshCacheController = asyncHandler(async (_req, res) => {
  const result = await refreshCache();
  res.json({
    success: true,
    message: `Refreshed ${result.refreshed} movie(s)`,
    ...result,
  });
});

export const deleteMovieController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteMovie(id);
  res.json({
    success: true,
    message: 'Movie deleted from cache',
  });
});

