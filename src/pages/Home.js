import { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import MovieGrid from "../components/MovieGrid";
import ErrorMessage from "../components/ErrorMessage";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { useMovies } from "../context/MovieContext";
import { discoverMovies, getGenres, getTrending, searchMovies } from "../api/tmdb";

const EMPTY_FILTERS = { genre: "", year: "", rating: 0 };

// Home: trending (Load More button), search and filtered results (infinite scroll)
export default function Home() {
  const { lastSearch, setLastSearch } = useMovies();

  const [input, setInput] = useState(lastSearch); // what the user is typing
  const [query, setQuery] = useState(lastSearch.trim()); // debounced value
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [genres, setGenres] = useState([]);

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const keyRef = useRef(""); // remembers the last query+filters combination

  const filtersActive = Boolean(filters.genre || filters.year || filters.rating > 0);
  const mode = query ? "search" : filtersActive ? "discover" : "trending";

  // Debounce: wait 500ms after typing stops, then update `query`
  useEffect(() => {
    const t = setTimeout(() => {
      const q = input.trim();
      setQuery(q);
      if (q) setLastSearch(q); // persist the last search
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // Load the genre list once for the filter dropdown
  useEffect(() => {
    getGenres()
      .then((r) => setGenres(r.data.genres))
      .catch(() => {}); // filters are optional, fail silently
  }, []);

  // Fetch movies whenever the query, filters or page change
  useEffect(() => {
    // If the query or filters changed, restart from page 1
    const key = JSON.stringify([query, filters]);
    if (key !== keyRef.current) {
      keyRef.current = key;
      if (page !== 1) {
        setPage(1);
        return; // this effect runs again with page = 1
      }
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    let request;
    if (query) {
      request = searchMovies(query, page);
    } else if (filtersActive) {
      request = discoverMovies({
        page,
        sort_by: "popularity.desc",
        with_genres: filters.genre || undefined,
        primary_release_year: filters.year || undefined,
        "vote_average.gte": filters.rating || undefined,
        "vote_count.gte": 50, // ignore movies with almost no votes
      });
    } else {
      request = getTrending(page);
    }

    request
      .then(({ data }) => {
        if (cancelled) return;
        // Page 1 replaces the list; later pages are appended
        setResults((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
        setTotalPages(Math.min(data.total_pages, 500)); // TMDb caps at 500 pages
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err.response
            ? `TMDb returned an error (${err.response.status}). Please try again.`
            : "Couldn't reach the server. Check your connection and try again."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true; // ignore results from outdated requests
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters, page, retryCount]);

  const hasMore = page < totalPages;

  // Infinite scroll for search and filtered results
  const sentinelRef = useInfiniteScroll(
    () => setPage((p) => p + 1),
    mode !== "trending" && hasMore && !loading && !error
  );

  const title =
    mode === "search"
      ? `Results for "${query}"`
      : mode === "discover"
      ? "Filtered movies"
      : "Trending this week";

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <SearchBar value={input} onChange={setInput} />
      <Filters genres={genres} filters={filters} onChange={setFilters} />

      <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>

      {error && <ErrorMessage message={error} onRetry={() => setRetryCount((c) => c + 1)} />}

      {!loading && !error && results.length === 0 && (
        <Typography color="text.secondary">No movies found. Try a different search.</Typography>
      )}

      <MovieGrid movies={results} />

      {/* Invisible marker that triggers infinite scroll when it becomes visible */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Trending uses a "Load More" button instead of infinite scroll */}
      {mode === "trending" && hasMore && !loading && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Button variant="outlined" onClick={() => setPage((p) => p + 1)}>
            Load More
          </Button>
        </Box>
      )}
    </Container>
  );
}