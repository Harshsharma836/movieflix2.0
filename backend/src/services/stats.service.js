import { Movie } from '../models/movie.model.js';

export const getStats = async () => {
  const [genreDistribution, ratingsByGenre, runtimeByYear] = await Promise.all([
    Movie.aggregate([
      { $match: { genre: { $exists: true, $ne: [] } } },
      { $unwind: '$genre' },
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),
    Movie.aggregate([
      {
        $match: {
          imdbRating: { $ne: null },
          genre: { $exists: true, $ne: [] },
        },
      },
      { $unwind: '$genre' },
      {
        $group: {
          _id: '$genre',
          averageRating: { $avg: '$imdbRating' },
          count: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1 } },
    ]),
    Movie.aggregate([
      {
        $match: {
          runtimeMinutes: { $ne: null },
          year: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$year',
          averageRuntime: { $avg: '$runtimeMinutes' },
          movieCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const overall = await Movie.aggregate([
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$imdbRating' },
        totalMovies: { $sum: 1 },
      },
    },
  ]);

  return {
    overall: overall[0] || { averageRating: null, totalMovies: 0 },
    genres: genreDistribution.map((item) => ({
      genre: item._id,
      count: item.count,
    })),
    ratingsByGenre: ratingsByGenre.map((item) => ({
      genre: item._id,
      averageRating: Number(item.averageRating.toFixed(2)),
      count: item.count,
    })),
    runtimeByYear: runtimeByYear.map((item) => ({
      year: item._id,
      averageRuntime: Number(item.averageRuntime.toFixed(2)),
      movieCount: item.movieCount,
    })),
  };
};

