import axios from "axios";

// Shared axios instance for all TMDb requests
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`,
    accept: "application/json",
  },
});

export const getTrending = (page = 1) =>
  api.get("/trending/movie/week", { params: { page } });

export const searchMovies = (query, page = 1) =>
  api.get("/search/movie", { params: { query, page } });

export const getMovieDetails = (id) =>
  api.get(`/movie/${id}`, { params: { append_to_response: "credits,videos" } });

export const getGenres = () => api.get("/genre/movie/list");

export const discoverMovies = (params) =>
  api.get("/discover/movie", { params });

// Builds a full image URL from TMDb's partial path
export const posterUrl = (path, size = "w342") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";