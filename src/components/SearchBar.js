import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Controlled search input (debouncing happens in the parent page)
export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      placeholder="Search for a movie..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}