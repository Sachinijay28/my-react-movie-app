import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

// Login form with basic validation
export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Already logged in? Skip the form.
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }
    if (login(username.trim(), password)) {
      navigate("/");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, sm: 10 }, px: 2 }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom>
          Movie Explorer
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Demo login: admin / password123
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Log in
        </Button>
      </Paper>
    </Box>
  );
}