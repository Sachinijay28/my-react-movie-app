import { useEffect, useState } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import MovieGrid from "../components/MovieGrid";
import ErrorMessage from "../components/ErrorMessage";
import { getTrending } from "../api/tmdb";

// TEMPORARY: trending movies only
export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrending()
      .then(({ data }) => setMovies(data.results))
      .catch(() => setError("Couldn't load movies. Check your connection and try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Trending this week</Typography>
      {error && <ErrorMessage message={error} />}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      <MovieGrid movies={movies} />
    </Container>
  );
}