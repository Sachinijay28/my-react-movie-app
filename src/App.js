import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { AppThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { MovieProvider } from "./context/MovieContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";

// Root component: providers wrap the router, routes map URLs to pages
export default function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <MovieProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Required TMDb attribution */}
            <Box component="footer" sx={{ textAlign: "center", py: 3, px: 2 }}>
              <Typography variant="caption" color="text.secondary">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </Typography>
            </Box>
          </BrowserRouter>
        </MovieProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}