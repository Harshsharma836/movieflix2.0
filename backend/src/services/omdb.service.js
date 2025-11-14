import axios from 'axios';
import { config } from '../config/index.js';
import { ApiError } from '../utils/api-error.js';

const omdbClient = axios.create({
  baseURL: 'https://www.omdbapi.com/',
  timeout: 10000,
});

const toArray = (value) =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const parseRuntime = (runtime) => {
  if (!runtime || runtime === 'N/A') {
    return null;
  }
  const match = runtime.match(/(\d+)/);
  return match ? Number(match[1]) : null;
};

const parseDate = (value) => {
  if (!value || value === 'N/A') {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toNumber = (value) => {
  if (!value || value === 'N/A') {
    return null;
  }
  const number = Number(value.replace(/,/g, ''));
  return Number.isNaN(number) ? null : number;
};

const normalizeMovie = (data) => ({
  omdbId: data.imdbID,
  title: data.Title,
  year: data.Year ? Number(data.Year) : null,
  rated: data.Rated !== 'N/A' ? data.Rated : null,
  released: parseDate(data.Released),
  runtimeMinutes: parseRuntime(data.Runtime),
  genre: toArray(data.Genre),
  director: toArray(data.Director),
  writer: toArray(data.Writer),
  actors: toArray(data.Actors),
  plot: data.Plot !== 'N/A' ? data.Plot : null,
  language: toArray(data.Language),
  country: toArray(data.Country),
  awards: data.Awards !== 'N/A' ? data.Awards : null,
  poster: data.Poster !== 'N/A' ? data.Poster : null,
  ratings: Array.isArray(data.Ratings)
    ? data.Ratings.map((rating) => ({
        source: rating.Source,
        value: rating.Value,
      }))
    : [],
  metascore: toNumber(data.Metascore),
  imdbRating: data.imdbRating && data.imdbRating !== 'N/A' ? Number(data.imdbRating) : null,
  imdbVotes: toNumber(data.imdbVotes),
  imdbId: data.imdbID,
  type: data.Type,
  dvd: parseDate(data.DVD),
  boxOffice: data.BoxOffice !== 'N/A' ? data.BoxOffice : null,
  production: data.Production !== 'N/A' ? data.Production : null,
  website: data.Website !== 'N/A' ? data.Website : null,
  totalSeasons: data.totalSeasons ? Number(data.totalSeasons) : null,
  lastFetchedAt: new Date(),
});

export const fetchRemoteMovieById = async (imdbId) => {
  if (!config.omdbApiKey) {
    throw new ApiError(500, 'OMDb API key is not configured');
  }

  const { data } = await omdbClient.get('', {
    params: {
      apikey: config.omdbApiKey,
      i: imdbId,
      plot: 'full',
    },
  });

  if (data.Response === 'False') {
    throw new ApiError(404, data.Error || 'Movie not found');
  }

  return normalizeMovie(data);
};

export const searchRemoteMovies = async ({ query, page = 1 }) => {
  if (!config.omdbApiKey) {
    throw new ApiError(500, 'OMDb API key is not configured');
  }

  const { data } = await omdbClient.get('', {
    params: {
      apikey: config.omdbApiKey,
      s: query,
      page,
      type: 'movie',
    },
  });

  if (data.Response === 'False') {
    throw new ApiError(404, data.Error || 'No movies found');
  }

  const totalResults = data.totalResults ? Number(data.totalResults) : data.Search.length;

  return {
    results: data.Search.map((item) => ({
      imdbId: item.imdbID,
      title: item.Title,
      year: item.Year ? Number(item.Year) : null,
      type: item.Type,
      poster: item.Poster !== 'N/A' ? item.Poster : null,
    })),
    totalResults,
  };
};


