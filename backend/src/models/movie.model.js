import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    source: String,
    value: String,
  },
  { _id: false },
);

const movieSchema = new mongoose.Schema(
  {
    omdbId: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    year: Number,
    rated: String,
    released: Date,
    runtimeMinutes: Number,
    genre: [String],
    director: [String],
    writer: [String],
    actors: [String],
    plot: String,
    country: [String],
    awards: String,
    poster: String,
    ratings: [ratingSchema],
    metascore: Number,
    imdbRating: Number,
    imdbVotes: Number,
    imdbId: String,
    type: String,
    dvd: Date,
    boxOffice: String,
    production: String,
    website: String,
    totalSeasons: Number,
    lastFetchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

movieSchema.index({ title: 'text', plot: 'text' });

export const Movie = mongoose.model('Movie', movieSchema);

