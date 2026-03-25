# Noor — Quran Content Hub: Epics and User Stories

**Version:** 1.0 (MVP)
**Date:** 2026-03-24
**Authors:** John (Product Manager), Bob (Scrum Master)
**Source PRD:** [PRD](/design-artifacts/E-PRD/prd.md)

---

## Complexity Guide

| Size | Effort | Description |
|------|--------|-------------|
| **S** | 1-2 days | Straightforward, well-defined, minimal unknowns |
| **M** | 3-5 days | Some complexity, may involve multiple components |
| **L** | 5-8 days | Significant complexity, unknowns, or cross-cutting concerns |

---

## Epic 1: Project Setup and Infrastructure

**Goal:** Establish the project foundation — tooling, folder structure, deployment pipeline, and core libraries — so all subsequent work has a stable base.

**Dependencies:** None (this is the starting point).

---

### Story 1.1: Initialize Vite + React + TypeScript Project

**Description:** Set up the project using Vite with the React-TypeScript template. Configure strict TypeScript settings. Verify the dev server runs and a production build completes without errors.

**Acceptance Criteria:**
- [ ] Project initialised with `npm create vite@latest` using the react-ts template
- [ ] `npm run dev` starts the dev server without errors
- [ ] `npm run build` produces a production build without errors
- [ ] TypeScript strict mode is enabled in tsconfig.json
- [ ] .gitignore includes node_modules, dist, .env

**Complexity:** S

---

### Story 1.2: Configure Tailwind CSS

**Description:** Install and configure Tailwind CSS with the project. Define the custom color palette (earth tones, gold, dark mode colors) and font families in tailwind.config. Set up a base CSS file with Tailwind directives.

