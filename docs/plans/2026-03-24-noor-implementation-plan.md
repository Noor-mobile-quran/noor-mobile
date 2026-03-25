# Noor — Quran Content Hub Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a responsive Quran content hub web app with Arabic text, translations, tafsir, audio recitation, and daily engagement hooks (streaks, progress, daily ayah).

**Architecture:** Fully client-side SPA — Vite + React + TypeScript + Tailwind CSS. All Quran data bundled as local JSON. User state in localStorage + IndexedDB. No backend.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS 4, React Router v7, Zustand, TanStack Query, idb-keyval, Framer Motion

---

## Task 1: Scaffold Vite + React + TypeScript Project

**Files:**
- Create: `noor/` project directory via Vite CLI
- Modify: `noor/tsconfig.json` (enable strict mode)
- Modify: `noor/.gitignore`

**Step 1: Create project**

```bash
cd /Users/varunmoka/GTC/Safwan
npm create vite@latest noor -- --template react-ts
cd noor
npm install
```

**Step 2: Enable strict TypeScript**

In `tsconfig.json`, ensure:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Step 3: Verify dev server runs**

```bash
cd /Users/varunmoka/GTC/Safwan/noor
npm run dev
```
Expected: Dev server starts at localhost:5173

**Step 4: Verify production build**

```bash
npm run build
```
Expected: Build completes, `dist/` created

**Step 5: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React + TypeScript project"
```

---

## Task 2: Install and Configure Tailwind CSS + Core Dependencies

**Files:**
- Modify: `noor/package.json`
- Create: `noor/src/index.css` (Tailwind directives + CSS custom properties)
- Modify: `noor/tailwind.config.ts`

**Step 1: Install all core dependencies**

```bash
cd /Users/varunmoka/GTC/Safwan/noor
npm install tailwindcss @tailwindcss/vite react-router-dom zustand @tanstack/react-query idb-keyval framer-motion
```

**Step 2: Configure Tailwind with Noor design tokens**

Create/update `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
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
        arabic: ["Amiri", "serif"],
        latin: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

**Step 3: Set up CSS with design tokens**

Update `src/index.css`:
```css
@import "tailwindcss";

@import url("https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&display=swap");

:root {
  --color-bg: #FFF9ED;
  --color-surface: #FFF3D6;
  --color-text-primary: #2D261C;
  --color-text-secondary: #6B5B45;
  --color-accent: #D4A843;
}

.dark {
  --color-bg: #1A1410;
  --color-surface: #2D261C;
  --color-text-primary: #FFF9ED;
  --color-text-secondary: #D4B896;
  --color-accent: #E8C547;
}

body {
  font-family: "Inter", sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}
```

**Step 4: Verify Tailwind works**

Update `src/App.tsx` to use a Tailwind class:
```tsx
function App() {
  return <h1 className="text-3xl font-bold text-gold-500">Noor</h1>;
}
export default App;
```

Run: `npm run dev` — verify gold text renders.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: configure Tailwind CSS with Noor design tokens and install core deps"
```

---

## Task 3: Set Up Folder Structure, Routing, and Layout Shell

**Files:**
- Create: `src/pages/HomePage.tsx`, `src/pages/SurahIndexPage.tsx`, `src/pages/ReadingPage.tsx`, `src/pages/ProgressPage.tsx`, `src/pages/SettingsPage.tsx`
- Create: `src/components/Layout.tsx`
- Create: `src/components/BottomNav.tsx`
- Modify: `src/App.tsx`
- Create: `src/types/index.ts`

**Step 1: Create folder structure**

```bash
cd /Users/varunmoka/GTC/Safwan/noor/src
mkdir -p components pages hooks store lib types data
```

**Step 2: Create TypeScript types**

`src/types/index.ts`:
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

export interface UserSettings {
  theme: "light" | "dark" | "auto";
  uxMode: UXMode;
  translationLang: string;
  reciterId: string;
  fontSize: "sm" | "md" | "lg" | "xl";
}
```

