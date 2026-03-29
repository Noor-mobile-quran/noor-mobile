# Technical Architecture Research — Noor App

Generated: 2026-03-29 | Researcher: Raiden Shogun (Claude Peer hcjkk7oe)

---

## 1. Expo SDK 52 + React Native 0.76 — STABLE. PROCEED.

- SDK 52 is GA (released Nov 2024), mature with patch releases. Ships with RN 0.76.
- New Architecture is ON by default. Expo Go only supports New Arch + Hermes. No opt-out in SDK 55+.
- **Critical gotcha:** Third-party library compatibility is the #1 risk. Run `npx expo-doctor` and check reactnative.directory before committing to any dependency.
- Platform minimums raised: iOS 15.1+, Android SDK 24+, Xcode 16+.
- For offline-first: Use `expo-asset` config plugin to embed JSON bundles at build time. Use `@react-native-community/netinfo` for connectivity detection.

---

## 2. expo-router v4 — File-Based Routing

**Recommended structure:**
```
app/
  _layout.tsx              # Root Stack
  (tabs)/
    _layout.tsx            # Tabs layout
    index.tsx              # Home tab
    explore.tsx            # Explore tab
    surah/
      _layout.tsx          # Nested Stack inside tab
      index.tsx            # Surah list
      [id].tsx             # Dynamic: /surah/123
```

**Key patterns:**
- Root layout wraps `<Stack>` with `(tabs)` as a screen (`headerShown: false`)
- Tab layout uses `<Tabs>` with `<Tabs.Screen>` for each tab
- Nested stack inside surah tab uses `unstable_settings = { initialRouteName: 'index' }` for correct back behavior
- Dynamic route: `useLocalSearchParams<{ id: string }>()` in `[id].tsx`

**Known issues:**
- `?__EXPO_ROUTER_key=...` appended to URLs (GitHub #33449)
- Tab stacks may not reset on tab switch — use `listeners` prop to control

Stay on expo-router v4 for SDK 52.

---

## 3. Zustand 5 + MMKV — The Decisive Pattern

**Zustand v5 breaking changes from v4:**
- Requires React 18+, TypeScript 4.5+
- `useShallow` replaces `shallow` import
- `setState` replace requires complete state object
- Custom equality → use `createWithEqualityFn`

**MMKV storage adapter:**
```typescript
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const mmkv = new MMKV();
export const zustandStorage: StateStorage = {
  setItem: (name, value) => mmkv.set(name, value),
  getItem: (name) => mmkv.getString(name) ?? null,
  removeItem: (name) => mmkv.delete(name),
};
```

**Persisted store pattern:**
```typescript
export const useSurahStore = create<SurahState>()(
  persist(
    (set) => ({ /* state + actions */ }),
    {
      name: 'surah-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ /* only persist what matters */ }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);
```

**Architecture:** Separate stores by domain (surah data, user prefs, offline sync queue). Use `partialize` everywhere. Implement a `HydrationGate` component.

**MMKV vs AsyncStorage:** MMKV is ~30x faster reads, ~5x faster writes, synchronous API, built-in encryption. Requires dev build (no Expo Go).

---

## 4. HyperGraph On-Device — JSON Graph Spec + Lazy Loading

**Bundle structure for offline:**
```
/assets/quran-graph/
  index.json                # Master index
  surahs/surah_001.json     # Per-surah subgraph
  themes/themes_index.json  # Theme → ayah refs
  narratives/               # Narrative arc data
  tafsir/ibn_kathir/        # Loaded on demand only
  lookup/
    ayah_to_themes.json     # Reverse index
    ayah_to_narratives.json # Reverse index
```

**Lazy load by surah.** Index files at app start for search. Reverse indexes for O(1) lookups. Tafsir loaded only on request.

**Client-side querying:**
- V1: Plain Maps + pre-computed indexes — query patterns are predictable. No library needed.
- V2: Graphology — if you need dynamic traversal. Pure JS, TypeScript, works in RN.

At ~6,236 ayahs + ~100 themes + ~25 prophets, everything fits comfortably in memory.

---

## 5. Audio — expo-audio

**expo-av is DEPRECATED.** Removed in SDK 55. Do not use.

**expo-audio:**
- Stable since SDK 53 (beta in SDK 52)
- `AudioPlaylist` API with gapless playback
- `useAudioPlaylist` hook: `play()`, `pause()`, `next()`, `previous()`
- Background audio + lock screen controls on both platforms

**iOS config (app.json):**
```json
{
  "ios": { "infoPlist": { "UIBackgroundModes": ["audio"] } },
  "plugins": [["expo-audio", { "microphonePermission": false }]]
}
```

**Android critical:** Call `setActiveForLockScreen(true)` or Android kills background audio after ~3 minutes.

**Pattern:** One audio file per ayah or per surah → load into `AudioPlaylist` → gapless transitions. Pre-load next surah's playlist near end.

---

## Final Architecture Decisions

| Layer | Decision | Confidence |
|-------|----------|------------|
| Runtime | Expo SDK 52 + New Arch + Hermes | High |
| Routing | expo-router v4, tabs + nested stacks | High |
| State | Zustand 5 + MMKV persist | High |
| Knowledge Graph | JSON Graph Spec + pre-computed indexes → Graphology later | High |
| Audio | expo-audio with AudioPlaylist | High |
| Styling | NativeWind 4 | High |
| Data fetching | @tanstack/react-query 5 | High |

**Critical warning:** You MUST use a development build from day one. Both MMKV and expo-audio require native modules incompatible with Expo Go. Run `npx expo prebuild` and build with EAS or locally.