**Acceptance Criteria:**
- [ ] Tailwind CSS installed and configured
- [ ] Custom colors defined: deep green (#1B4332), gold (#D4A843), cream (#FDF6E3), charcoal (#1A1A2E), midnight blue (#16213E)
- [ ] Custom font families configured (Amiri for Arabic, Inter for Latin)
- [ ] Dark mode configured using `class` strategy
- [ ] A test component renders correctly with Tailwind classes

**Complexity:** S

---

### Story 1.3: Set Up Folder Structure and Routing

**Description:** Establish the application folder structure (components, pages, hooks, utils, data, types) and configure client-side routing with React Router for all key pages (Home, Surah Index, Reading View, Progress, Settings).

**Acceptance Criteria:**
- [ ] Folder structure created: `src/components`, `src/pages`, `src/hooks`, `src/utils`, `src/data`, `src/types`
- [ ] React Router installed and configured
- [ ] Routes defined for: `/` (Home), `/surahs` (Index), `/surah/:id` (Reading View), `/progress` (Dashboard), `/settings` (Settings)
- [ ] 404 catch-all route with a "page not found" message
- [ ] Each route renders a placeholder page component

**Complexity:** S

---

### Story 1.4: Set Up IndexedDB Service Layer

**Description:** Create a service/utility module that wraps IndexedDB for storing and retrieving user state (streaks, bookmarks, reading history, settings). Include a fallback to localStorage if IndexedDB is unavailable.

**Acceptance Criteria:**
- [ ] IndexedDB wrapper module created with open, read, write, delete operations
- [ ] Database schema defined for: streaks, bookmarks, reading_history, settings
- [ ] Fallback to localStorage implemented and tested
- [ ] Module is importable as a single service (`userStorage.ts`)
- [ ] Unit tests or manual verification that data persists across page reloads

**Complexity:** M

---

### Story 1.5: Configure Deployment Pipeline

**Description:** Set up static deployment to Vercel or Netlify. Configure build settings, environment variables (if any), and verify that a deploy from main branch works end to end.

**Acceptance Criteria:**
- [ ] Project connected to Vercel or Netlify
- [ ] Build command and output directory configured correctly
- [ ] Deploy from main branch succeeds and site is accessible via URL
- [ ] Custom domain setup documented (even if not applied yet)

**Complexity:** S

---

### Story 1.6: Load and Configure Web Fonts

**Description:** Set up Arabic calligraphic font (Amiri or KFGQPC Uthmanic Script) and Latin font (Inter). Implement font loading strategy to prevent FOUT.

**Acceptance Criteria:**
- [ ] Arabic font loaded via Google Fonts or self-hosted
- [ ] Latin font (Inter) loaded
- [ ] Font loading uses `font-display: swap` or preload strategy
- [ ] No Flash of Unstyled Text observed on page load
- [ ] Fonts render correctly on Chrome, Safari, and Firefox

**Complexity:** S

---

## Epic 2: Quran Data Layer

**Goal:** Prepare, bundle, and serve all Quran data (Arabic text, English translation, tafsir, audio URLs) locally so the app functions without network requests for content.

**Dependencies:** Epic 1 (project setup).

---

### Story 2.1: Source and Prepare Quran JSON Data

**Description:** Obtain Quran data from a reliable source (quran.com API export, Tanzil.net, or similar). Structure it into per-surah JSON files matching the defined TypeScript interfaces. Validate all 114 surahs and 6236 ayahs are present.

**Acceptance Criteria:**
- [ ] JSON data sourced and placed in `src/data/surahs/` (one file per surah or a single indexed file)
- [ ] Each surah contains: number, name_arabic, name_english, name_translation, revelation_type, ayah_count, ayahs array
- [ ] Each ayah contains: number, number_in_quran, text_arabic, text_translation, juz, page
- [ ] Total ayah count validated: 6236
- [ ] Data passes TypeScript type checking against the Surah/Ayah interfaces

**Complexity:** M

---

### Story 2.2: Add Tafsir Data

**Description:** Source tafsir (commentary) data — Ibn Kathir abridged English — and integrate it into the per-ayah data structure. Tafsir can be loaded lazily per surah.

**Acceptance Criteria:**
- [ ] Tafsir text sourced and mapped to each ayah
- [ ] Tafsir stored in a separate lazy-loadable file per surah (to keep initial bundle small)
- [ ] TypeScript interface includes tafsir field
- [ ] At least 3 surahs verified manually for tafsir accuracy

**Complexity:** M

---

### Story 2.3: Map Audio Recitation URLs

**Description:** Map audio recitation URLs (from EveryAyah.com or mp3quran.net) to each ayah. Default reciter: Mishary Rashid Alafasy. Add support for at least one additional reciter.

**Acceptance Criteria:**
- [ ] audio_url field populated for every ayah
- [ ] URLs follow a predictable pattern (e.g., `base_url/surah_number/ayah_number.mp3`)
- [ ] At least 2 reciters supported with configurable base URLs
- [ ] Audio URLs verified for at least 3 surahs (Fatiha, Baqarah first 10, Ikhlas)

**Complexity:** M

---

### Story 2.4: Create Data Access Hooks

**Description:** Build React custom hooks for accessing Quran data: `useSurah(id)`, `useSurahList()`, `useAyah(surahId, ayahId)`, `useTafsir(surahId)`. Hooks should handle lazy loading and provide loading/error states.

**Acceptance Criteria:**
- [ ] `useSurahList()` returns all 114 surahs (metadata only, no ayahs)
- [ ] `useSurah(id)` returns full surah with ayahs, lazy-loaded
- [ ] `useTafsir(surahId)` loads tafsir data lazily
- [ ] All hooks return `{ data, isLoading, error }` pattern
- [ ] Data loads in under 500ms for any individual surah

**Complexity:** M

---

## Epic 3: Surah Index and Navigation

**Goal:** Build the Surah Index page where users browse, search, and filter all 114 surahs.

**Dependencies:** Epic 2 (data layer must provide surah list).

---

### Story 3.1: Build Surah Index Page Layout

**Description:** Create the Surah Index page displaying all 114 surahs as cards/rows. Each entry shows: surah number, Arabic name, English name, English translation of name, revelation type badge, and ayah count.

**Acceptance Criteria:**
- [ ] All 114 surahs displayed in a scrollable list/grid
- [ ] Each surah entry shows: number, Arabic name, English name, translation, revelation type, ayah count
- [ ] Revelation type displayed as a visual badge (Meccan / Medinan)
- [ ] Layout is responsive: single column on mobile, multi-column on desktop
- [ ] Tapping a surah navigates to `/surah/:id`

**Complexity:** M

---

### Story 3.2: Implement Surah Search

**Description:** Add a search bar to the Surah Index that filters surahs by name (Arabic or English) or number in real-time as the user types.

**Acceptance Criteria:**
- [ ] Search input at the top of the index page
- [ ] Filters results as the user types (debounced, 200ms)
- [ ] Searches across: name_arabic, name_english, name_translation, number
- [ ] Empty results show a "No surahs found" message
- [ ] Clearing search restores the full list

**Complexity:** S

---

### Story 3.3: Add Revelation Type Filter and Sort Options

**Description:** Add filter chips or toggles for revelation type (All / Meccan / Medinan) and sort options (by number or alphabetical by English name).

**Acceptance Criteria:**
- [ ] Filter options: All, Meccan, Medinan — visually distinct when active
- [ ] Sort options: By Number (default), Alphabetical (A-Z)
- [ ] Filters and sort work together (e.g., Meccan surahs sorted alphabetically)
- [ ] Filter/sort state does not persist across navigation (resets on revisit)

**Complexity:** S

---

## Epic 4: Reading View

**Goal:** Build the core reading experience — the most important page of the app.

**Dependencies:** Epic 2 (data hooks), Epic 3 (navigation from index).

---

### Story 4.1: Build Reading View Page Structure

**Description:** Create the Reading View page layout. Load surah data based on the URL param. Display surah header (name, bismillah) and a scrollable list of ayahs.

**Acceptance Criteria:**
- [ ] Page loads surah data from URL parameter (`:id`)
- [ ] Surah header displays Arabic name, English name, ayah count, revelation type
- [ ] Bismillah displayed at top (except Surah 9 — At-Tawbah)
- [ ] Loading state shown while surah data loads
- [ ] Error state shown if surah ID is invalid

**Complexity:** M

---

### Story 4.2: Render Ayah Cards with Arabic Text and Translation

**Description:** Display each ayah as a card/block with Arabic text (RTL, calligraphic font) and English translation below. Include ayah number badge.

**Acceptance Criteria:**
- [ ] Arabic text renders RTL with correct shaping and ligatures
- [ ] Arabic font (Amiri or Uthmanic) is applied correctly
- [ ] English translation displayed below Arabic text in Latin font
- [ ] Ayah number displayed as a badge/circle
- [ ] Text is selectable for copy
- [ ] Layout does not break for long ayahs (e.g., Ayat al-Kursi, Surah Baqarah 282)

**Complexity:** L

---

### Story 4.3: Implement Tafsir Toggle

**Description:** Add a toggle/expand button on each ayah to show/hide tafsir (commentary). Tafsir data loads lazily when first expanded for the surah.

**Acceptance Criteria:**
- [ ] Each ayah has a tafsir toggle button (icon or text)
- [ ] Tapping toggle expands tafsir text below the translation
- [ ] Tafsir data lazy-loaded on first toggle (per surah)
- [ ] Loading spinner shown while tafsir loads
- [ ] Collapse/expand animates smoothly (200ms transition)

**Complexity:** M

---

### Story 4.4: Implement Surah Navigation (Previous/Next)

**Description:** Add previous/next surah navigation controls. At the bottom of the surah and in the header. Handle edge cases (Surah 1 has no previous, Surah 114 has no next).

**Acceptance Criteria:**
- [ ] Previous/Next buttons visible at top and bottom of reading view
- [ ] Previous disabled on Surah 1, Next disabled on Surah 114
- [ ] Navigation scrolls to top of new surah
- [ ] Navigation is smooth (no flash of old content)

**Complexity:** S

---

### Story 4.5: Implement Bookmark Functionality

**Description:** Allow users to bookmark individual ayahs from the reading view. Bookmarked state is visually indicated. Bookmark saves to IndexedDB.

**Acceptance Criteria:**
- [ ] Bookmark icon/button on each ayah card
- [ ] Tapping toggles bookmark on/off
- [ ] Bookmarked ayahs show a filled/active bookmark icon
- [ ] Bookmark state persists across sessions (IndexedDB)
- [ ] Bookmark action provides tactile feedback (subtle animation or color change)

**Complexity:** M

---

### Story 4.6: Implement Auto-Save Reading Position

**Description:** Automatically save the user's last-read position (surah + ayah) as they scroll through the reading view. On return, offer to resume from that position.

**Acceptance Criteria:**
- [ ] Tracks which ayah is currently in the viewport (intersection observer)
- [ ] Saves last-read surah and ayah to IndexedDB on scroll (debounced)
- [ ] Home page "Continue Reading" card uses this saved position
- [ ] Navigating to a surah where the user left off scrolls to the correct ayah

**Complexity:** M

---

### Story 4.7: Implement Three UX Modes

**Description:** Implement mode switching between Serene, Immersive, and Study modes. Each mode adjusts the visual styling, layout density, and visible features as defined in the PRD.

**Acceptance Criteria:**
- [ ] Mode switcher accessible from reading view header (3-way toggle or dropdown)
- [ ] **Serene mode:** Light warm colors, large Arabic font, generous spacing, minimal UI
- [ ] **Immersive mode:** Dark background, gold accents, audio player prominent, verse highlighting
- [ ] **Study mode:** Compact layout, tafsir panel visible by default, bookmark/note access prominent
- [ ] Mode transitions animate smoothly (200ms)
- [ ] Selected mode persists in settings across sessions

**Complexity:** L

---

### Story 4.8: Implement Ayah Number Selector / Jump-To

**Description:** Allow users to jump to a specific ayah within the current surah via a number input or scrollable selector.

**Acceptance Criteria:**
- [ ] Jump-to control accessible from the reading view header
- [ ] User can type an ayah number or select from a dropdown
- [ ] Page scrolls smoothly to the selected ayah
- [ ] Invalid ayah numbers are rejected with a message
- [ ] Ayah is briefly highlighted after jumping to it

**Complexity:** S

---

## Epic 5: Audio Recitation

**Goal:** Add audio playback so users can listen to Quran recitation, synchronized with the reading view.

**Dependencies:** Epic 4 (reading view must be built first).

---

### Story 5.1: Build Audio Player Component

**Description:** Create a reusable audio player component with play/pause, previous ayah, next ayah, and a progress/seek bar. The player appears as a floating bar at the bottom of the reading view.

**Acceptance Criteria:**
- [ ] Audio player renders as a fixed/sticky bar at the bottom of the reading view
- [ ] Controls: play/pause, previous ayah, next ayah, seek bar
- [ ] Displays current ayah info (surah name + ayah number)
- [ ] Player can be collapsed/minimized
- [ ] Player does not obscure the last ayah in the scrollable area (padding applied)

**Complexity:** M

---

### Story 5.2: Implement Single Ayah Playback

**Description:** Allow users to play audio for a single ayah by tapping a play button on the ayah card. Audio loads from the mapped URL and plays through the audio player.

**Acceptance Criteria:**
- [ ] Each ayah card has a play button
- [ ] Tapping play loads and plays the audio for that ayah
- [ ] Audio player activates and shows the playing ayah info
- [ ] Tapping play on a different ayah stops the current and starts the new one
- [ ] Loading state shown while audio buffers

**Complexity:** M

---

### Story 5.3: Implement Continuous Surah Playback

**Description:** Add a "Play Surah" button that plays all ayahs in sequence from the current ayah to the end of the surah. Auto-advances to the next ayah when one finishes.

**Acceptance Criteria:**
- [ ] "Play Surah" button in surah header or audio player
- [ ] Playback starts from the currently visible/selected ayah
- [ ] Auto-advances to next ayah when current finishes
- [ ] Stops at the end of the surah
- [ ] User can pause and resume continuous playback

**Complexity:** M

---

### Story 5.4: Implement Ayah Highlighting During Playback

**Description:** Highlight the currently playing ayah in the reading view. Auto-scroll to keep the playing ayah visible.

**Acceptance Criteria:**
- [ ] Currently playing ayah has a distinct visual highlight (background color or border)
- [ ] Reading view auto-scrolls to keep the playing ayah in the viewport
- [ ] Highlight follows playback as it advances through ayahs
- [ ] Highlight is removed when playback stops
- [ ] Auto-scroll can be temporarily overridden by manual scrolling

**Complexity:** M

---

### Story 5.5: Implement Reciter Selection

**Description:** Allow users to choose between available reciters. Selection is made in Settings and applied globally to all audio playback.

**Acceptance Criteria:**
- [ ] Settings page shows reciter options (minimum 2: Mishary Rashid Alafasy + one other)
- [ ] Selecting a reciter updates the audio URLs used for playback
- [ ] Selection persists across sessions
- [ ] Changing reciter while audio is playing stops playback (with user confirmation or silent restart)

**Complexity:** S

---

## Epic 6: Engagement System

**Goal:** Build the streak system, daily ayah, reading goals, and progress tracking to drive daily return visits.

**Dependencies:** Epic 1 (IndexedDB service), Epic 4 (reading view for tracking reads).

---

### Story 6.1: Implement Daily Streak Tracking

**Description:** Track the user's reading streak — consecutive days with at least one reading session. Increment on reading activity, reset after a missed day.

**Acceptance Criteria:**
- [ ] Streak increments when user reads at least 1 ayah in a calendar day
- [ ] Streak resets to 0 if a full calendar day passes with no reading activity
- [ ] Current streak and longest streak stored in IndexedDB
- [ ] Streak logic handles timezone correctly (uses local midnight)
- [ ] Streak does not double-increment if user reads multiple times in one day

**Complexity:** M

---

### Story 6.2: Build Streak Display on Home Page

**Description:** Display the current streak prominently on the home page with a flame/fire icon. Add milestone animations for 7, 30, and 100 day streaks.

**Acceptance Criteria:**
- [ ] Streak counter displayed on home page with flame icon
- [ ] Counter shows current streak number
- [ ] Visual celebration/animation on milestone streaks (7, 30, 100)
- [ ] Streak of 0 shows an encouraging "Start your streak today" message
- [ ] Tapping streak counter navigates to progress dashboard

**Complexity:** S

---

### Story 6.3: Implement Daily Ayah Feature

**Description:** Display a featured "Ayah of the Day" on the home page. The ayah changes daily (deterministic — same ayah for all users on the same day). Shows Arabic text and translation.

**Acceptance Criteria:**
- [ ] Daily Ayah displayed prominently on the home page
- [ ] Ayah selection is deterministic based on the date (no randomness)
- [ ] Displays Arabic text, translation, and surah:ayah reference
- [ ] Tapping the daily ayah navigates to its position in the reading view
- [ ] New ayah appears after local midnight

**Complexity:** S

---

### Story 6.4: Implement Daily Reading Goal

**Description:** Allow users to set a daily reading goal (number of ayahs) and track progress toward it throughout the day.

**Acceptance Criteria:**
- [ ] Default goal: 10 ayahs per day
- [ ] Configurable in Settings: 1-50 ayahs
- [ ] Reading detection: ayah counted as "read" when visible in viewport for 3+ seconds
- [ ] Progress displayed as circular indicator on home page (e.g., "7/10")
- [ ] Goal progress resets at local midnight
- [ ] Completion state shows a congratulatory message

**Complexity:** M

---

### Story 6.5: Build Continue Reading Card

**Description:** Display a "Continue Reading" card on the home page that shows the last-read surah and ayah, allowing one-tap resume.

**Acceptance Criteria:**
- [ ] Card shows surah name, ayah number, and a snippet of the translation
- [ ] Tapping card navigates to the reading view at the exact saved position
- [ ] Card not shown if there is no reading history
- [ ] Data sourced from auto-saved reading position (Story 4.6)

**Complexity:** S

---

### Story 6.6: Build Progress Dashboard

**Description:** Create the Progress Dashboard page showing surah completion, juz completion, total progress, reading history, and bookmarks list.

**Acceptance Criteria:**
- [ ] Total Quran progress displayed (unique ayahs read / 6236)
- [ ] Surah completion: list of all surahs with percentage bars
- [ ] Juz completion: list of all 30 juz with percentage bars
- [ ] Reading history: recent entries with surah name, ayah, and timestamp
- [ ] Bookmarks list with surah name, ayah number, and saved date
- [ ] Ability to navigate to any bookmarked or history item

**Complexity:** L

---

### Story 6.7: Implement Bookmark Management

**Description:** Build a bookmark management view (within Progress Dashboard or as its own section) where users can see all bookmarks, sort them, and remove them.

**Acceptance Criteria:**
- [ ] All bookmarks displayed in a list with surah name, ayah number, and date
- [ ] User can remove a bookmark with confirmation
- [ ] Tapping a bookmark navigates to that ayah in reading view
- [ ] Empty state shown when no bookmarks exist
- [ ] Sorted by most recently added (default)

**Complexity:** S

---

## Epic 7: Settings and Preferences

**Goal:** Build the settings page where users configure their app experience.

**Dependencies:** Epic 1 (IndexedDB), Epic 5 (reciter selection).

---

### Story 7.1: Build Settings Page Layout

**Description:** Create the Settings page with grouped preference sections: Appearance, Reading, Audio, and Data.

**Acceptance Criteria:**
- [ ] Settings page accessible from navigation
- [ ] Sections visually grouped: Appearance, Reading, Audio, Data
- [ ] Each setting change saves immediately to IndexedDB (no "Save" button needed)
- [ ] Settings page is scrollable on mobile

**Complexity:** S

---

### Story 7.2: Implement Theme Toggle

**Description:** Add Light / Dark / System theme toggle. Applies the Tailwind dark mode class strategy globally.

**Acceptance Criteria:**
- [ ] Three options: Light, Dark, System (matches OS preference)
- [ ] Theme change applies immediately across all pages
- [ ] Dark mode uses the defined palette (charcoal, midnight blue, gold accents)
- [ ] Theme preference persists across sessions
- [ ] Smooth transition when switching themes (200ms)

**Complexity:** M

---

### Story 7.3: Implement Font Size Adjustment

**Description:** Allow users to adjust Arabic text font size with options: Small, Medium (default), Large.

**Acceptance Criteria:**
- [ ] Three options: Small, Medium, Large
- [ ] Changes apply to Arabic text in the reading view
- [ ] Preview of the size shown in settings (sample Arabic text)
- [ ] Preference persists across sessions
- [ ] Medium is the default for new users

**Complexity:** S

---

### Story 7.4: Implement Reset Progress

**Description:** Add a "Reset All Progress" option in Settings that clears streaks, reading history, bookmarks, and goals. Requires double confirmation.

**Acceptance Criteria:**
- [ ] "Reset Progress" button in the Data section of Settings
- [ ] First tap shows a confirmation dialog with warning text
- [ ] Second confirmation actually clears the data
- [ ] Clears: streaks, reading history, bookmarks, daily goal progress
- [ ] Does NOT clear: theme, font size, reciter (aesthetic preferences preserved)
- [ ] After reset, user is redirected to Home with fresh state

**Complexity:** S

---

## Epic 8: Responsive Design and Polish

**Goal:** Ensure the entire app works beautifully across mobile, tablet, and desktop. Add animations, micro-interactions, and final polish.

**Dependencies:** All other epics (this is the polish pass).

---

### Story 8.1: Implement Responsive Navigation

**Description:** Build the navigation system: bottom tab bar on mobile, left sidebar on tablet/desktop. Smooth transitions on Reading View (collapse to minimal top bar).

**Acceptance Criteria:**
- [ ] Mobile (< 640px): Bottom tab bar with 4 tabs (Home, Surahs, Progress, Settings)
- [ ] Tablet (640-1024px): Collapsible left sidebar
- [ ] Desktop (> 1024px): Persistent left sidebar
- [ ] Reading View: Navigation collapses to a minimal top bar with back button and mode switcher
- [ ] Active tab/page highlighted in navigation
- [ ] Navigation transitions are smooth (no layout jumps)

**Complexity:** L

---

### Story 8.2: Mobile Optimization Pass

**Description:** Review and optimize all pages for mobile viewport (< 640px). Ensure touch targets, text sizing, scrolling, and layout work correctly.

**Acceptance Criteria:**
- [ ] All interactive elements have minimum 44x44px touch targets
- [ ] No horizontal overflow/scrolling on any page
- [ ] Text is readable without zooming
- [ ] Audio player does not cover content on small screens
- [ ] Surah index cards are tap-friendly on mobile
- [ ] Reading view has comfortable line height and margins

**Complexity:** M

---

### Story 8.3: Tablet and Desktop Optimization

**Description:** Optimize layouts for larger screens. Reading view should have a max content width. Study mode should leverage extra space for side-by-side layout.

**Acceptance Criteria:**
- [ ] Reading view content max-width: 720px, centered
- [ ] Study mode on tablet/desktop: side-by-side Arabic and translation or tafsir panel
- [ ] Surah index uses multi-column grid on desktop
- [ ] Progress dashboard uses card grid on desktop
- [ ] No wasted space on large screens (layouts fill meaningfully)

**Complexity:** M

---

### Story 8.4: Add Micro-Interactions and Animations

**Description:** Add polish animations: page transitions, mode switching, streak celebrations, bookmark feedback, audio highlight transitions, and loading skeletons.

**Acceptance Criteria:**
- [ ] Page transitions use fade or slide (200ms)
- [ ] Mode switch animates color/layout changes (200ms)
- [ ] Streak milestone triggers a celebratory animation (confetti or glow)
- [ ] Bookmark toggle has a tactile animation (scale + color)
- [ ] Loading states use skeleton screens (not spinners) for content areas
- [ ] All animations respect `prefers-reduced-motion` media query

**Complexity:** M

---

### Story 8.5: Accessibility Audit and Fixes

**Description:** Conduct an accessibility audit against WCAG 2.1 AA. Fix all issues found. Verify keyboard navigation and screen reader compatibility.

**Acceptance Criteria:**
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text, 3:1 for large text)
- [ ] All interactive elements focusable and operable via keyboard
- [ ] Focus indicators visible on all interactive elements
- [ ] ARIA labels on: audio controls, mode switcher, navigation, bookmark buttons
- [ ] Semantic HTML used throughout (headings, landmarks, lists)
- [ ] Lighthouse accessibility score > 90

