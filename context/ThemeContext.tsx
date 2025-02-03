import React, { createContext, useContext, useState, ReactNode } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  themeStyles: { backgroundColor: string; overlayOpacity: number };
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  toggleTheme: () => {},
  themeStyles: { backgroundColor: "#FFFFFF", overlayOpacity: 0 },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      console.log(`🌗 Toggling Theme: ${newTheme ? "Dark Mode" : "Light Mode"}`);
      return newTheme;
    });
  };

  const themeStyles = {
    backgroundColor: isDark ? "#000000" : "#FFFFFF",
    overlayOpacity: isDark ? 0.7 : 0,
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, themeStyles }}>
      <StyledThemeProvider theme={isDark ? DarkTheme : DefaultTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
