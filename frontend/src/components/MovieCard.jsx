import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

export const MovieCard = ({ movie }) => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
    {movie.poster ? (
      <img src={movie.poster} alt={movie.title} className="h-64 w-full object-cover" loading="lazy" />
    ) : (
      <div className="flex h-64 items-center justify-center bg-slate-200 text-slate-500">No Poster</div>
    )}
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div>
        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {movie.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {movie.year} • {movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : 'Unknown runtime'}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(movie.genre || []).slice(0, 3).map((genre) => (
          <span
            key={genre}
            className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20"
          >
            {genre}
          </span>
        ))}
      </div>
      <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{movie.plot}</p>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
          <StarIcon className="h-4 w-4" aria-hidden="true" />
          <span>{movie.imdbRating ?? 'N/A'}</span>
        </div>
        <Link
          to={`/movies/${movie.omdbId || movie.imdbId}`}
          className="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          View Details
        </Link>
      </div>
    </div>
  </div>
);

