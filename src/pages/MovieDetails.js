import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Chip, CircularProgress, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getMovieDetails, imageUrl } from "../api/tmdb";
import { useMovies } from "../context/MovieContext";
import ErrorMessage from "../components/ErrorMessage";

// Full details for one movie: poster, overview, genres, cast, trailer
export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovies();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Fetch details (with cast and videos) whenever the id changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getMovieDetails(id)
      .then(({ data }) => {
        if (!cancelled) setMovie(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 404) setError("Movie not found.");
        else setError("Couldn't load this movie. Check your connection and try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
        <ErrorMessage
          message={error}
          onRetry={error === "Movie not found." ? undefined : () => setRetryCount((c) => c + 1)}
        />
      </Container>
    );
  }

  const poster = imageUrl(movie.poster_path, "w500");
  const backdrop = imageUrl(movie.backdrop_path, "w1280");
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  // First YouTube trailer, if any
  const trailer = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  const fav = isFavorite(movie.id);

  return (
    <Box>
      {/* Faded backdrop behind the content */}
      {backdrop && (
        <Box
          sx={{
            height: { xs: 140, md: 260 },
            backgroundImage: `url(${backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
          }}
        />
      )}

      <Container sx={{ py: 3, mt: backdrop ? { xs: -8, md: -16 } : 0, position: "relative" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {poster && (
            <Box
              component="img"
              src={poster}
              alt={movie.title}
              sx={{
                width: { xs: "60%", md: 300 },
                alignSelf: { xs: "center", md: "flex-start" },
                borderRadius: 2,
                boxShadow: 6,
              }}
            />
          )}

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">
              {movie.title} {movie.release_date && `(${movie.release_date.slice(0, 4)})`}
            </Typography>
            {movie.tagline && (
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: "italic" }}>
                {movie.tagline}
              </Typography>
            )}

            <Box sx={{ my: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {movie.genres.map((g) => (
                <Chip key={g.id} label={g.name} />
              ))}
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>
              ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
              {movie.runtime ? ` • ${movie.runtime} min` : ""}
              {movie.release_date ? ` • ${movie.release_date}` : ""}
            </Typography>

            <Typography variant="h6">Overview</Typography>
            <Typography sx={{ mb: 2 }}>{movie.overview || "No overview available."}</Typography>

            <Button
              variant={fav ? "contained" : "outlined"}
              color="error"
              startIcon={fav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => toggleFavorite(movie)}
            >
              {fav ? "Remove from favorites" : "Add to favorites"}
            </Button>
          </Box>
        </Box>

        {cast.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Top Cast</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {cast.map((c) => (
                <Chip key={c.id} label={`${c.name} as ${c.character || "?"}`} variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        {trailer && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Trailer</Typography>
            {/* 16:9 responsive YouTube embed */}
            <Box sx={{ position: "relative", pb: "56.25%", height: 0, maxWidth: 800 }}>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </Box>
            <Button
              sx={{ mt: 1 }}
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noreferrer"
            >
              Watch on YouTube
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}