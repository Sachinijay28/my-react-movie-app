import { createContext, useContext, useEffect, useState } from "react";

const MovieContext = createContext();
export const useMovies = () => useContext(MovieContext);

// Read from localStorage safely; fall back if missing or corrupt
const load = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

// Holds favorites and the last searched term, both persisted locally
export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState(() => load("favorites", []));
  const [lastSearch, setLastSearch] = useState(() => load("lastSearch", ""));

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("lastSearch", JSON.stringify(lastSearch));
  }, [lastSearch]);

  const isFavorite = (id) => favorites.some((m) => m.id === id);

  // Store only the fields we need to render a card
  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      setFavorites((prev) => prev.filter((m) => m.id !== movie.id));
    } else {
      const { id, title, poster_path, release_date, vote_average } = movie;
      setFavorites((prev) => [...prev, { id, title, poster_path, release_date, vote_average }]);
    }
  };

  return (
    <MovieContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, lastSearch, setLastSearch }}
    >
      {children}
    </MovieContext.Provider>
  );
}