**Step 3: Create placeholder pages**

Each page follows this pattern (example for HomePage):

`src/pages/HomePage.tsx`:
```tsx
export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold font-arabic">بسم الله الرحمن الرحيم</h1>
      <p className="text-sand-500 mt-2">Welcome to Noor</p>
    </div>
  );
}
```

Create similar stubs for: `SurahIndexPage`, `ReadingPage`, `ProgressPage`, `SettingsPage`.

**Step 4: Create Layout with BottomNav**

`src/components/Layout.tsx`:
```tsx
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <main className="pb-20 max-w-3xl mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
```

`src/components/BottomNav.tsx`:
```tsx
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/surahs", label: "Surahs", icon: "📖" },
  { to: "/progress", label: "Progress", icon: "📊" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-cream-300 dark:border-earth-800">
      <div className="flex justify-around items-center h-16 max-w-3xl mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs ${
                isActive ? "text-gold-500 font-semibold" : "text-sand-500"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
```

**Step 5: Wire up routing in App.tsx**

`src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SurahIndexPage from "./pages/SurahIndexPage";
import ReadingPage from "./pages/ReadingPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/surahs" element={<SurahIndexPage />} />
            <Route path="/surah/:id" element={<ReadingPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<div className="p-6">Page not found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

**Step 6: Verify routing works**

Run `npm run dev`, navigate to each route, confirm pages render with bottom nav.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: set up routing, layout shell, types, and folder structure"
```

---

## Task 4: Create Zustand Store and Persistence Layer

**Files:**
- Create: `src/store/useAppStore.ts`
- Create: `src/lib/storage.ts`

**Step 1: Create storage utility**

`src/lib/storage.ts`:
```typescript
import { get, set, del } from "idb-keyval";
import type { Bookmark, UserProgress } from "../types";

// localStorage helpers (small, frequent reads)
export const storage = {
  getSettings: () => JSON.parse(localStorage.getItem("noor-settings") || "null"),
  setSettings: (s: unknown) => localStorage.setItem("noor-settings", JSON.stringify(s)),
  getProgress: (): UserProgress | null => JSON.parse(localStorage.getItem("noor-progress") || "null"),
  setProgress: (p: UserProgress) => localStorage.setItem("noor-progress", JSON.stringify(p)),
};

// IndexedDB helpers (larger data)
export const idb = {
  getBookmarks: () => get<Bookmark[]>("bookmarks").then((b) => b ?? []),
  setBookmarks: (b: Bookmark[]) => set("bookmarks", b),
  addBookmark: async (bm: Bookmark) => {
    const existing = await idb.getBookmarks();
    await set("bookmarks", [...existing, bm]);
  },
  removeBookmark: async (surah: number, ayah: number) => {
    const existing = await idb.getBookmarks();
    await set("bookmarks", existing.filter((b) => b.surah !== surah || b.ayah !== ayah));
  },
};
```

**Step 2: Create Zustand store**

`src/store/useAppStore.ts`:
```typescript
import { create } from "zustand";
import type { UXMode, UserProgress, UserSettings } from "../types";
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
  setTheme: (theme: UserSettings["theme"]) => void;
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
    const isNewDay = progress.lastReadDate !== today;
    const newStreak = isNewDay ? progress.currentStreak + 1 : progress.currentStreak;

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

**Step 3: Verify store works**

In `HomePage.tsx`, temporarily add:
```tsx
import { useAppStore } from "../store/useAppStore";
// inside component:
const { settings, progress } = useAppStore();
console.log(settings, progress);
```

Run dev server, check console for default values.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Zustand store with persisted settings and progress"
```

---

## Task 5: Source and Bundle Quran JSON Data

**Files:**
- Create: `public/data/surah-index.json`
- Create: `public/data/surahs/001.json` through `114.json`
- Create: `src/lib/quran.ts` (data fetching utilities)
- Create: `src/hooks/useQuranData.ts`

