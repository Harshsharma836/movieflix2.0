import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
    <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-100">Page not found</h2>
    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
      The page you were looking for doesn&apos;t exist or has been moved.
    </p>
    <Link
      to="/"
      className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
    >
      Back to home
    </Link>
  </div>
);

