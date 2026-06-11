import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF7",
          100: "#FFF9ED",
          200: "#FFF3D6",
          300: "#FFE8B8",
        },
        sand: { 400: "#D4B896", 500: "#B89B78" },
        earth: {
          600: "#8B7355",
          700: "#6B5B45",
          800: "#4A3F30",
          900: "#2D261C",
        },
        gold: { 400: "#E8C547", 500: "#D4A843", 600: "#B8912F" },
        forest: { 700: "#1B4332", 800: "#143226", 900: "#0D1F18" },
        midnight: { 800: "#1A1410", 900: "#110E0A" },
      },
      fontFamily: { arabic: ["Amiri"], latin: ["Inter"] },
    },
  },
  plugins: [],
} satisfies Config;