**Step 1: Create a data preparation script**

`scripts/prepare-quran-data.ts` (run with `npx tsx`):

This task requires sourcing Quran data. Use the Al-Quran Cloud API (`https://api.alquran.cloud/v1/`) to fetch and save locally:

```bash
# Fetch surah list
curl -s "https://api.alquran.cloud/v1/surah" > /tmp/surah-list.json

# For each surah, fetch Arabic text + English translation
# Process and save as per-surah JSON files to public/data/surahs/
```

Write a Node script that:
1. Fetches all 114 surahs from the API
2. Transforms into our TypeScript interfaces
3. Saves per-surah JSON files to `public/data/surahs/NNN.json`
4. Saves index file to `public/data/surah-index.json`

**Step 2: Create data access hooks**

`src/hooks/useQuranData.ts`:
```typescript
import { useQuery } from "@tanstack/react-query";
import type { SurahMeta, Surah } from "../types";

export function useSurahList() {
  return useQuery<SurahMeta[]>({
    queryKey: ["surah-index"],
    queryFn: () => fetch("/data/surah-index.json").then((r) => r.json()),
    staleTime: Infinity,
  });
}

export function useSurah(id: number) {
  return useQuery<Surah>({
    queryKey: ["surah", id],
    queryFn: () =>
      fetch(`/data/surahs/${String(id).padStart(3, "0")}.json`).then((r) => r.json()),
    staleTime: Infinity,
    enabled: id > 0 && id <= 114,
  });
}
```

**Step 3: Verify data loads**

In SurahIndexPage, use `useSurahList()` and log the result.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: source Quran data and create data access hooks"
```

---

## Task 6: Build Surah Index Page

**Files:**
- Modify: `src/pages/SurahIndexPage.tsx`
- Create: `src/components/SurahCard.tsx`
- Create: `src/components/SearchBar.tsx`

**Step 1: Build SurahCard component**

`src/components/SurahCard.tsx`:
```tsx
import { Link } from "react-router-dom";
import type { SurahMeta } from "../types";

