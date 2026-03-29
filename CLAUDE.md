# Noor Mobile — Quran Companion App

## Tech Stack
- **Framework:** Expo SDK 55 + React Native 0.83 + React 19 (cross-platform: iOS, Android, Web)
- **Routing:** expo-router v55 (file-based)
- **Styling:** NativeWind 4 (Tailwind) + inline StyleSheet
- **State:** Zustand 5 + MMKV (native) / localStorage (web)
- **Data:** @tanstack/react-query 5, local JSON bundles
- **Animation:** react-native-reanimated 4
- **Icons/Ornaments:** react-native-svg (NO emoji anywhere)
- **Audio:** expo-audio (migrated from deprecated expo-av)
- **Typography:** Amiri (Arabic serif) + Inter (Latin sans-serif)
- **Theme:** ThemeProvider with 7 modes via useTheme()

## Architecture
```
app/              — expo-router screens (file-based routing)
  (tabs)/         — tab navigator (Home, Quran, Journey, Settings)
  surah/[id].tsx  — reading view with Serene/Immersive/Study modes
components/       — shared UI components
  ornaments/      — SVG Islamic ornaments (Crescent, Star, Flower, Divider)
  study/          — Study Mode components (KnowledgePanel, EntityChips, CrossReferences, ConstellationGraph, StoryMode, DepthIndicator)
  ui/             — primitives (ArabicText, GoldShimmer)
hooks/            — useNoorAudioPlayer, useQuranData, useSemanticSearch
theme/            — colors (7 themes + textGold token), typography, ThemeProvider
store/            — Zustand store (useAppStore)
assets/
  data/           — bundled Quran JSON (114 surahs)
  knowledge/      — HyperGraph (257 entities, themes, n-ary hyperedges v2.0)
  fonts/          — Amiri + Inter font files
scripts/          — generate_embeddings.py (build-time vector generation)
```

## Design Rules
- NO emoji or Unicode symbols in UI — all icons must be SVG via react-native-svg
- Sacred content principle: reading screens are distraction-free
- GoldShimmer disables animation in reading context (isReadingContext prop)
- All animations respect AccessibilityInfo.isReduceMotionEnabled
- Touch targets >= 44px, WCAG 2.1 AA compliance
- Arabic text: RTL, Amiri font, accessibilityLanguage="ar"
- Gold colors: use `colors.textGold` for text (AA compliant), `colors.accent` for decorative only
- Dark mode text: never pure #FFFFFF except high-contrast theme
- No gamification: no streaks, no flames, no guilt. ReadingLog uses warm encouragement only.

## UX Modes
- **Serene** (default): minimal, controls hidden until tap
- **Immersive**: dark theme forced, auto-advance audio, larger controls
- **Study**: always-visible translation, inline notes, Knowledge Panel (bottom sheet), entity chips, cross-references

## BMad Artifacts
- `design-artifacts/` — PRD, architecture, UX spec, epics & stories, product brief
- `_bmad-output/` — sprint-status.yaml, implementation readiness report, story files
