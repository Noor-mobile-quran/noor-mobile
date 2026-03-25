# Noor React Native Migration + Design Strategy Alignment

**Created:** 2026-03-25
**Status:** Approved
**Scope:** Migrate Noor from Vite+React web app to React Native (Expo) mobile app, while resolving 6 design strategy alignment issues from `.impeccable.md`

---

## 1. Migration Overview

### Current State
- Vite 8 + React 19 + TypeScript 5.9 web app
- Tailwind CSS 4 with custom design tokens
- Zustand state management, localStorage/IndexedDB persistence
- Framer Motion animations, React Router navigation
- Amiri + Inter fonts via Google Fonts CDN
- 15 components, 5 pages, complete Quran data (114 surahs)

### Target State
- Expo (managed workflow) + React Native
- NativeWind for Tailwind-like styling
- Zustand with MMKV persistence
- React Native Reanimated for animations
- Expo Router for file-based navigation
- Bundled Amiri + Inter fonts via expo-font
- expo-av for audio playback

### What Carries Over (No Changes)
- `types/index.ts` — TypeScript interfaces
- `useAppStore.ts` — Zustand store logic (swap persistence adapter)
- Quran JSON data files (114 surahs)
- Business logic: streak calculation, Hijri date, daily ayah selection
- Design tokens: color palette, typography choices

### What Must Be Rebuilt
- All React DOM components → React Native components
- Tailwind CSS → NativeWind
- Framer Motion → React Native Reanimated
- React Router → Expo Router
- localStorage/IndexedDB → MMKV
- Google Fonts → expo-font with bundled fonts
- HTML audio → expo-av

---

## 2. Design Strategy Alignment (6 Issues)

### Issue 1: Replace Unicode Emoji Ornaments with SVG

**Problem:** `☪`, `✦`, `❋` Unicode characters used as decorative elements across 7 files. Violates "Sacred content, sacred space" principle.

**Affected locations:**
- `HomePage.tsx` — crescent (☪), star dividers (✦), flower (❋), bismillah footer
- `StreakCounter.tsx` — crescent (☪)
- `ProgressPage.tsx` — crescent (☪), stars (✦), flower (❋)
- `SettingsPage.tsx` — stars (✦)
- `DailyAyah.tsx` — stars (✦)
- `SurahIndexPage.tsx` — star (✦)
- `SurahHeader.tsx` — stars (✦)

**Solution:** Create `components/ornaments/` with React Native SVG components:
- `Crescent.tsx` — proper Islamic crescent SVG
- `StarOrnament.tsx` — 8-pointed Islamic star (Rub el Hizb)
- `FlowerOrnament.tsx` — Islamic arabesque rosette
- `OrnamentalDivider.tsx` — horizontal gold divider with center motif
- `BismillahFrame.tsx` — decorative frame for Bismillah text

All ornaments accept `size`, `color`, and `opacity` props. Default to gold-500 accent.

### Issue 2: Arabic Text Accessibility (lang/dir Audit)

**Problem:** Some Arabic text elements have `dir="rtl"` but missing `lang="ar"`. Some have neither.

**Current audit:**
- Has both `dir="rtl" lang="ar"`: `QuickDua`, `AyahCard`, `DailyAyah` (ayah text)
- Has `dir="rtl"` only (missing `lang="ar"`): `IslamicGreeting`, `SurahCard`, `SurahHeader`, `DailyAyah` (bismillah), `SurahIndexPage` (decorative)
- Has neither: `HomePage` (bismillah footer), `SettingsPage` (Arabic samples)

**Solution for React Native:**
- Create a reusable `<ArabicText>` component that wraps `<Text>` with:
  - `style={{ writingDirection: 'rtl', fontFamily: 'Amiri' }}`
  - `accessibilityLanguage="ar"` (iOS) / `accessibilityLabel` with Arabic context
- Use `<ArabicText>` everywhere Arabic script appears
- For decorative Arabic (non-content), mark `accessibilityElementsHidden={true}` / `importantForAccessibility="no"`

### Issue 3: Scope Gold Shimmer to Non-Reading Contexts

**Problem:** `.gold-shimmer` CSS animation exists and could compete with Quran text on reading pages. Violates "Sacred content, sacred space."

**Solution:**
- Gold shimmer animation (via Reanimated) allowed on: Home hero, streak celebrations, surah completion celebrations
- Prohibited on: Reading View, any screen displaying Quran ayah text
- Implement as `<GoldShimmer>` component with internal check: if current route is reading view, render static gold instead

### Issue 4: High Contrast Mode

**Problem:** Committed to in `.impeccable.md` accessibility section but not implemented.

**Solution:** Add third theme option alongside light/dark:

```typescript
highContrast: {
  bg: '#000000',
  surface: '#1A1A1A',
  textPrimary: '#FFFFFF',
  textSecondary: '#E0E0E0',
  accent: '#FFD700',
  accentBright: '#FFEA00',
  forest: '#00C853',
}
```

- Theme selector in Settings: Light / Dark / High Contrast
- High contrast uses pure black bg, pure white text, bright gold accent
- Minimum 7:1 contrast ratio (WCAG AAA) for all text
- Update `UserSettings.theme` type to `"light" | "dark" | "high-contrast"`

### Issue 5: Wire UX Mode-Specific Layouts

**Problem:** `uxMode` stored in Zustand but not consumed — selecting Serene/Immersive/Study changes nothing.

**Solution:** Each mode changes the Reading View behavior:

**Serene Mode:**
- Light/cream background (overrides dark if set)
- Maximum whitespace, large Arabic text
- Audio controls hidden until user taps
- Minimal navigation chrome
- No streak/progress UI on reading screen

