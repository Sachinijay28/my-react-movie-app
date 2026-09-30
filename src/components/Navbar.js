import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/Brightness4";
import LightModeIcon from "@mui/icons-material/Brightness7";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ThemeContext";

// Top bar: navigation links, theme toggle, logout
export default function Navbar() {
  const { user, logout } = useAuth();
  const { mode, toggle } = useColorMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: 16, sm: 20 } }}>
          🎬 Movie Explorer
        </Typography>
        {user && (
          <Box>
            <Button color="inherit" component={RouterLink} to="/">Home</Button>
            <Button color="inherit" component={RouterLink} to="/favorites">Favorites</Button>
          </Box>
        )}
        <IconButton color="inherit" onClick={toggle} aria-label="toggle theme">
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        {user && (
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}