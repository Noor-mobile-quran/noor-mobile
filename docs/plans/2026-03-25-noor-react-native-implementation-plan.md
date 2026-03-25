# Noor React Native Migration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate Noor from a Vite+React web app to a React Native (Expo) mobile app, resolving all 6 design strategy alignment issues from `.impeccable.md` in the process.

**Architecture:** Expo managed workflow with file-based routing (expo-router), NativeWind for Tailwind-like styling, Zustand + MMKV for state, react-native-svg for ornaments, expo-av for audio, and a ThemeProvider supporting light/dark/high-contrast modes.

**Tech Stack:** Expo SDK 52, React Native 0.76, TypeScript 5.9, NativeWind 4, Zustand 5, React Native MMKV, React Native Reanimated 3, expo-av, react-native-svg, @tanstack/react-query 5

---

## Wave 1: Project Scaffold & Core Infrastructure

### Task 1: Initialize Expo Project

**Files:**
- Create: `noor-mobile/` (entire project scaffold)

**Step 1: Create Expo project with TypeScript template**

Run:
```bash
cd /Users/varunmoka/GTC/Safwan
npx create-expo-app@latest noor-mobile --template tabs
```

Expected: New `noor-mobile/` directory with Expo project

**Step 2: Verify project runs**

Run:
```bash
cd /Users/varunmoka/GTC/Safwan/noor-mobile
npx expo start --no-dev --minify 2>&1 | head -20
```

Expected: Metro bundler starts without errors

**Step 3: Commit**

```bash
cd /Users/varunmoka/GTC/Safwan
git add noor-mobile/
git commit -m "feat(noor-mobile): scaffold Expo project with TypeScript"
```

---

### Task 2: Install Dependencies

**Files:**
- Modify: `noor-mobile/package.json`

**Step 1: Install production dependencies**

Run:
```bash
cd /Users/varunmoka/GTC/Safwan/noor-mobile
npx expo install expo-av expo-font expo-status-bar react-native-mmkv react-native-reanimated react-native-safe-area-context react-native-screens react-native-svg nativewind tailwindcss zustand @tanstack/react-query
```

**Step 2: Install dev dependencies**

Run:
```bash
cd /Users/varunmoka/GTC/Safwan/noor-mobile
npm install -D @types/react prettier
```

**Step 3: Create NativeWind config**

Create `noor-mobile/tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
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
        sand: {
          400: "#D4B896",
          500: "#B89B78",
        },
        earth: {
          600: "#8B7355",
          700: "#6B5B45",
          800: "#4A3F30",
          900: "#2D261C",
        },
        gold: {
          400: "#E8C547",
          500: "#D4A843",
          600: "#B8912F",
        },
        forest: {
          700: "#1B4332",
          800: "#143226",
          900: "#0D1F18",
        },
        midnight: {
          800: "#1A1410",
          900: "#110E0A",
        },
      },
      fontFamily: {
        arabic: ["Amiri"],
        latin: ["Inter"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

Create `noor-mobile/global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Configure babel for NativeWind + Reanimated**

Create/update `noor-mobile/babel.config.js`:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
```

Create `noor-mobile/metro.config.js`:
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

**Step 5: Commit**

```bash
cd /Users/varunmoka/GTC/Safwan
git add noor-mobile/
git commit -m "feat(noor-mobile): install dependencies and configure NativeWind"
```

---

### Task 3: Port Types

**Files:**
- Create: `noor-mobile/types/index.ts`

**Step 1: Copy and update types from web project**

Create `noor-mobile/types/index.ts`:
```typescript
export interface SurahMeta {
  number: number;
  name_arabic: string;
  name_english: string;
  name_translation: string;
  revelation_type: "meccan" | "medinan";
  ayah_count: number;
  juz_start: number;
}

export interface Ayah {
  number: number;
  number_in_surah: number;
  text_arabic: string;
  text_translation: string;
  juz: number;
  page: number;
  audio_url?: string;
}

export interface Surah extends SurahMeta {
  ayahs: Ayah[];
}

export interface Bookmark {
  surah: number;
  ayah: number;
  timestamp: number;
  note?: string;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  lastReadSurah: number | null;
  lastReadAyah: number | null;
  dailyGoal: number;
  completedSurahs: number[];
}

