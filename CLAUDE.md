# Noor Mobile — Quran Companion App

## Tech Stack
- **Framework:** Expo SDK 52 + React Native 0.76 (cross-platform: iOS, Android, Web)
- **Routing:** expo-router (file-based)
- **Styling:** NativeWind 4 (Tailwind) + inline StyleSheet
- **State:** Zustand 5 + MMKV (native) / localStorage (web)
- **Data:** @tanstack/react-query 5, local JSON bundles
- **Animation:** react-native-reanimated 3
- **Icons/Ornaments:** react-native-svg (NO emoji anywhere)
- **Audio:** expo-av
- **Typography:** Amiri (Arabic serif) + Inter (Latin sans-serif)
- **Theme:** ThemeProvider with light/dark/high-contrast via useTheme()

## Architecture
```
app/              — expo-router screens (file-based routing)
  (tabs)/         — tab navigator (Home, Quran, Journey, Settings)
  surah/[id].tsx  — reading view with Serene/Immersive/Study modes
components/       — shared UI components
  ornaments/      — SVG Islamic ornaments (Crescent, Star, Flower, Divider)
  ui/             — primitives (ArabicText, GoldShimmer)
hooks/            — useAudioPlayer, useQuranData
theme/            — colors, typography, ThemeProvider
store/            — Zustand store (useAppStore)
assets/
  data/           — bundled Quran JSON (114 surahs)
  knowledge/      — HyperGraph (entities, themes, narratives, hyperedges)
  fonts/          — Amiri + Inter font files
```

## Design Rules
- NO emoji or Unicode symbols in UI — all icons must be SVG via react-native-svg
- Sacred content principle: reading screens are distraction-free
- GoldShimmer disables animation in reading context (isReadingContext prop)
- All animations respect AccessibilityInfo.isReduceMotionEnabled
- Touch targets >= 44px, WCAG 2.1 AA compliance
- Arabic text: RTL, Amiri font, accessibilityLanguage="ar"
- Color palette: Cream #FFF9ED, Gold #D4A843, Forest #1B4332, Dark bg #1A1410

## UX Modes
- **Serene** (default): minimal, controls hidden until tap
- **Immersive**: dark theme forced, auto-advance audio, larger controls
- **Study**: always-visible translation, inline notes, tafsir button, bookmarks
