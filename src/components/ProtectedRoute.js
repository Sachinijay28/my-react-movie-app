import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Only lets logged-in users through; others go to /login
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}