export type UXMode = "serene" | "immersive" | "study";
export type ThemeMode = "light" | "dark" | "high-contrast";

export interface UserSettings {
  theme: ThemeMode;
  uxMode: UXMode;
  translationLang: string;
  reciterId: string;
  fontSize: "sm" | "md" | "lg" | "xl";
}
```

Note: `ThemeMode` now includes `"high-contrast"` (Issue #4).

**Step 2: Commit**

```bash
git add noor-mobile/types/
git commit -m "feat(noor-mobile): port TypeScript types with high-contrast theme"
```

---

### Task 4: Theme System (Issues #4 — High Contrast)

**Files:**
- Create: `noor-mobile/theme/colors.ts`
- Create: `noor-mobile/theme/typography.ts`
- Create: `noor-mobile/theme/ThemeProvider.tsx`

**Step 1: Create color tokens**

Create `noor-mobile/theme/colors.ts`:
```typescript
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
```

**Step 2: Create typography config**

Create `noor-mobile/theme/typography.ts`:
```typescript
export const fonts = {
  arabic: {
    regular: "Amiri-Regular",
    bold: "Amiri-Bold",
  },
  latin: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
    bold: "Inter-Bold",
  },
};

export const fontSizes = {
  sm: { arabic: 20, latin: 14 },
  md: { arabic: 26, latin: 16 },
  lg: { arabic: 32, latin: 18 },
  xl: { arabic: 38, latin: 20 },
} as const;
```

**Step 3: Create ThemeProvider**

Create `noor-mobile/theme/ThemeProvider.tsx`:
```typescript
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
    // Immersive mode forces dark theme
    const effectiveTheme = uxMode === "immersive" ? "dark" : theme;
    return {
      colors: themes[effectiveTheme],
      isDark: effectiveTheme === "dark" || effectiveTheme === "high-contrast",
    };
  }, [theme, uxMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

**Step 4: Commit**

```bash
git add noor-mobile/theme/
git commit -m "feat(noor-mobile): add theme system with light/dark/high-contrast"
```

---

### Task 5: Storage + Zustand Store (MMKV)

**Files:**
- Create: `noor-mobile/lib/storage.ts`
- Create: `noor-mobile/store/useAppStore.ts`

**Step 1: Create MMKV storage adapter**

Create `noor-mobile/lib/storage.ts`:
```typescript
import { MMKV } from "react-native-mmkv";
import type { Bookmark, UserProgress, UserSettings } from "../types";

const mmkv = new MMKV({ id: "noor-storage" });

const KEYS = {
  settings: "noor-settings",
  progress: "noor-progress",
  bookmarks: "noor-bookmarks",
} as const;

function getJSON<T>(key: string): T | null {
  const raw = mmkv.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setJSON<T>(key: string, value: T): void {
  mmkv.set(key, JSON.stringify(value));
}

export const storage = {
  getSettings: () => getJSON<UserSettings>(KEYS.settings),
  setSettings: (s: UserSettings) => setJSON(KEYS.settings, s),

  getProgress: () => getJSON<UserProgress>(KEYS.progress),
  setProgress: (p: UserProgress) => setJSON(KEYS.progress, p),

  getBookmarks: () => getJSON<Bookmark[]>(KEYS.bookmarks) ?? [],
  setBookmarks: (b: Bookmark[]) => setJSON(KEYS.bookmarks, b),

  addBookmark: (b: Bookmark) => {
    const existing = storage.getBookmarks();
    const filtered = existing.filter(
      (x) => !(x.surah === b.surah && x.ayah === b.ayah)
    );
    storage.setBookmarks([...filtered, b]);
  },

  removeBookmark: (surah: number, ayah: number) => {
    const existing = storage.getBookmarks();
    storage.setBookmarks(
      existing.filter((x) => !(x.surah === surah && x.ayah === ayah))
    );
  },
};
```

**Step 2: Port Zustand store**

Create `noor-mobile/store/useAppStore.ts`:
```typescript
import { create } from "zustand";
import type { UXMode, ThemeMode, UserProgress, UserSettings } from "../types";
import { storage } from "../lib/storage";

const DEFAULT_SETTINGS: UserSettings = {
  theme: "light",
  uxMode: "serene",
  translationLang: "en",
  reciterId: "mishary",
  fontSize: "md",
};

const DEFAULT_PROGRESS: UserProgress = {
  currentStreak: 0,
  longestStreak: 0,
  lastReadDate: null,
  lastReadSurah: null,
  lastReadAyah: null,
  dailyGoal: 5,
  completedSurahs: [],
};

interface AppState {
  settings: UserSettings;
  progress: UserProgress;
  audioPlaying: boolean;
  currentAudioAyah: number | null;

  setUXMode: (mode: UXMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (size: UserSettings["fontSize"]) => void;
  updateProgress: (p: Partial<UserProgress>) => void;
  recordReading: (surah: number, ayah: number) => void;
  setAudioPlaying: (playing: boolean, ayah?: number | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: storage.getSettings() ?? DEFAULT_SETTINGS,
  progress: storage.getProgress() ?? DEFAULT_PROGRESS,
  audioPlaying: false,
  currentAudioAyah: null,

  setUXMode: (mode) => {
    set((s) => {
      const settings = { ...s.settings, uxMode: mode };
      storage.setSettings(settings);
      return { settings };
    });
  },

  setTheme: (theme) => {
    set((s) => {
      const settings = { ...s.settings, theme };
      storage.setSettings(settings);
      return { settings };
    });
  },

  setFontSize: (fontSize) => {
    set((s) => {
      const settings = { ...s.settings, fontSize };
      storage.setSettings(settings);
      return { settings };
    });
  },

  updateProgress: (partial) => {
    set((s) => {
      const progress = { ...s.progress, ...partial };
      storage.setProgress(progress);
      return { progress };
    });
  },

  recordReading: (surah, ayah) => {
    const { progress } = get();
    const today = new Date().toISOString().split("T")[0];

    if (progress.lastReadDate === today) {
      const updated = { ...progress, lastReadSurah: surah, lastReadAyah: ayah };
      storage.setProgress(updated);
      set({ progress: updated });
      return;
    }

    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const isConsecutive = progress.lastReadDate === yesterday;
    const newStreak = isConsecutive ? progress.currentStreak + 1 : 1;

    const updated: UserProgress = {
      ...progress,
      lastReadDate: today,
      lastReadSurah: surah,
      lastReadAyah: ayah,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
    };
    storage.setProgress(updated);
    set({ progress: updated });
  },

  setAudioPlaying: (playing, ayah = null) => {
    set({ audioPlaying: playing, currentAudioAyah: ayah });
  },
}));
```

**Step 3: Commit**

```bash
git add noor-mobile/lib/ noor-mobile/store/
git commit -m "feat(noor-mobile): port Zustand store with MMKV persistence"
```

---

### Task 6: Bundle Fonts + Quran Data

**Files:**
- Create: `noor-mobile/assets/fonts/` (6 font files)
- Create: `noor-mobile/assets/data/` (copy from web project)

**Step 1: Download and bundle Amiri font**

Run:
```bash
mkdir -p /Users/varunmoka/GTC/Safwan/noor-mobile/assets/fonts
cd /Users/varunmoka/GTC/Safwan/noor-mobile/assets/fonts
curl -L -o Amiri-Regular.ttf "https://github.com/google/fonts/raw/main/ofl/amiri/Amiri-Regular.ttf"
curl -L -o Amiri-Bold.ttf "https://github.com/google/fonts/raw/main/ofl/amiri/Amiri-Bold.ttf"
```

**Step 2: Download and bundle Inter font**

Run:
```bash
cd /Users/varunmoka/GTC/Safwan/noor-mobile/assets/fonts
curl -L -o Inter-Regular.ttf "https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.ttf"
curl -L -o Inter-Medium.ttf "https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Medium.ttf"
curl -L -o Inter-SemiBold.ttf "https://github.com/rsms/inter/raw/master/docs/font-files/Inter-SemiBold.ttf"
curl -L -o Inter-Bold.ttf "https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.ttf"
```

**Step 3: Copy Quran data from web project**

Run:
```bash
mkdir -p /Users/varunmoka/GTC/Safwan/noor-mobile/assets/data
cp -r /Users/varunmoka/GTC/Safwan/noor/public/data/* /Users/varunmoka/GTC/Safwan/noor-mobile/assets/data/
```

**Step 4: Copy surah context data**

Run:
```bash
cp /Users/varunmoka/GTC/Safwan/noor/src/data/surah-context.ts /Users/varunmoka/GTC/Safwan/noor-mobile/data/surah-context.ts
```

**Step 5: Commit**

```bash
git add noor-mobile/assets/ noor-mobile/data/
git commit -m "feat(noor-mobile): bundle Amiri + Inter fonts and Quran data"
```

---

### Task 7: Data Hooks

**Files:**
- Create: `noor-mobile/hooks/useQuranData.ts`
- Create: `noor-mobile/hooks/useAudioPlayer.ts`

**Step 1: Create Quran data hook (reads from bundled JSON)**

Create `noor-mobile/hooks/useQuranData.ts`:
```typescript
import { useQuery } from "@tanstack/react-query";
import type { SurahMeta, Surah } from "../types";

// Import bundled JSON directly
import surahIndex from "../assets/data/surah-index.json";

export function useSurahList() {
  return useQuery<SurahMeta[]>({
    queryKey: ["surah-list"],
    queryFn: () => surahIndex as SurahMeta[],
    staleTime: Infinity,
  });
}

export function useSurah(id: number) {
  return useQuery<Surah>({
    queryKey: ["surah", id],
    queryFn: async () => {
      const padded = String(id).padStart(3, "0");
      // Dynamic require for bundled JSON
      const data = await import(`../assets/data/surahs/${padded}.json`);
      return data.default as Surah;
    },
    enabled: id > 0 && id <= 114,
    staleTime: Infinity,
  });
}
```

Note: If dynamic import doesn't work with Metro, fallback to a generated index file that maps surah IDs to `require()` calls. The implementing agent should test and adjust.

**Step 2: Create audio player hook**

Create `noor-mobile/hooks/useAudioPlayer.ts`:
```typescript
import { useRef, useCallback } from "react";
import { Audio } from "expo-av";
import { useAppStore } from "../store/useAppStore";

export function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const setAudioPlaying = useAppStore((s) => s.setAudioPlaying);

  const play = useCallback(async (url: string, ayahNumber: number) => {
    // Stop any current playback
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );
    soundRef.current = sound;
    setAudioPlaying(true, ayahNumber);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setAudioPlaying(false);
      }
    });
  }, [setAudioPlaying]);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setAudioPlaying(false);
  }, [setAudioPlaying]);

  const pause = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
    }
  }, []);

  const resume = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
    }
  }, []);

  return { play, stop, pause, resume };
}
```

**Step 3: Commit**

```bash
git add noor-mobile/hooks/
git commit -m "feat(noor-mobile): add Quran data hook and audio player hook"
```

---

## Wave 2: Ornaments + Primitives (Issues #1, #2, #3)

### Task 8: SVG Islamic Ornaments (Issue #1)

**Files:**
- Create: `noor-mobile/components/ornaments/Crescent.tsx`
- Create: `noor-mobile/components/ornaments/StarOrnament.tsx`
- Create: `noor-mobile/components/ornaments/FlowerOrnament.tsx`
- Create: `noor-mobile/components/ornaments/OrnamentalDivider.tsx`
- Create: `noor-mobile/components/ornaments/index.ts`

**Step 1: Create Crescent SVG component**

Create `noor-mobile/components/ornaments/Crescent.tsx`:
```typescript
import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
  opacity?: number;
}

export function Crescent({ size = 48, color = "#D4A843", opacity = 0.2 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" opacity={opacity}>
      <Path
        d="M24 4C13 4 4 13 4 24s9 20 20 20c-7.7 0-14-6.3-14-14S16.3 16 24 16c3.3 0 6.3 1.1 8.7 3C30.3 11.3 24 4 24 4z"
        fill={color}
      />
      <Path
        d="M36 12l1.5 3 3.5.5-2.5 2.5.5 3.5L36 20l-3 1.5.5-3.5L31 15.5l3.5-.5z"
        fill={color}
        opacity={0.7}
      />
    </Svg>
  );
}
```

**Step 2: Create Star Ornament (8-pointed Islamic star)**

Create `noor-mobile/components/ornaments/StarOrnament.tsx`:
```typescript
import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
  opacity?: number;
}

export function StarOrnament({ size = 16, color = "#D4A843", opacity = 0.5 }: Props) {
  // 8-pointed star (Rub el Hizb)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
      <Path
        d="M12 0l3 9h9l-7.5 5.5 3 9L12 18l-7.5 5.5 3-9L0 9h9z"
        fill={color}
      />
    </Svg>
  );
}
```

**Step 3: Create Flower Ornament (arabesque rosette)**

Create `noor-mobile/components/ornaments/FlowerOrnament.tsx`:
```typescript
import Svg, { Circle, Path, G } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
  opacity?: number;
}

export function FlowerOrnament({ size = 20, color = "#D4A843", opacity = 0.3 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
      <G transform="translate(12,12)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <Path
            key={angle}
            d="M0,-8 C3,-6 3,-2 0,0 C-3,-2 -3,-6 0,-8"
            fill={color}
            transform={`rotate(${angle})`}
          />
        ))}
        <Circle r={2.5} fill={color} />
      </G>
    </Svg>
  );
}
```

**Step 4: Create Ornamental Divider**

Create `noor-mobile/components/ornaments/OrnamentalDivider.tsx`:
```typescript
import { View } from "react-native";
import { StarOrnament } from "./StarOrnament";
import { useTheme } from "../../theme/ThemeProvider";

interface Props {
  width?: "full" | "compact";
}

export function OrnamentalDivider({ width = "full" }: Props) {
  const { colors } = useTheme();
  const lineWidth = width === "full" ? "flex-1" : "w-12";

  return (
    <View className="flex-row items-center justify-center gap-3 my-4">
      <View
        className={`h-px ${lineWidth}`}
        style={{ backgroundColor: colors.border }}
      />
      <StarOrnament size={12} color={colors.accent} opacity={0.5} />
      <View
        className={`h-px ${lineWidth}`}
        style={{ backgroundColor: colors.border }}
      />
    </View>
  );
}
```

**Step 5: Create barrel export**

Create `noor-mobile/components/ornaments/index.ts`:
```typescript
export { Crescent } from "./Crescent";
export { StarOrnament } from "./StarOrnament";
export { FlowerOrnament } from "./FlowerOrnament";
export { OrnamentalDivider } from "./OrnamentalDivider";
```

**Step 6: Commit**

```bash
git add noor-mobile/components/ornaments/
git commit -m "feat(noor-mobile): add SVG Islamic ornament components"
```

---

### Task 9: ArabicText Accessible Wrapper (Issue #2)

**Files:**
- Create: `noor-mobile/components/ui/ArabicText.tsx`

**Step 1: Create ArabicText component**

Create `noor-mobile/components/ui/ArabicText.tsx`:
```typescript
import { Text, type TextProps, type TextStyle } from "react-native";
import { fonts, fontSizes } from "../../theme/typography";
import { useAppStore } from "../../store/useAppStore";

interface Props extends Omit<TextProps, "style"> {
  children: string;
  variant?: "body" | "heading" | "display";
  bold?: boolean;
  decorative?: boolean;
  style?: TextStyle;
}

export function ArabicText({
  children,
  variant = "body",
  bold = false,
  decorative = false,
  style,
  ...rest
}: Props) {
  const fontSize = useAppStore((s) => s.settings.fontSize);

  const sizeValue =
    variant === "display"
      ? fontSizes[fontSize].arabic * 1.5
      : variant === "heading"
        ? fontSizes[fontSize].arabic * 1.2
        : fontSizes[fontSize].arabic;

  return (
    <Text
      style={[
        {
          fontFamily: bold ? fonts.arabic.bold : fonts.arabic.regular,
          fontSize: sizeValue,
          writingDirection: "rtl",
          textAlign: "right",
          lineHeight: sizeValue * 2.2,
        },
        style,
      ]}
      // Accessibility
      accessibilityLanguage="ar"
      accessibilityRole={decorative ? "none" : "text"}
      importantForAccessibility={decorative ? "no" : "yes"}
      accessible={!decorative}
      {...rest}
    >
      {children}
    </Text>
  );
}
```

**Step 2: Commit**

```bash
git add noor-mobile/components/ui/
git commit -m "feat(noor-mobile): add ArabicText accessible wrapper component"
```

---

### Task 10: GoldShimmer Scoped Component (Issue #3)

**Files:**
- Create: `noor-mobile/components/ui/GoldShimmer.tsx`

**Step 1: Create scoped shimmer component**

Create `noor-mobile/components/ui/GoldShimmer.tsx`:
```typescript
import { useEffect } from "react";
import { View, type ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../../theme/ThemeProvider";

interface Props extends ViewProps {
  children: React.ReactNode;
  /** Set to true on reading screens to disable shimmer */
  isReadingContext?: boolean;
}

export function GoldShimmer({
  children,
  isReadingContext = false,
  style,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    if (isReadingContext) return; // No animation on reading screens
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [isReadingContext, shimmerPosition]);

  const animatedStyle = useAnimatedStyle(() => {
    if (isReadingContext) {
      return { opacity: 1 }; // Static gold, no shimmer
    }
    return {
      opacity: 0.7 + shimmerPosition.value * 0.3,
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]} {...rest}>
      {children}
    </Animated.View>
  );
}
```

**Step 2: Commit**

```bash
git add noor-mobile/components/ui/GoldShimmer.tsx
git commit -m "feat(noor-mobile): add GoldShimmer with reading-context scope"
```

---

## Wave 3: Core Screens

### Task 11: Root Layout + Font Loading + Tab Navigator

**Files:**
- Create: `noor-mobile/app/_layout.tsx`
- Create: `noor-mobile/app/(tabs)/_layout.tsx`

**Step 1: Create root layout with font loading**

Create `noor-mobile/app/_layout.tsx`:
```typescript
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootInner() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="surah/[id]" options={{ animation: "slide_from_right" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Amiri-Regular": require("../assets/fonts/Amiri-Regular.ttf"),
    "Amiri-Bold": require("../assets/fonts/Amiri-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RootInner />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

**Step 2: Create tab navigator**

Create `noor-mobile/app/(tabs)/_layout.tsx`:
```typescript
import { Tabs } from "expo-router";
import { useTheme } from "../../theme/ThemeProvider";
import { fonts } from "../../theme/typography";

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.latin.medium,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: () => null }} />
      <Tabs.Screen name="surahs" options={{ title: "Quran", tabBarIcon: () => null }} />
      <Tabs.Screen name="progress" options={{ title: "Journey", tabBarIcon: () => null }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: () => null }} />
    </Tabs>
  );
}
```

Note: Tab icons should use `@expo/vector-icons` or custom SVGs. The implementing agent should add appropriate icons (Book, Compass, BarChart, Settings).

**Step 3: Commit**

```bash
git add noor-mobile/app/
git commit -m "feat(noor-mobile): add root layout with fonts and tab navigator"
```

---

### Task 12: Home Page

**Files:**
- Create: `noor-mobile/app/(tabs)/index.tsx`
- Create: `noor-mobile/components/IslamicGreeting.tsx`
- Create: `noor-mobile/components/StreakCounter.tsx`
- Create: `noor-mobile/components/DailyAyah.tsx`
- Create: `noor-mobile/components/ContinueReading.tsx`
- Create: `noor-mobile/components/QuickDua.tsx`

**Implementation note:** Port each component from the web version, replacing:
- `<div>` → `<View>`
- `<p>`/`<span>` → `<Text>`
- `<Link to=...>` → `<Link href=...>` (expo-router)
- Tailwind classes via NativeWind `className`
- All Arabic text wrapped in `<ArabicText>` component (Issue #2)
- All `☪` replaced with `<Crescent />`, all `✦` with `<StarOrnament />`, all `❋` with `<FlowerOrnament />` (Issue #1)
- Kaaba gradient hero → `LinearGradient` from `expo-linear-gradient`

Each component should follow the web version's structure. The implementing agent should reference the web source files in `noor/src/components/` and `noor/src/pages/HomePage.tsx`.

**Commit after all home components are working:**

```bash
git add noor-mobile/app/\(tabs\)/index.tsx noor-mobile/components/
git commit -m "feat(noor-mobile): build Home page with Islamic ornaments"
```

---

### Task 13: Surah Index Page

**Files:**
- Create: `noor-mobile/app/(tabs)/surahs.tsx`
- Create: `noor-mobile/components/SurahCard.tsx`
- Create: `noor-mobile/components/SearchBar.tsx`

**Implementation note:** Port from `noor/src/pages/SurahIndexPage.tsx`:
- Use `FlatList` for performant scrolling of 114 surahs
- Use `<ArabicText decorative>` for background Arabic decoration
- Search + filter (all/meccan/medinan) using local state
- `SurahCard` links to `/surah/[id]` via expo-router
- Replace `✦` dividers with `<StarOrnament />`

**Commit:**

```bash
git add noor-mobile/app/\(tabs\)/surahs.tsx noor-mobile/components/SurahCard.tsx noor-mobile/components/SearchBar.tsx
git commit -m "feat(noor-mobile): build Surah Index with search and filters"
```

---

### Task 14: Reading View — Serene Mode (Issue #5 partial)

**Files:**
- Create: `noor-mobile/app/surah/[id].tsx`
- Create: `noor-mobile/components/SurahHeader.tsx`
- Create: `noor-mobile/components/SurahContextCard.tsx`
- Create: `noor-mobile/components/AyahCard.tsx`

**Implementation note:** Port from `noor/src/pages/ReadingPage.tsx`:
- Use `FlatList` with `AyahCard` items for performance
- All Arabic ayah text via `<ArabicText>` with `lang="ar"` accessibility (Issue #2)
- No `GoldShimmer` animation on this page (Issue #3)
- `SurahHeader` uses `<Crescent />` and `<StarOrnament />` instead of emojis (Issue #1)
- Audio playback via `useAudioPlayer` hook
- Bookmark toggle via MMKV storage
- Call `recordReading()` on mount
- Serene mode: cream/light bg, maximum whitespace, audio controls hidden until tap

**This is the most complex task.** The implementing agent should:
1. Build `AyahCard` first (audio + bookmark per ayah)
2. Build `SurahHeader` (ornamental header with Bismillah)
3. Build `SurahContextCard` (revelation context)
4. Compose in `[id].tsx` with FlatList
5. Test navigation from Surah Index → Reading View → back

**Commit:**

```bash
git add noor-mobile/app/surah/ noor-mobile/components/SurahHeader.tsx noor-mobile/components/SurahContextCard.tsx noor-mobile/components/AyahCard.tsx
git commit -m "feat(noor-mobile): build Reading View with Serene mode"
```

---

### Task 15: Progress Dashboard

**Files:**
- Create: `noor-mobile/app/(tabs)/progress.tsx`

**Implementation note:** Port from `noor/src/pages/ProgressPage.tsx`:
- Stats grid (streak, longest, completion %, saved ayahs)
- Progress bar with forest → gold gradient
- Saved ayahs list with links to reading view
- Replace `☪` with `<Crescent />`, `✦` with `<StarOrnament />`

**Commit:**

```bash
git add noor-mobile/app/\(tabs\)/progress.tsx
git commit -m "feat(noor-mobile): build Progress Dashboard"
```

---

### Task 16: Settings Page (Issues #4, #5)

**Files:**
- Create: `noor-mobile/app/(tabs)/settings.tsx`

**Implementation note:** Port from `noor/src/pages/SettingsPage.tsx` with additions:
- **Theme selector:** Light / Dark / **High Contrast** (3 options, not 2) — Issue #4
- **UX Mode selector:** Serene / Immersive / Study with descriptions
- **Font size picker:** sm/md/lg/xl with Arabic preview using `<ArabicText>`
- Replace `✦` dividers with `<StarOrnament />`
- Replace Arabic preview emoji with `<ArabicText decorative>`

**Commit:**

```bash
git add noor-mobile/app/\(tabs\)/settings.tsx
git commit -m "feat(noor-mobile): build Settings with high-contrast and UX modes"
```

---

## Wave 4: Audio + UX Modes (Issue #5)

### Task 17: Global Audio Player

**Files:**
- Create: `noor-mobile/components/AudioPlayer.tsx`
- Modify: `noor-mobile/app/_layout.tsx` (add AudioPlayer outside router)

**Implementation note:**
- Persistent mini-player bar above tab nav
- Shows current ayah info, play/pause, progress bar
- Visible when `audioPlaying === true` in store
- Uses `useAudioPlayer` hook
- Supports continuous playback (auto-advance to next ayah)
- Hides in Serene mode unless user explicitly starts playback

**Commit:**

```bash
git add noor-mobile/components/AudioPlayer.tsx noor-mobile/app/_layout.tsx
git commit -m "feat(noor-mobile): add global persistent audio player"
```

---

### Task 18: Immersive Mode (Issue #5)

**Files:**
- Modify: `noor-mobile/app/surah/[id].tsx`
- Modify: `noor-mobile/theme/ThemeProvider.tsx`

**Implementation note:**
- When `uxMode === "immersive"`:
  - Force dark theme (already handled in ThemeProvider)
  - Show persistent audio player prominently
  - Auto-advance to next ayah after recitation completes
  - Larger play/pause controls on AyahCard
  - Subtle Islamic pattern background at low opacity
  - Minimize navigation chrome

**Commit:**

```bash
git add noor-mobile/app/surah/ noor-mobile/theme/
git commit -m "feat(noor-mobile): implement Immersive mode for reading view"
```

---

### Task 19: Study Mode (Issue #5)

**Files:**
- Modify: `noor-mobile/app/surah/[id].tsx`
- Create: `noor-mobile/components/NotesInput.tsx`

**Implementation note:**
- When `uxMode === "study"`:
  - Split layout: Arabic text prominent, translation always visible below
  - Inline bookmark + note input per ayah (saved to MMKV via `Bookmark.note`)
  - "Tafsir" button shows bottom sheet with placeholder "Coming soon"
  - Bookmarks panel accessible via header button

**Commit:**

```bash
git add noor-mobile/app/surah/ noor-mobile/components/NotesInput.tsx
git commit -m "feat(noor-mobile): implement Study mode with notes"
```

---

## Wave 5: Polish

### Task 20: Animations

**Files:**
- Modify: various components

**Implementation note:**
- Page transitions via Stack screen options (already set in Task 11)
- Streak celebration: brief gold shimmer when streak increments (non-reading context)
- Surah completion: subtle congratulatory animation
- Tab transitions: fade between tabs
- All animations respect `AccessibilityInfo.isReduceMotionEnabled`

**Commit:**

```bash
git commit -m "feat(noor-mobile): add polished animations with reduce-motion support"
```

---

### Task 21: Accessibility Audit

**Implementation note:**
- Verify all `<ArabicText>` components have `accessibilityLanguage="ar"`
- Verify touch targets are >= 44pt (check BottomNav icons, bookmark buttons, audio controls)
- Test high-contrast mode: all text passes 7:1 contrast ratio
- Test with VoiceOver (iOS) and TalkBack (Android)
- Verify font size changes apply to all screens

**Commit:**

```bash
git commit -m "fix(noor-mobile): accessibility audit fixes"
```

---

### Task 22: App Icon + Splash Screen

**Files:**
- Create: `noor-mobile/assets/icon.png` (1024x1024)
- Create: `noor-mobile/assets/splash.png` (1284x2778)
- Modify: `noor-mobile/app.json`

**Implementation note:**
- App icon: Gold crescent + star on deep forest green (#1B4332) background
- Splash screen: "نور" in Amiri Bold, gold on forest green, with ornamental divider
- Configure in `app.json` with `splash.backgroundColor: "#1B4332"`

**Commit:**

```bash
git add noor-mobile/assets/ noor-mobile/app.json
git commit -m "feat(noor-mobile): add app icon and splash screen"
```

---

### Task 23: Build and Test

**Step 1: Build for iOS**

Run:
```bash
cd /Users/varunmoka/GTC/Safwan/noor-mobile
npx expo run:ios
```

**Step 2: Build for Android**

Run:
```bash
npx expo run:android
```

**Step 3: Test checklist**
- [ ] All 4 tabs navigate correctly
- [ ] Surah Index → Reading View → back flow works
- [ ] Audio plays per ayah
- [ ] Streak increments on reading
- [ ] Bookmarks persist across app restarts
- [ ] Light/Dark/High Contrast themes switch correctly
- [ ] Serene/Immersive/Study modes change reading layout
- [ ] Arabic text renders correctly with tashkeel
- [ ] Font size setting applies everywhere
- [ ] All SVG ornaments render (no Unicode emoji fallbacks)

**Final commit:**

```bash
git commit -m "chore(noor-mobile): verify builds on iOS and Android"
```
