# MovieFlix Dashboard

MovieFlix is a full-stack movie analytics dashboard built for the MoEngage assignment. It integrates with the OMDb API, caches and aggregates movie data on a Node.js backend, and provides a modern React + Tailwind CSS frontend with search, filtering, sorting, CSV export, and interactive visualizations.

---

## Features

- 🔐 Admin authentication with JWT (email/password from environment variables).  
- 🎬 Search movies by title via OMDb, with local caching and automatic TTL refresh.  
- 🧭 Sort by rating, year, runtime, or title; filter by multiple genres.  
- 📊 Interactive analytics charts for genres, ratings, and runtime trends.  
- 📄 Movie detail pages with full metadata, cast, and external links.  
- 📥 CSV export, responsive layout, dark/light mode, and pagination.  
- ⚙️ Backend cache management: refresh or remove cached movies.  

---

## Architecture

```

frontend/ (Vite + React + Tailwind UI)
↓ REST (axios)
backend/ (Express + MongoDB + OMDb integration)
↳ MongoDB cache with aggregation pipelines
OMDb API (external data source)

````

- Backend normalizes and caches movie data in MongoDB, exposing REST endpoints for search, details, analytics, and cache management.  
- Frontend consumes APIs, handles auth token storage, and renders dashboards and visualizations.  

---

## Tech Stack

| Layer     | Technologies                                         |
|-----------|-----------------------------------------------------|
| Backend   | Node.js, Express, MongoDB (Mongoose), JWT, Axios, Zod, Helmet, CORS |
| Frontend  | React 18, Vite, React Router, Tailwind CSS, Headless UI, Chart.js, Axios |
| Tooling   | ESLint, Prettier, Nodemon, React Hook Form         |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.x  
- MongoDB (local or Atlas)  
- OMDb API key ([get free](https://www.omdbapi.com/apikey.aspx))  

### Steps

1. **Clone the repo**  
```bash
git clone https://github.com/your-username/movieflix-dashboard.git
cd movieflix-dashboard
````

2. **Configure environment variables**

```bash
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
```

Update `.env` files with your MongoDB URI, OMDb API key, JWT secret, and admin credentials.

3. **Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Running the Apps

**Backend**

```bash
cd backend
npm run dev
```

* Runs at `http://localhost:4000`
* Endpoints are under `/api`

**Frontend**

```bash
cd frontend
npm run dev
```

* Runs at `http://localhost:5173`
* API base URL set via `VITE_API_BASE_URL`

---

## API Overview

* `GET /api/movies` → Search movies with optional `search`, `sort`, `genre`, `page`, `limit` (No auth required)
* `GET /api/movies/:id` → Movie details by IMDb ID (No auth required)

**Analytics / Admin**

* `GET /api/stats` → Aggregated stats (JWT required)
* `POST /api/admin/cache/refresh` → Refresh cached movies (Admin only)
* `DELETE /api/admin/movies/:id` → Remove movie from cache (Admin only)

🔐 Admin authentication with JWT

Email: harsh@example.com

Password: ChangeMe123

---

## Database Overview

* **Collections:**

  * `movies` → stores movie metadata, ratings, runtime, genres, cast, and external links
  * `users` → stores admin credentials (email/password hash)
* **Indexes:**

  * `title` for fast search
  * `imdbId` for unique identification
* **Cache TTL:** Cached movies refresh automatically after the TTL set in `.env`

**Sample Overview:**


<img width="1539" height="957" alt="Screenshot 2025-11-14 111349" src="https://github.com/user-attachments/assets/634daf45-f82d-48c3-9469-b01a6818f634" />

<img width="1261" height="836" alt="Screenshot 2025-11-14 111310" src="https://github.com/user-attachments/assets/27f8e160-5969-4d71-ae63-de48d6380a92" />

<img width="1489" height="847" alt="Screenshot 2025-11-14 111457" src="https://github.com/user-attachments/assets/2ce719ba-7647-41d8-89ba-f20ddf7c338c" />

Shows `movies` collection with sample documents, indexes, and aggregation pipelines used for dashboard metrics.

---

Built with ❤️ by Harsh Sharma. Happy streaming!

```
