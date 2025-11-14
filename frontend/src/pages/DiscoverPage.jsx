import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMovies } from '../services/api.js';
import { MovieCard } from '../components/MovieCard.jsx';
import { SortSelect } from '../components/SortSelect.jsx';
import { GenreFilter } from '../components/GenreFilter.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { DownloadCsvButton } from '../components/DownloadCsvButton.jsx';
import { ErrorAlert } from '../components/ErrorAlert.jsx';
import { FiSearch } from 'react-icons/fi';
import { RiMovie2Line } from 'react-icons/ri';

const DEFAULT_SEARCH = 'harry potter';

export const DiscoverPage = () => {
  const [searchInput, setSearchInput] = useState(DEFAULT_SEARCH);
  const [query, setQuery] = useState(DEFAULT_SEARCH);
  const [moviesData, setMoviesData] = useState({
    movies: [],
    totalPages: 1,
    totalResults: 0,
    availableGenres: [],
  });
  const [sort, setSort] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 10;

  const extractGenres = (movies) => {
    const genres = new Set();
    movies.forEach((movie) => (movie.genre || []).forEach((g) => genres.add(g)));
    return Array.from(genres);
  };

  const loadMovies = useCallback(async () => {
    if (!query) return;
    try {
      setLoading(true);
      setError(null);

      const response = await fetchMovies({
        search: query,
        sort,
        genre: selectedGenres,
        page,
        limit,
      });

      const movies = response.movies || [];
      setMoviesData({
        movies,
        totalPages: response.totalPages || 1,
        totalResults: response.totalResultsFromApi || response.total || 0,
        availableGenres: extractGenres(movies),
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, [query, sort, selectedGenres, page, limit]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setError('Please enter a search term');
      return;
    }
    setPage(1);
    setQuery(searchInput.trim());
  }, [searchInput]);

  const handleGenreChange = useCallback((genres) => {
    setPage(1);
    setSelectedGenres(genres);
  }, []);

  const handleSortChange = useCallback((value) => {
    setPage(1);
    setSort(value);
  }, []);

  const displayTitle = useMemo(() => {
    if (!query) return 'Discover Movies';
    return `Showing results for “${query}”`;
  }, [query]);

  const { movies, totalPages, totalResults, availableGenres } = moviesData;

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-10 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('/textures/cinema-bg.webp')] bg-cover bg-center opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <RiMovie2Line className="text-4xl text-white/90" />
            <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight">
              MovieFlix 2.0 Analytics Dashboard
            </h1>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Dive into the world of cinema—search, filter, and analyze your favorite movies with real-time
            insights powered by OMDb and smart caching.
          </p>
          <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-lg" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search movies by title..."
                className="w-full rounded-xl border border-white/20 bg-white/10 px-12 py-3 text-base text-white backdrop-blur-md placeholder:text-white/70 focus:border-white focus:ring-2 focus:ring-white/50 outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-white/90 px-6 py-3 text-base font-semibold text-indigo-700 shadow-lg transition hover:bg-white hover:shadow-xl"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-4 z-20 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur-md shadow-lg dark:border-slate-700 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{displayTitle}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading ? 'Fetching results…' : `Showing ${movies.length} of ${totalResults} result${totalResults === 1 ? '' : 's'}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SortSelect value={sort} onChange={handleSortChange} />
          <GenreFilter selected={selectedGenres} onChange={handleGenreChange} availableGenres={availableGenres} />
          <DownloadCsvButton movies={movies} />
        </div>
      </section>

      {error && <ErrorAlert message={error} onRetry={loadMovies} />}

      {/* Movie Grid */}
      <section>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/40"></div>
              <div className="relative h-14 w-14 animate-spin rounded-full border-4 border-indigo-400 border-t-white" />
            </div>
          </div>
        ) : movies.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.omdbId || movie.imdbId} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
            <img
              src="/illustrations/empty-state-movies.svg"
              alt="No results"
              className="mx-auto mb-6 h-32 opacity-70"
            />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              No movies matched your search.
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try adjusting your search term or filters to discover more titles.
            </p>
          </div>
        )}
      </section>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};
