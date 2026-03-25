import type { ThemeMode } from "../types";

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentBright: string;
  forest: string;
  gold: string;
  border: string;
}

export const themes: Record<ThemeMode, ThemeColors> = {
  light: {
    bg: "#FFF9ED",
    surface: "#FFF3D6",
    surfaceElevated: "#FFFDF7",
    textPrimary: "#2D261C",
    textSecondary: "#6B5B45",
    accent: "#D4A843",
    accentBright: "#E8C547",
    forest: "#1B4332",
    gold: "#D4A843",
    border: "rgba(212, 168, 67, 0.15)",
  },
  dark: {
    bg: "#1A1410",
    surface: "#2D261C",
    surfaceElevated: "#3D3428",
    textPrimary: "#FFF9ED",
    textSecondary: "#D4B896",
    accent: "#E8C547",
    accentBright: "#D4A843",
    forest: "#1B4332",
    gold: "#E8C547",
    border: "rgba(232, 197, 71, 0.15)",
  },
  "high-contrast": {
    bg: "#000000",
    surface: "#1A1A1A",
    surfaceElevated: "#2A2A2A",
    textPrimary: "#FFFFFF",
    textSecondary: "#E0E0E0",
    accent: "#FFD700",
    accentBright: "#FFEA00",
    forest: "#00C853",
    gold: "#FFD700",
    border: "rgba(255, 215, 0, 0.3)",
  },
};
