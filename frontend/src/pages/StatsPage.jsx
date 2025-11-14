import React, { useEffect, useState } from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { fetchStats } from '../services/api.js';
import { ErrorAlert } from '../components/ErrorAlert.jsx';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchStats();
        setStats(response.stats);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  if (!stats) {
    return <ErrorAlert message="No statistics available yet. Search for some movies first!" />;
  }

  const genreData = {
    labels: stats.genres.map((item) => item.genre),
    datasets: [
      {
        label: 'Genres',
        data: stats.genres.map((item) => item.count),
        backgroundColor: [
          '#2563eb',
          '#f59e0b',
          '#10b981',
          '#ef4444',
          '#8b5cf6',
          '#ec4899',
          '#14b8a6',
          '#f97316',
          '#3b82f6',
          '#22d3ee',
        ],
      },
    ],
  };

  const ratingData = {
    labels: stats.ratingsByGenre.map((item) => item.genre),
    datasets: [
      {
        label: 'Average Rating',
        data: stats.ratingsByGenre.map((item) => item.averageRating),
        backgroundColor: '#2563eb',
      },
    ],
  };

  const runtimeData = {
    labels: stats.runtimeByYear.map((item) => item.year),
    datasets: [
      {
        label: 'Average Runtime (min)',
        data: stats.runtimeByYear.map((item) => item.averageRuntime),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-10 text-white shadow-xl">
        <h1 className="text-3xl font-semibold">Movie Insights</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-200">
          Explore genre distribution, rating performance, and runtime trends based on the data cached in
          your MovieFlix backend.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Total Cached Movies" value={stats.overall.totalMovies} accent="primary" />
        <StatCard
          title="Average Rating"
          value={stats.overall.averageRating ? stats.overall.averageRating.toFixed(2) : 'N/A'}
          accent="amber"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Genres Distribution">
          <Pie data={genreData} />
        </ChartCard>
        <ChartCard title="Average Ratings by Genre">
          <Bar
            data={ratingData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 10,
                },
              },
            }}
          />
        </ChartCard>
      </section>

      <section>
        <ChartCard title="Average Runtime by Release Year">
          <Line
            data={runtimeData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </ChartCard>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, accent }) => {
  const accentClasses =
    accent === 'amber'
      ? 'from-amber-400/20 via-amber-500/10 to-amber-600/10 text-amber-600 dark:text-amber-300'
      : 'from-primary/20 via-primary/10 to-primary/5 text-primary dark:text-primary-light';

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${accentClasses} p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900`}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
    <div className="h-80">{children}</div>
  </div>
);

