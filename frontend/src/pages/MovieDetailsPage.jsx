import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../services/api.js';
import { ErrorAlert } from '../components/ErrorAlert.jsx';
import { ArrowLeftIcon, ClockIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

export const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchMovieDetails(id);
        setMovie(response.movie);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!movie) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Movie not found</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          We couldn&apos;t find details for this movie.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Back to results
      </Link>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="w-full object-cover" />
          ) : (
            <div className="flex h-96 items-center justify-center bg-slate-200 text-slate-500">
              No Poster Available
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{movie.title}</h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
              {movie.year} • {movie.rated || 'NR'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
              <StarIcon className="mr-1 h-4 w-4" aria-hidden="true" />
              {movie.imdbRating ?? 'N/A'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <ClockIcon className="h-4 w-4" aria-hidden="true" />
              {movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : 'Unknown runtime'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <GlobeAltIcon className="h-4 w-4" aria-hidden="true" />
              {(movie.language || []).join(', ') || 'Languages unavailable'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <UserGroupIcon className="h-4 w-4" aria-hidden="true" />
              {(movie.actors || []).slice(0, 2).join(', ') || 'Actors unavailable'}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Plot</h2>
            <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {movie.plot || 'Plot synopsis is not available.'}
            </p>
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
            <DetailList title="Genres" items={movie.genre} />
            <DetailList title="Directors" items={movie.director} />
            <DetailList title="Writers" items={movie.writer} />
            <DetailList title="Actors" items={movie.actors} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ExternalLinkButton href={`https://www.imdb.com/title/${movie.imdbId}`} label="View on IMDb" />
            {movie.website && <ExternalLinkButton href={movie.website} label="Official Website" />}
          </div>
        </div>
      </div>
    </article>
  );
};

const DetailList = ({ title, items }) => (
  <div>
    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
      {items?.length ? items.join(', ') : 'Not available'}
    </p>
  </div>
);

const ExternalLinkButton = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
  >
    {label}
  </a>
);

