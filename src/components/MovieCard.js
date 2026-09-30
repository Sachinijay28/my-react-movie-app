import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MovieIcon from "@mui/icons-material/Movie";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { imageUrl } from "../api/tmdb";
import { useMovies } from "../context/MovieContext";

// Poster, title, year and rating; click opens details, heart toggles favorite
export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovies();
  const poster = imageUrl(movie.poster_path);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const fav = isFavorite(movie.id);

  return (
    <Card
      onClick={() => navigate(`/movie/${movie.id}`)}
      sx={{ cursor: "pointer", position: "relative", height: "100%", "&:hover": { boxShadow: 6 } }}
    >
      {poster ? (
        <CardMedia component="img" image={poster} alt={movie.title} sx={{ aspectRatio: "2 / 3" }} />
      ) : (
        // Placeholder when TMDb has no poster
        <Box sx={{ aspectRatio: "2 / 3", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "action.hover" }}>
          <MovieIcon sx={{ fontSize: 48, opacity: 0.4 }} />
        </Box>
      )}

      <IconButton
        aria-label="toggle favorite"
        onClick={(e) => {
          e.stopPropagation(); // don't open the details page
          toggleFavorite(movie);
        }}
        sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.5)", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
      >
        {fav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon sx={{ color: "white" }} />}
      </IconButton>

      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography variant="subtitle2" noWrap title={movie.title}>
          {movie.title}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">{year}</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StarIcon sx={{ fontSize: 14, color: "gold", mr: 0.3 }} />
            <Typography variant="caption">{rating}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}