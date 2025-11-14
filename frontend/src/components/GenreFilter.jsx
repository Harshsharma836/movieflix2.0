import React, { useMemo, useState } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

const COMMON_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
];

export const GenreFilter = ({ selected = [], onChange, availableGenres = [] }) => {
  const [open, setOpen] = useState(false);
  const allGenres = useMemo(() => {
    const set = new Set([...COMMON_GENRES, ...availableGenres]);
    return Array.from(set).sort();
  }, [availableGenres]);

  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      onChange(selected.filter((item) => item !== genre));
    } else {
      onChange([...selected, genre]);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-primary"
      >
        Genres
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary dark:bg-primary/20">
          {selected.length}
        </span>
        <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Genres
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs font-medium text-primary hover:text-primary-dark"
            >
              Reset
            </button>
          </div>
          <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
            {allGenres.map((genre) => {
              const isSelected = selected.includes(genre);
              return (
                <button
                  type="button"
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm transition ${
                    isSelected
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{genre}</span>
                  {isSelected && <CheckIcon className="h-4 w-4" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

