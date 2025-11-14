import { searchMovies, getMovieById } from '../services/movie.service.js';
import { asyncHandler } from '../utils/async-handler.js';

const parseSort = (sortQuery) => {
  if (!sortQuery) {
    return undefined;
  }

  const [field, order = 'desc'] = sortQuery.split(':');
  const allowed = {
    rating: 'imdbRating',
    year: 'year',
    runtime: 'runtimeMinutes',
    title: 'title',
  };

  const mappedField = allowed[field];
  if (!mappedField) {
    return undefined;
  }

  return {
    field: mappedField,
    order: order === 'asc' ? 'asc' : 'desc',
  };
};

const parseFilters = (req) => {
  const filters = {};

  if (req.query.genre) {
    filters.genre = req.query.genre.split(',').map((item) => item.trim());
  }

  if (req.query.filter) {
    const filterPairs = Array.isArray(req.query.filter) ? req.query.filter : [req.query.filter];
    filterPairs.forEach((pair) => {
      const [key, value] = pair.split(':');
      if (key === 'genre') {
        filters.genre = value.split(',').map((item) => item.trim());
      }
      if (key === 'year') {
        filters.year = value.split(',').map((item) => item.trim());
      }
    });
  }

  return filters;
};

export const searchMoviesController = asyncHandler(async (req, res) => {
  const { search, page = '1', limit = '10', sort } = req.query;

  const filters = parseFilters(req);
  const sortConfig = parseSort(sort);

  const result = await searchMovies({
    search,
    page: Number(page),
    limit: Number(limit),
    sort: sortConfig,
    filters,
  });

  res.json({
    success: true,
    ...result,
  });
});

export const getMovieByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movie = await getMovieById(id);
  res.json({
    success: true,
    movie,
  });
});

