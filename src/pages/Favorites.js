import { Container, Typography } from "@mui/material";
import MovieGrid from "../components/MovieGrid";
import { useMovies } from "../context/MovieContext";

// Shows movies the user saved locally
export default function Favorites() {
  const { favorites } = useMovies();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>My Favorites</Typography>
      {favorites.length === 0 ? (
        <Typography color="text.secondary">
          No favorites yet. Tap the heart on a movie to save it here.
        </Typography>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Container>
  );
}