export default function SurahCard({ surah }: { surah: SurahMeta }) {
  return (
    <Link
      to={`/surah/${surah.number}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface)] hover:ring-2 hover:ring-gold-500/30 transition-all"
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gold-500/10 text-gold-500 font-semibold text-sm">
        {surah.number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-semibold truncate">{surah.name_english}</p>
          <p className="font-arabic text-xl text-right" dir="rtl">{surah.name_arabic}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-sand-500">
          <span>{surah.name_translation}</span>
          <span>•</span>
          <span>{surah.ayah_count} ayahs</span>
          <span>•</span>
          <span className={`px-2 py-0.5 rounded-full ${
            surah.revelation_type === "meccan"
              ? "bg-forest-700/10 text-forest-700"
              : "bg-gold-500/10 text-gold-600"
          }`}>
            {surah.revelation_type === "meccan" ? "Meccan" : "Medinan"}
          </span>
        </div>
      </div>
    </Link>
  );
}
```

**Step 2: Build SearchBar**

`src/components/SearchBar.tsx`:
```tsx
import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
      }}
      placeholder="Search surahs..."
      className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-cream-300 dark:border-earth-800 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
    />
  );
}
```

**Step 3: Build SurahIndexPage**

`src/pages/SurahIndexPage.tsx`:
```tsx
import { useState, useMemo } from "react";
import { useSurahList } from "../hooks/useQuranData";
import SurahCard from "../components/SurahCard";
import SearchBar from "../components/SearchBar";

export default function SurahIndexPage() {
  const { data: surahs, isLoading } = useSurahList();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "meccan" | "medinan">("all");

  const filtered = useMemo(() => {
    if (!surahs) return [];
    return surahs.filter((s) => {
      const matchesSearch =
        !search ||
        s.name_english.toLowerCase().includes(search.toLowerCase()) ||
        s.name_arabic.includes(search) ||
        String(s.number).includes(search);
      const matchesFilter = filter === "all" || s.revelation_type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [surahs, search, filter]);

  if (isLoading) return <div className="p-6 text-center text-sand-500">Loading surahs...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Surahs</h1>
      <SearchBar onSearch={setSearch} />
      <div className="flex gap-2">
        {(["all", "meccan", "medinan"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm capitalize ${
              filter === f
                ? "bg-gold-500 text-white"
                : "bg-[var(--color-surface)] text-sand-500"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((s) => (
          <SurahCard key={s.number} surah={s} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sand-500 py-8">No surahs found</p>
        )}
      </div>
    </div>
  );
}
```

**Step 4: Verify** — browse surahs, search, filter.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: build Surah Index page with search and filter"
```

---

## Task 7: Build Reading View Page

**Files:**
- Modify: `src/pages/ReadingPage.tsx`
- Create: `src/components/AyahCard.tsx`
- Create: `src/components/SurahHeader.tsx`

**Step 1: Build SurahHeader**

`src/components/SurahHeader.tsx`:
```tsx
import type { SurahMeta } from "../types";

export default function SurahHeader({ surah }: { surah: SurahMeta }) {
  return (
    <div className="text-center py-8 space-y-2">
      <h1 className="font-arabic text-4xl" dir="rtl">{surah.name_arabic}</h1>
      <p className="text-lg font-semibold">{surah.name_english}</p>
      <p className="text-sm text-sand-500">{surah.name_translation} • {surah.ayah_count} Ayahs</p>
      {surah.number !== 9 && (
        <p className="font-arabic text-2xl text-gold-500 pt-4" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</p>
      )}
    </div>
  );
}
```

**Step 2: Build AyahCard**

`src/components/AyahCard.tsx`:
```tsx
import type { Ayah } from "../types";
import { useAppStore } from "../store/useAppStore";

interface Props {
  ayah: Ayah;
  surahNumber: number;
  isPlaying: boolean;
  onPlay: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
}

export default function AyahCard({ ayah, isPlaying, onPlay, onBookmark, isBookmarked }: Props) {
  const fontSize = useAppStore((s) => s.settings.fontSize);
  const sizeMap = { sm: "text-xl", md: "text-2xl", lg: "text-3xl", xl: "text-4xl" };

  return (
    <div className={`p-5 rounded-xl transition-all ${
      isPlaying ? "bg-gold-500/10 ring-1 ring-gold-500/30" : "bg-[var(--color-surface)]"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-500/10 text-gold-500 text-sm font-semibold">
          {ayah.number_in_surah}
        </span>
        <div className="flex gap-2">
          <button onClick={onPlay} className="p-2 rounded-lg hover:bg-gold-500/10 text-sand-500 hover:text-gold-500">
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={onBookmark} className={`p-2 rounded-lg hover:bg-gold-500/10 ${isBookmarked ? "text-gold-500" : "text-sand-500"}`}>
            {isBookmarked ? "★" : "☆"}
          </button>
        </div>
      </div>
      <p className={`font-arabic ${sizeMap[fontSize]} leading-[2.2] text-right mb-4`} dir="rtl">
        {ayah.text_arabic}
      </p>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        {ayah.text_translation}
      </p>
    </div>
  );
}
```

**Step 3: Build ReadingPage**

`src/pages/ReadingPage.tsx`:
```tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSurah } from "../hooks/useQuranData";
import { useAppStore } from "../store/useAppStore";
import { idb } from "../lib/storage";
import SurahHeader from "../components/SurahHeader";
import AyahCard from "../components/AyahCard";
import type { Bookmark } from "../types";

export default function ReadingPage() {
  const { id } = useParams();
  const surahNum = Number(id);
  const { data: surah, isLoading, error } = useSurah(surahNum);
  const { recordReading, currentAudioAyah, audioPlaying } = useAppStore();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [audio] = useState(() => new Audio());

  useEffect(() => {
    idb.getBookmarks().then(setBookmarks);
  }, []);

  useEffect(() => {
    if (surah) recordReading(surahNum, 1);
  }, [surahNum]);

  if (isLoading) return <div className="p-6 text-center text-sand-500">Loading...</div>;
  if (error || !surah) return <div className="p-6 text-center text-red-500">Surah not found</div>;

  const isBookmarked = (ayahNum: number) =>
    bookmarks.some((b) => b.surah === surahNum && b.ayah === ayahNum);

  const toggleBookmark = async (ayahNum: number) => {
    if (isBookmarked(ayahNum)) {
      await idb.removeBookmark(surahNum, ayahNum);
    } else {
      await idb.addBookmark({ surah: surahNum, ayah: ayahNum, timestamp: Date.now() });
    }
    setBookmarks(await idb.getBookmarks());
  };

  const playAyah = (ayah: typeof surah.ayahs[0]) => {
    if (ayah.audio_url) {
      audio.src = ayah.audio_url;
      audio.play();
      useAppStore.getState().setAudioPlaying(true, ayah.number_in_surah);
      audio.onended = () => useAppStore.getState().setAudioPlaying(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <SurahHeader surah={surah} />
      <div className="space-y-3">
        {surah.ayahs.map((ayah) => (
          <AyahCard
            key={ayah.number_in_surah}
            ayah={ayah}
            surahNumber={surahNum}
            isPlaying={audioPlaying && currentAudioAyah === ayah.number_in_surah}
            onPlay={() => playAyah(ayah)}
            onBookmark={() => toggleBookmark(ayah.number_in_surah)}
            isBookmarked={isBookmarked(ayah.number_in_surah)}
          />
        ))}
      </div>
      <div className="flex justify-between pt-4">
        {surahNum > 1 && <Link to={`/surah/${surahNum - 1}`} className="text-gold-500">← Previous Surah</Link>}
        <div />
        {surahNum < 114 && <Link to={`/surah/${surahNum + 1}`} className="text-gold-500">Next Surah →</Link>}
      </div>
    </div>
  );
}
```

**Step 4: Verify** — navigate from index to reading view, check Arabic text renders RTL.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: build Reading View with ayah cards, audio, and bookmarks"
```

---

## Task 8: Build Home Page with Engagement Hooks

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Create: `src/components/DailyAyah.tsx`
- Create: `src/components/StreakCounter.tsx`
- Create: `src/components/ContinueReading.tsx`

**Step 1: Build StreakCounter**

`src/components/StreakCounter.tsx`:
```tsx
import { useAppStore } from "../store/useAppStore";

export default function StreakCounter() {
  const { currentStreak, longestStreak } = useAppStore((s) => s.progress);

  return (
    <div className="p-5 rounded-xl bg-[var(--color-surface)] text-center">
      <p className="text-4xl font-bold text-gold-500">{currentStreak}</p>
      <p className="text-sm text-sand-500 mt-1">Day Streak 🔥</p>
      <p className="text-xs text-sand-400 mt-2">Longest: {longestStreak} days</p>
    </div>
  );
}
```

**Step 2: Build DailyAyah**

`src/components/DailyAyah.tsx`:
```tsx
import { useSurah } from "../hooks/useQuranData";
import { Link } from "react-router-dom";

export default function DailyAyah() {
  // Deterministic daily ayah based on date
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const surahNum = (dayOfYear % 114) + 1;
  const { data: surah } = useSurah(surahNum);

  if (!surah) return null;
  const ayah = surah.ayahs[dayOfYear % surah.ayahs.length];

  return (
    <Link to={`/surah/${surahNum}`} className="block p-6 rounded-xl bg-forest-700 text-cream-100">
      <p className="text-xs text-cream-300 uppercase tracking-wide mb-3">Ayah of the Day</p>
      <p className="font-arabic text-2xl leading-[2] text-right" dir="rtl">{ayah.text_arabic}</p>
      <p className="text-sm text-cream-200 mt-3 leading-relaxed">{ayah.text_translation}</p>
      <p className="text-xs text-cream-300 mt-3">— {surah.name_english} {ayah.number_in_surah}</p>
    </Link>
  );
}
```

**Step 3: Build ContinueReading**

`src/components/ContinueReading.tsx`:
```tsx
import { useAppStore } from "../store/useAppStore";
import { useSurahList } from "../hooks/useQuranData";
import { Link } from "react-router-dom";

export default function ContinueReading() {
  const { lastReadSurah, lastReadAyah } = useAppStore((s) => s.progress);
  const { data: surahs } = useSurahList();

  if (!lastReadSurah || !surahs) return null;
  const surah = surahs.find((s) => s.number === lastReadSurah);
  if (!surah) return null;

  return (
    <Link to={`/surah/${lastReadSurah}`} className="block p-5 rounded-xl bg-[var(--color-surface)]">
      <p className="text-xs text-sand-400 uppercase tracking-wide">Continue Reading</p>
      <p className="font-semibold mt-1">{surah.name_english}</p>
      <p className="text-sm text-sand-500">Ayah {lastReadAyah}</p>
    </Link>
  );
}
```

**Step 4: Assemble HomePage**

`src/pages/HomePage.tsx`:
```tsx
import DailyAyah from "../components/DailyAyah";
import StreakCounter from "../components/StreakCounter";
import ContinueReading from "../components/ContinueReading";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-gold-500">Noor</h1>
        <p className="text-sm text-sand-500 mt-1">Your Daily Quran Companion</p>
      </div>
      <StreakCounter />
      <DailyAyah />
      <ContinueReading />
      <Link to="/surahs" className="block text-center p-4 rounded-xl bg-gold-500 text-white font-semibold">
        Browse All Surahs →
      </Link>
    </div>
  );
}
```

**Step 5: Verify** — home page shows streak, daily ayah, continue reading.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: build Home page with streak counter, daily ayah, and continue reading"
```

---

## Task 9: Build Progress Dashboard

**Files:**
- Modify: `src/pages/ProgressPage.tsx`

**Step 1: Build ProgressPage**

`src/pages/ProgressPage.tsx`:
```tsx
import { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { useSurahList } from "../hooks/useQuranData";
import { idb } from "../lib/storage";
import { Link } from "react-router-dom";
import type { Bookmark } from "../types";

export default function ProgressPage() {
  const progress = useAppStore((s) => s.progress);
  const { data: surahs } = useSurahList();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    idb.getBookmarks().then(setBookmarks);
  }, []);

  const completionPct = surahs
    ? Math.round((progress.completedSurahs.length / 114) * 100)
    : 0;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Your Progress</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-[var(--color-surface)] text-center">
          <p className="text-3xl font-bold text-gold-500">{progress.currentStreak}</p>
          <p className="text-xs text-sand-500">Current Streak</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--color-surface)] text-center">
          <p className="text-3xl font-bold text-gold-500">{progress.longestStreak}</p>
          <p className="text-xs text-sand-500">Longest Streak</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--color-surface)] text-center">
          <p className="text-3xl font-bold text-gold-500">{completionPct}%</p>
          <p className="text-xs text-sand-500">Quran Completed</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--color-surface)] text-center">
          <p className="text-3xl font-bold text-gold-500">{bookmarks.length}</p>
          <p className="text-xs text-sand-500">Bookmarks</p>
        </div>
      </div>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Bookmarks</h2>
          <div className="space-y-2">
            {bookmarks.map((b, i) => {
              const surah = surahs?.find((s) => s.number === b.surah);
              return (
                <Link key={i} to={`/surah/${b.surah}`}
                  className="block p-3 rounded-xl bg-[var(--color-surface)] flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{surah?.name_english ?? `Surah ${b.surah}`}</p>
                    <p className="text-xs text-sand-500">Ayah {b.ayah}</p>
                  </div>
                  <span className="text-gold-500">★</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify** — check stats render, bookmarks appear.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: build Progress Dashboard with stats and bookmarks"
```

---

## Task 10: Build Settings Page

**Files:**
- Modify: `src/pages/SettingsPage.tsx`

**Step 1: Build SettingsPage**

`src/pages/SettingsPage.tsx`:
```tsx
import { useAppStore } from "../store/useAppStore";

export default function SettingsPage() {
  const { settings, setTheme, setFontSize, setUXMode } = useAppStore();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Theme */}
      <div>
        <h2 className="text-sm font-semibold text-sand-500 uppercase tracking-wide mb-2">Theme</h2>
        <div className="flex gap-2">
          {(["light", "dark"] as const).map((t) => (
            <button key={t} onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-xl capitalize ${
                settings.theme === t ? "bg-gold-500 text-white" : "bg-[var(--color-surface)] text-sand-500"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* UX Mode */}
      <div>
        <h2 className="text-sm font-semibold text-sand-500 uppercase tracking-wide mb-2">Reading Mode</h2>
        <div className="flex gap-2">
          {(["serene", "immersive", "study"] as const).map((m) => (
            <button key={m} onClick={() => setUXMode(m)}
              className={`px-4 py-2 rounded-xl capitalize ${
                settings.uxMode === m ? "bg-gold-500 text-white" : "bg-[var(--color-surface)] text-sand-500"
              }`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <h2 className="text-sm font-semibold text-sand-500 uppercase tracking-wide mb-2">Arabic Font Size</h2>
        <div className="flex gap-2">
          {(["sm", "md", "lg", "xl"] as const).map((s) => (
            <button key={s} onClick={() => setFontSize(s)}
              className={`px-4 py-2 rounded-xl uppercase ${
                settings.fontSize === s ? "bg-gold-500 text-white" : "bg-[var(--color-surface)] text-sand-500"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 text-center text-xs text-sand-400">
        Noor v1.0 • Built with ❤️
      </div>
    </div>
  );
}
```

**Step 2: Wire theme to document class**

In `src/App.tsx`, add theme effect:
```tsx
import { useAppStore } from "./store/useAppStore";
import { useEffect } from "react";

// Inside App component, before return:
const theme = useAppStore((s) => s.settings.theme);
useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark");
}, [theme]);
```

**Step 3: Verify** — toggle theme, font size, UX mode.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: build Settings page with theme, mode, and font size controls"
```

---

## Task 11: Polish and Final Integration

**Files:**
- Various component touch-ups
- Add loading skeletons
- Verify responsive design

**Step 1: Add a loading skeleton component**

`src/components/Skeleton.tsx`:
```tsx
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-sand-400/20 rounded-xl ${className}`} />;
}
```

**Step 2: Test responsive design**

Run `npm run dev` and test at:
- Mobile: 375px width
- Tablet: 768px width
- Desktop: 1280px width

**Step 3: Run production build**

```bash
npm run build
npx serve dist
```

Verify all pages work in production build.

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: add loading skeletons and polish responsive design"
```

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Scaffold Vite project | 5 min |
| 2 | Tailwind + dependencies | 10 min |
| 3 | Routing + layout shell | 15 min |
| 4 | Zustand store + persistence | 15 min |
| 5 | Quran data sourcing + hooks | 30 min |
| 6 | Surah Index page | 20 min |
| 7 | Reading View page | 30 min |
| 8 | Home page + engagement | 20 min |
| 9 | Progress Dashboard | 15 min |
| 10 | Settings page | 10 min |
| 11 | Polish + integration | 15 min |

**Total estimated: ~3 hours for a skilled developer**
