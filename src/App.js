import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { AppThemeProvider, useColorMode } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

// TEMPORARY placeholder home page, only for testing login and theme
function TempHome() {
  const { user, logout } = useAuth();
  const { mode, toggle } = useColorMode();
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Welcome, {user.username}! (mode: {mode})</Typography>
      <Button variant="contained" onClick={toggle} sx={{ mr: 2, mt: 2 }}>Toggle theme</Button>
      <Button variant="outlined" onClick={logout} sx={{ mt: 2 }}>Logout</Button>
    </Box>
  );
}

export default function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><TempHome /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppThemeProvider>
  );
}

