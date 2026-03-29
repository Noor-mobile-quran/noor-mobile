import React, { createContext, useContext, useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import { themes, type ThemeColors } from "./colors";

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: themes.light,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.settings.theme);
  const uxMode = useAppStore((s) => s.settings.uxMode);

  const value = useMemo(() => {
    const DARK_THEMES: string[] = ["dark", "high-contrast", "moonlight", "forest", "oled"];
    const effectiveTheme = uxMode === "immersive"
      ? (DARK_THEMES.includes(theme) ? theme : "dark")
      : theme;
    return {
      colors: themes[effectiveTheme],
      isDark: DARK_THEMES.includes(effectiveTheme),
    };
  }, [theme, uxMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
