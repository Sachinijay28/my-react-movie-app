import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ColorModeContext = createContext();
export const useColorMode = () => useContext(ColorModeContext);

// Provides light/dark mode to the whole app and remembers the choice
export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem("mode") || "light");

  // Save the choice whenever it changes
  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === "light" ? "dark" : "light"));
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}