import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Demo credentials (simulated login: there is no backend)
const DEMO_USER = "admin";
const DEMO_PASS = "password123";

export function AuthProvider({ children }) {
  // Restore the logged-in user from localStorage (safe against corrupt data)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // Returns true on success, false on wrong credentials
  const login = (username, password) => {
    if (username === DEMO_USER && password === DEMO_PASS) {
      const u = { username };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}