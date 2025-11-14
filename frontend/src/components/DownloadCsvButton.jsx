import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { convertMoviesToCsv, downloadCsv } from '../utils/csv.js';

export const DownloadCsvButton = ({ movies }) => {
  if (!movies?.length) return null;

  const handleDownload = () => {
    const csv = convertMoviesToCsv(movies);
    downloadCsv('movieflix-export.csv', csv);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
    >
      <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
      Download CSV
    </button>
  );
};

