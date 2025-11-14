import React from 'react';

const options = [
  { value: '', label: 'Relevance' },
  { value: 'rating:desc', label: 'Rating (High → Low)' },
  { value: 'rating:asc', label: 'Rating (Low → High)' },
  { value: 'year:desc', label: 'Release Year (New → Old)' },
  { value: 'year:asc', label: 'Release Year (Old → New)' },
  { value: 'runtime:desc', label: 'Runtime (Long → Short)' },
  { value: 'runtime:asc', label: 'Runtime (Short → Long)' },
  { value: 'title:asc', label: 'Title (A → Z)' },
  { value: 'title:desc', label: 'Title (Z → A)' },
];

export const SortSelect = ({ value, onChange }) => (
  <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
    Sort by
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-md border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      {options.map((option) => (
        <option key={option.value || 'default'} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

