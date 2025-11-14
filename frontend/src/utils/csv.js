export const convertMoviesToCsv = (movies) => {
  if (!movies?.length) return '';

  const headers = [
    'Title',
    'Year',
    'Runtime (min)',
    'Genres',
    'Director',
    'Actors',
    'IMDB Rating',
    'Plot',
  ];

  const rows = movies.map((movie) => [
    `"${movie.title ?? ''}"`,
    movie.year ?? '',
    movie.runtimeMinutes ?? '',
    `"${(movie.genre || []).join(', ')}"`,
    `"${(movie.director || []).join(', ')}"`,
    `"${(movie.actors || []).join(', ')}"`,
    movie.imdbRating ?? '',
    `"${(movie.plot ?? '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
};

export const downloadCsv = (filename, content) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