**Complexity:** M

---

### Story 8.6: Performance Optimization

**Description:** Optimize bundle size, lazy loading, and rendering performance. Target Lighthouse performance score > 90.

**Acceptance Criteria:**
- [ ] Route-based code splitting implemented (each page lazy-loaded)
- [ ] Quran data loaded per-surah (not all at once)
- [ ] Images and fonts optimized (compressed, correct formats)
- [ ] Initial bundle < 500KB gzipped (excluding Quran data)
- [ ] No unnecessary re-renders in reading view (verified with React DevTools)
- [ ] Lighthouse performance score > 90

**Complexity:** M

---

## Summary

| Epic | Stories | Total Complexity |
|------|---------|-----------------|
| 1. Project Setup and Infrastructure | 6 | 4S + 1M = ~8 days |
| 2. Quran Data Layer | 4 | 4M = ~16 days |
| 3. Surah Index and Navigation | 3 | 2S + 1M = ~7 days |
| 4. Reading View | 8 | 2S + 4M + 2L = ~34 days |
| 5. Audio Recitation | 5 | 1S + 4M = ~18 days |
| 6. Engagement System | 7 | 3S + 2M + 1L = ~18 days |
| 7. Settings and Preferences | 4 | 3S + 1M = ~9 days |
| 8. Responsive Design and Polish | 6 | 4M + 1L = ~26 days |
| **Total** | **43 stories** | **~136 dev days** |

