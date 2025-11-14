import { Movie } from '../models/movie.model.js';
import { fetchRemoteMovieById, searchRemoteMovies } from './omdb.service.js';
import { ApiError } from '../utils/api-error.js';
import { config } from '../config/index.js';

const isStale = (movie) => {
  if (!movie?.lastFetchedAt) {
    return true;
  }

  const ttlMs = config.cacheTtlHours * 60 * 60 * 1000;
  return Date.now() - movie.lastFetchedAt.getTime() > ttlMs;
};

const saveMovie = async (movieData) => {

  if (movieData.language) {
    delete movieData.language;
  }

  const updatedMovie = await Movie.findOneAndUpdate(
    { omdbId: movieData.omdbId },
    movieData,
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
  return updatedMovie;
};

const ensureMovieFresh = async (imdbId, { force = false } = {}) => {
  const cached = await Movie.findOne({ omdbId: imdbId });

  if (!cached || force || isStale(cached)) {
    const fresh = await fetchRemoteMovieById(imdbId);
    await saveMovie(fresh);
    return fresh;
  }

  return cached.toObject();
};

export const getMovieById = async (imdbId) => {
  const movie = await ensureMovieFresh(imdbId);

  if (!movie) {
    throw new ApiError(404, 'Movie not found');
  }

  return movie;
};

const applyFilters = (movies, filters) => {
  let filtered = [...movies];

  if (filters.genre?.length) {
    filtered = filtered.filter((movie) =>
      filters.genre.some((genre) => movie.genre?.includes(genre)),
    );
  }

  if (filters.year?.length) {
    filtered = filtered.filter((movie) => filters.year.includes(String(movie.year)));
  }

  return filtered;
};

const applySort = (movies, sort) => {
  if (!sort?.field) {
    return movies;
  }

  const direction = sort.order === 'asc' ? 1 : -1;

  return movies.sort((a, b) => {
    const aValue = a[sort.field] ?? 0;
    const bValue = b[sort.field] ?? 0;

    if (aValue < bValue) {
      return -1 * direction;
    }
    if (aValue > bValue) {
      return 1 * direction;
    }
    return 0;
  });
};

export const searchMovies = async ({
  search,
  page = 1,
  limit = 10,
  sort,
  filters = {},
}) => {
  if (!search) {
    throw new ApiError(400, 'Search term is required');
  }

  const remote = await searchRemoteMovies({ query: search, page });
  const imdbIds = remote.results.map((item) => item.imdbId);

  const moviesMap = new Map();

  const cachedMovies = await Movie.find({ omdbId: { $in: imdbIds } }).lean();
  cachedMovies.forEach((movie) => moviesMap.set(movie.omdbId, movie));
  for (const imdbId of imdbIds) {
    const cached = moviesMap.get(imdbId);
    
    if (!cached || isStale(cached)) {
      const fresh = await ensureMovieFresh(imdbId);
      moviesMap.set(imdbId, fresh);
    }
  }

  let movies = imdbIds.map((imdbId) => moviesMap.get(imdbId)).filter(Boolean);
  movies = applyFilters(movies, filters);
  movies = applySort(movies, sort);

  const total = movies.length;
  const totalPagesFromApi = Math.ceil(remote.totalResults / limit) || 1;

  return {
    movies: movies.slice(0, limit),
    page,
    limit,
    total,
    totalPages: totalPagesFromApi,
    totalResultsFromApi: remote.totalResults,
  };
};

export const refreshCache = async () => {
  const movies = await Movie.find({}, 'omdbId').lean();

  let refreshed = 0;
  for (const movie of movies) {
    await ensureMovieFresh(movie.omdbId, { force: true });
    refreshed += 1;
  }

  return { refreshed };
};

export const deleteMovie = async (imdbId) => {
  const result = await Movie.findOneAndDelete({ omdbId: imdbId });
  if (!result) {
    throw new ApiError(404, 'Movie not found');
  }
  return result;
};