**Immersive Mode:**
- Forces dark theme while active
- Persistent audio player bar at bottom
- Auto-advance to next ayah after recitation completes
- Larger play/pause controls
- Ambient background (subtle Islamic pattern at low opacity)

**Study Mode:**
- Split layout: Arabic text top half, translation bottom half
- Inline bookmark + note-taking per ayah
- Tafsir panel (slide-up sheet) — initially shows placeholder "Coming soon"
- Ayah cross-references (future)

Implementation: `ReadingPage.tsx` conditionally renders different component compositions based on `settings.uxMode`.

### Issue 6: Self-Host Amiri Font

**Problem:** Amiri loaded via Google Fonts CDN — no offline support, adds latency.

**Solution:** In React Native with Expo, fonts are bundled by default:
- Download Amiri-Regular.ttf and Amiri-Bold.ttf
- Download Inter-Regular/Medium/SemiBold/Bold.ttf
- Load via `expo-font` in app root
- **This issue is solved by the platform migration itself**

---

## 3. Project Structure

```
noor-mobile/
├── app/                        # Expo Router pages
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab navigator (Bottom nav)
│   │   ├── index.tsx           # Home
│   │   ├── surahs.tsx          # Surah Index
│   │   ├── progress.tsx        # Progress Dashboard
│   │   └── settings.tsx        # Settings
│   ├── surah/[id].tsx          # Reading View (dynamic)
│   └── _layout.tsx             # Root layout + font loading
├── components/
│   ├── ornaments/              # SVG Islamic ornaments
│   │   ├── Crescent.tsx
│   │   ├── StarOrnament.tsx
│   │   ├── FlowerOrnament.tsx
│   │   ├── OrnamentalDivider.tsx
│   │   └── BismillahFrame.tsx
│   ├── ui/                     # Shared UI primitives
│   │   ├── ArabicText.tsx      # Accessible Arabic text wrapper
│   │   └── GoldShimmer.tsx     # Scoped shimmer animation
│   ├── AyahCard.tsx
│   ├── AudioPlayer.tsx         # Global persistent audio player
│   ├── BottomNav.tsx
│   ├── ContinueReading.tsx
│   ├── DailyAyah.tsx
│   ├── IslamicGreeting.tsx
│   ├── QuickDua.tsx
│   ├── SearchBar.tsx
│   ├── StreakCounter.tsx
│   ├── SurahCard.tsx
│   ├── SurahContextCard.tsx
│   └── SurahHeader.tsx
├── store/
│   └── useAppStore.ts          # Zustand + MMKV
├── hooks/
│   ├── useQuranData.ts
│   └── useAudioPlayer.ts      # expo-av wrapper
├── theme/
│   ├── colors.ts               # Light / Dark / High Contrast tokens
│   ├── typography.ts           # Font config
│   └── ThemeProvider.tsx        # Context provider
├── lib/
│   └── storage.ts              # MMKV adapter
├── assets/
│   ├── fonts/
│   │   ├── Amiri-Regular.ttf
│   │   ├── Amiri-Bold.ttf
│   │   ├── Inter-Regular.ttf
│   │   ├── Inter-Medium.ttf
│   │   ├── Inter-SemiBold.ttf
│   │   └── Inter-Bold.ttf
│   ├── ornaments/              # Source SVGs
│   └── data/                   # 114 surah JSON files + index
├── types/
│   └── index.ts                # Reused from web
├── app.json                    # Expo config
├── package.json
└── tsconfig.json
```

---

## 4. Dependencies

```json
{
  "dependencies": {
    "expo": "~52",
    "expo-av": "~15",
    "expo-font": "~13",
    "expo-router": "~4",
    "expo-status-bar": "~2",
    "react": "^19",
    "react-native": "~0.76",
    "react-native-mmkv": "^3",
    "react-native-reanimated": "~3",
    "react-native-safe-area-context": "~5",
    "react-native-screens": "~4",
    "react-native-svg": "~15",
    "nativewind": "^4",
    "zustand": "^5",
    "@tanstack/react-query": "^5"
  }
}
```

---

## 5. Implementation Order

### Wave 1: Foundation (scaffold + core infrastructure)
1. Init Expo project with TypeScript
2. Install dependencies
3. Set up theme system (colors, typography, ThemeProvider)
4. Port Zustand store with MMKV persistence
5. Load bundled fonts (Amiri + Inter)
6. Copy Quran data to assets

### Wave 2: Ornaments + Primitives
7. Build SVG ornament components (Crescent, Star, Flower, Divider)
8. Build ArabicText accessible wrapper
9. Build GoldShimmer scoped component
10. Set up Expo Router with tab layout

### Wave 3: Core Screens
11. Home page (hero, greeting, daily ayah, streak, continue reading)
12. Surah Index (list, search, filter)
13. Reading View — Serene mode (default)
14. Progress Dashboard
15. Settings page (theme toggle with high contrast, UX mode, font size)

### Wave 4: Audio + Modes
16. Build global AudioPlayer with expo-av
17. Immersive Mode (dark override, persistent player, auto-advance)
18. Study Mode (split view, notes, bookmarks panel)

### Wave 5: Polish
19. Animations (Reanimated: page transitions, streak celebrations)
20. Final accessibility audit
21. App icon + splash screen
22. Build and test on iOS + Android

---

## 6. Design Principles (from .impeccable.md)

All implementation must align with:

1. **Sacred content, sacred space** — UI serves the Quran, no flashy distractions
2. **Typography is the interface** — Amiri + Inter, generous whitespace, proper RTL
3. **Habit through beauty, not pressure** — gentle encouragement, never guilt
4. **Warm minimalism** — cream/gold/earth palette with intentional Islamic ornaments
5. **Adapt to the reader** — 3 UX modes, configurable fonts, light/dark/high-contrast
