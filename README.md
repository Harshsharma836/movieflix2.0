# MovieFlix Dashboard

MovieFlix is a full-stack movie analytics dashboard built for the MoEngage assignment. It integrates with the public OMDb API, caches and aggregates data on a Node.js backend, and ships a modern React + Tailwind CSS frontend that provides search, filtering, sorting, CSV export, and rich visualisations.

## Table of contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Running the apps](#running-the-apps)
- [API overview](#api-overview)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Features

- 🔐 JWT-based admin authentication (email/password from environment variables).
- 🎬 Search movies by title with OMDb, cached locally with automatic TTL refresh.
- 🧭 Sorting by rating, year, runtime, and title plus multi-select genre filtering.
- 📦 Aggregated metrics on genre distribution, ratings, and runtime trends.
- 📊 Interactive charts (pie, bar, line) for analytics, protected behind admin login.
- 📄 Movie detail pages with rich metadata, cast, and external links.
- 📥 CSV export, responsive layout, dark/light mode toggle, and pagination.
- ⚙️ Backend cache management endpoints for refreshing and pruning data.

## Architecture

```
frontend/ (Vite + React + Tailwind UI)
   ↓ REST (axios)
backend/ (Express + MongoDB + OMDb integration)
   ↳ MongoDB cache with aggregation pipelines
OMDb API (external data source)
```

- The backend acts as a gateway to OMDb, normalises and stores movie documents in MongoDB, and exposes REST endpoints for search, details, admin cache control, and stats.
- The frontend consumes the backend APIs, manages auth token storage, and renders the dashboard UI and visualisations.

## Tech stack

| Layer     | Technologies                                                                 |
|-----------|-------------------------------------------------------------------------------|
| Backend   | Node.js, Express, MongoDB (Mongoose), JWT, Axios, Zod, Helmet, CORS          |
| Frontend  | React 18, Vite, React Router, Tailwind CSS, Headless UI, Chart.js, Axios      |
| Tooling   | ESLint, Prettier, Nodemon, React Hook Form                                    |

## Project structure

```
.
├── backend
│   ├── env.example
│   ├── package.json
│   └── src
│       ├── app.js
│       ├── server.js
│       ├── config
│       ├── controllers
│       ├── middlewares
│       ├── models
│       ├── routes
│       ├── services
│       └── utils
├── frontend
│   ├── env.example
│   ├── package.json
│   ├── index.html
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── providers
│       ├── pages
│       ├── components
│       ├── services
│       └── utils
└── README.md
```

## Getting started

### Prerequisites

- Node.js ≥ 18.x and npm (or Yarn / pnpm).
- A MongoDB instance (local or MongoDB Atlas).
- An OMDb API key (free at [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)).

### 1. Clone the repository

```bash
git clone https://github.com/your-username/movieflix-dashboard.git
cd movieflix-dashboard
```

### 2. Configure environment variables

Create environment files by copying the provided examples:

```bash
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
```

Update the `.env` files:

- `backend/.env`
  - `MONGODB_URI`: your MongoDB connection string.
  - `OMDB_API_KEY`: OMDb API key.
  - `JWT_SECRET`: random secret for signing tokens.
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD`: credentials for admin login.
  - `CACHE_TTL_HOURS`: TTL (default 24h) for cached movies.
- `frontend/.env`
  - `VITE_API_BASE_URL`: points to the deployed backend (default `http://localhost:4000/api`).

### 3. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Running the apps

### Backend (Express API)

```bash
cd backend
npm run dev
```

- Starts the server on `http://localhost:4000`.
- Available endpoints are namespaced under `/api`.

### Frontend (React dashboard)

```bash
cd frontend
npm run dev
```

- Runs the Vite dev server on `http://localhost:5173`.
- Configure the API base URL via `VITE_API_BASE_URL`.

## API overview

| Method | Endpoint                | Description                                      | Auth |
|--------|-------------------------|--------------------------------------------------|------|
| POST   | `/api/auth/login`       | Admin login, returns JWT                         | ❌   |
| GET    | `/api/auth/me`          | Returns current user profile                     | ✅   |
| GET    | `/api/movies`           | Search movies with `search`, `sort`, `genre`, `page`, `limit` | ❌ |
| GET    | `/api/movies/:id`       | Retrieve movie details by IMDb ID                | ❌   |
| GET    | `/api/stats`            | Aggregated stats (genres, ratings, runtime)      | ✅   |
| POST   | `/api/admin/cache/refresh` | Force refresh cached movies                    | ✅ (admin) |
| DELETE | `/api/admin/movies/:id` | Remove a movie from cache                        | ✅ (admin) |

Sorting accepts values like `rating:desc`, `year:asc`, `runtime:desc`, `title:asc`.
Genre filtering supports comma-separated values, e.g. `genre=Action,Sci-Fi`.

## Deployment

You can deploy the stack on popular free tiers:

- **Backend**: Render, Railway, Fly.io, or Heroku.  
  1. Set environment variables (Mongo URI, OMDb key, admin credentials).  
  2. Use `npm run start` as the launch command.
- **Frontend**: Vercel or Netlify.  
  1. Configure `VITE_API_BASE_URL` to point at the deployed backend URL.  
  2. Build with `npm run build`.

Ensure CORS is configured (`cors` is currently permissive; tighten for production).

## Troubleshooting

- **Movies not loading**: verify the OMDb API key and that you have not exceeded the free rate limit.
- **Stats page empty**: the analytics aggregate over cached movies; run a few searches first.
- **Authentication errors**: confirm the frontend `.env` points to the same backend and credentials match the backend `.env`.
- **Mongo connection failure**: make sure MongoDB is reachable from your environment and the URI is correct.

---

Built with ❤️ for MoEngage. Happy streaming!

