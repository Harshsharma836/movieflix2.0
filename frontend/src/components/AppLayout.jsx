import React from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider.jsx';
import { useTheme } from '../providers/ThemeProvider.jsx';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { FaGithub } from "react-icons/fa";


const navLinkClass = ({ isActive }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary text-white'
      : 'text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700',
  ].join(' ');

export const AppLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
            MovieFlix
          </Link>
          {isAuthenticated && (
            <nav className="flex items-center gap-2">
              <NavLink to="/" className={navLinkClass} end>
                Discover
              </NavLink>
              <NavLink to="/stats" className={navLinkClass}>
                Stats
              </NavLink>
            </nav>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="h-5 w-5" aria-hidden="true" />
              )}
              <span className="sr-only">Toggle theme</span>
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden text-right text-sm sm:block">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {user?.email}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    if (location.pathname !== '/login') {
                      navigate('/login', { replace: true });
                    }
                  }}
                  className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 py-6 text-center text-sm text-slate-600 shadow-inner dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:text-slate-400">
    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
      <span className="font-medium">
        Built with ❤️ by{" "}
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          Harsh Sharma
        </span>{" "}
        © {new Date().getFullYear()}.
      </span>

      <a
        href="https://github.com/Harshsharma836"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-3 py-1.5 text-slate-700 shadow-sm backdrop-blur transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
      >
        <FaGithub className="text-lg transition-transform group-hover:scale-110" />
        <span className="font-medium">GitHub</span>
      </a>
    </div>
  </footer>
      {/* <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Built with Harsh Sharma © 2025.
      </footer> */}
    </div>
  );
};

