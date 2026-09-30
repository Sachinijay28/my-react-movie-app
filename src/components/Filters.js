import { useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material";

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => THIS_YEAR - i);

// Genre, year and minimum-rating filters
export default function Filters({ genres, filters, onChange }) {
  // Slider keeps a local value while dragging; the parent is notified on release
  const [rating, setRating] = useState(filters.rating);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, my: 2, alignItems: "center" }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Genre</InputLabel>
        <Select
          label="Genre"
          value={filters.genre}
          onChange={(e) => onChange({ ...filters, genre: e.target.value })}
        >
          <MenuItem value="">Any</MenuItem>
          {genres.map((g) => (
            <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 110 }}>
        <InputLabel>Year</InputLabel>
        <Select
          label="Year"
          value={filters.year}
          onChange={(e) => onChange({ ...filters, year: e.target.value })}
        >
          <MenuItem value="">Any</MenuItem>
          {YEARS.map((y) => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ width: 180 }}>
        <Typography variant="caption">Min rating: {rating}</Typography>
        <Slider
          size="small"
          min={0}
          max={9}
          step={1}
          value={rating}
          onChange={(_, v) => setRating(v)}
          onChangeCommitted={(_, v) => onChange({ ...filters, rating: v })}
        />
      </Box>
    </Box>
  );
}