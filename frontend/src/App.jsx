import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DiscoverPage } from './pages/DiscoverPage.jsx';
import { MovieDetailsPage } from './pages/MovieDetailsPage.jsx';
import { StatsPage } from './pages/StatsPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<DiscoverPage />} />
      <Route path="movies/:id" element={<MovieDetailsPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="stats" element={<StatsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default App;