---

## Recommended Sprint Plan (2-week sprints, 1 developer)

| Sprint | Epics / Focus | Goal |
|--------|--------------|------|
| Sprint 1 | Epic 1 + Epic 2 | Foundation: project running, data loaded and accessible |
| Sprint 2 | Epic 3 + Epic 4 (Stories 4.1-4.4) | Core reading: browse surahs, read Arabic + translation |
| Sprint 3 | Epic 4 (Stories 4.5-4.8) + Epic 5 | Reading polish + audio playback |
| Sprint 4 | Epic 6 | Engagement: streaks, daily ayah, goals, progress |
| Sprint 5 | Epic 7 + Epic 8 (Stories 8.1-8.3) | Settings + responsive layouts |
| Sprint 6 | Epic 8 (Stories 8.4-8.6) + Bug fixes | Polish, accessibility, performance, QA |

**Estimated total: 6 sprints / 12 weeks for 1 developer**

---

## Critical Path

The longest dependency chain determines the minimum timeline:

```
Epic 1 (Setup) --> Epic 2 (Data) --> Epic 4 (Reading View) --> Epic 5 (Audio) --> Epic 8 (Polish)
     S1                S1                  S2-S3                   S3              S5-S6
```

**Parallel tracks:**
- Epic 3 (Surah Index) can run in parallel with late Epic 2 work
- Epic 6 (Engagement) can start as soon as Epic 4 is partially done
- Epic 7 (Settings) can run in parallel with Epic 6

---

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| Arabic RTL rendering issues | High | Medium | Spike on RTL rendering in Sprint 1; test with complex ayahs early |
| Audio CDN reliability | Medium | Medium | Use multiple CDN sources; graceful error handling if audio fails |
| Quran data accuracy | High | Low | Use established, verified sources; manual spot-check across surahs |
| IndexedDB browser inconsistencies | Medium | Low | localStorage fallback already planned; test on Safari early |
| Bundle size with full Quran data | Medium | Medium | Per-surah lazy loading; measure in Sprint 1 spike |
| Tafsir data availability (English) | Medium | Medium | Identify source in Sprint 1; if unavailable, descope to V2 |

---

*Document generated by John (Product Manager) and Bob (Scrum Master) based on the approved design document and PRD.*
