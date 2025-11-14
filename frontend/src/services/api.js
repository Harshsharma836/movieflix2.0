import axios from 'axios';

const baseURL = 'https://movieflix-2-0.onrender.com/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('movieflix::token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchMovies = async ({ search, sort, genre, page, limit }) => {
  const params = {};
  if (search) params.search = search;
  if (sort) params.sort = sort;
  if (genre?.length) params.genre = genre.join(',');
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await apiClient.get('/movies', { params });
  return response.data;
};

export const fetchMovieDetails = async (id) => {
  const response = await apiClient.get(`/movies/${id}`);
  return response.data;
};

export const fetchStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};

