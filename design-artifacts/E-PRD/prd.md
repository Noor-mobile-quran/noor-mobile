# Noor — Quran Content Hub: Product Requirements Document

**Version:** 1.0 (MVP)
**Date:** 2026-03-24
**Authors:** John (Product Manager), Bob (Scrum Master)
**Status:** Draft
**Source:** [Design Document](/docs/plans/2026-03-24-noor-quran-app-design.md)

---

## 1. Product Overview

Noor is a browser-based Quran content hub designed to provide a beautiful, immersive reading and listening experience with engagement mechanics that encourage daily interaction with the Quran. The app serves all age groups and prioritizes accessibility, performance, and reverence for the content.

The MVP delivers a fully functional Quran reader with Arabic text, English translation, audio recitation, and a lightweight engagement system (streaks, progress, daily ayah) — all running as a static web app with zero backend dependency.

### 1.1 Target Audience

- Muslims of all age groups seeking daily Quran engagement
- New readers looking for an approachable, guided experience
- Students who need tafsir (commentary) alongside verses
- Anyone wanting a distraction-free Quran reading environment

### 1.2 Platform

Responsive web application. Desktop, tablet, and mobile browsers. Deployed as a static site (Vercel or Netlify).

### 1.3 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vite + React + TypeScript |
| Styling | Tailwind CSS |
| Data | Local bundled JSON (Quran text, translations, tafsir) |
| User State | IndexedDB (progress, streaks, bookmarks, settings) |
| Deployment | Static hosting (Vercel / Netlify) |

---

## 2. Goals and Objectives

### 2.1 Product Goals

| # | Goal | Success Metric |
|---|------|---------------|
| G1 | Deliver a complete Quran reading experience | User can read all 114 surahs with Arabic text and English translation |
| G2 | Drive daily return visits through engagement hooks | 40%+ of active users maintain a 7-day streak within first month |
| G3 | Provide an immersive, distraction-free experience | Session duration averages 5+ minutes |
| G4 | Work offline-first with zero backend dependency | App loads and functions fully from local/bundled data |
| G5 | Support RTL Arabic text rendering correctly | Zero layout-breaking issues in Arabic text display |

### 2.2 Business Objectives

- Establish Noor as a high-quality, free Quran web app
- Build an engaged user base before expanding to V2 features (community, audio library, multi-language)
- Validate engagement mechanics (streaks, daily ayah) as retention drivers

---

## 3. User Stories (Key)

| ID | As a... | I want to... | So that... |
|----|---------|-------------|-----------|
| US-01 | Reader | Browse all 114 surahs in an organized index | I can find and navigate to any surah quickly |
| US-02 | Reader | Read Arabic text alongside English translation | I can understand what I am reading |
| US-03 | Reader | Listen to audio recitation of any ayah or surah | I can hear the correct pronunciation and follow along |
| US-04 | Reader | See a daily featured ayah on the home screen | I am inspired each time I open the app |
| US-05 | Reader | Track my reading streak | I stay motivated to read every day |
| US-06 | Reader | Set and track daily reading goals | I can build a consistent reading habit |
| US-07 | Reader | Bookmark verses and access them later | I can revisit meaningful verses |
| US-08 | Reader | Continue reading from where I left off | I do not lose my place |
| US-09 | Reader | Switch between Serene, Immersive, and Study modes | I get the right experience for my current context |
| US-10 | Reader | View tafsir (commentary) for any verse | I can understand the deeper meaning |
| US-11 | Reader | Search for a specific surah by name or number | I can jump directly to what I need |
| US-12 | Reader | View my overall progress (juz, surah completion) | I can see how far I have come |
| US-13 | Reader | Choose my preferred reciter | I listen to the voice I find most beautiful |
| US-14 | Reader | Toggle between light and dark themes | I can read comfortably in any lighting |
| US-15 | Reader | Use the app on my phone, tablet, or desktop | I can read on any device I have |

---

## 4. Functional Requirements

### 4.1 Home Page

| ID | Requirement | Priority |
|----|------------|----------|
| FR-01 | Display a "Daily Ayah" — a different featured verse each day with Arabic text and translation | Must Have |
| FR-02 | Show current streak counter (consecutive days of reading) | Must Have |
| FR-03 | Display "Continue Reading" card with last-read surah/ayah and one-tap resume | Must Have |
| FR-04 | Show quick action buttons: Browse Surahs, Bookmarks, Progress | Must Have |
| FR-05 | Display daily reading goal progress (e.g., "3 of 10 ayahs today") | Should Have |

### 4.2 Surah Index

| ID | Requirement | Priority |
|----|------------|----------|
| FR-06 | List all 114 surahs with: number, Arabic name, English name, revelation type (Meccan/Medinan), ayah count | Must Have |
| FR-07 | Search/filter surahs by name (Arabic or English) or number | Must Have |
| FR-08 | Filter by revelation type (Meccan / Medinan) | Should Have |
| FR-09 | Sort by surah number (default) or alphabetically | Should Have |
| FR-10 | Tap a surah to navigate to its Reading View | Must Have |

### 4.3 Reading View

| ID | Requirement | Priority |
|----|------------|----------|
| FR-11 | Display Arabic text for each ayah in proper RTL rendering with appropriate calligraphic font | Must Have |
| FR-12 | Display English translation below each ayah | Must Have |
| FR-13 | Toggle tafsir (commentary) panel for any ayah | Must Have |
| FR-14 | Navigate between surahs (previous/next) | Must Have |
| FR-15 | Scroll to any ayah within the surah via ayah number selector | Should Have |
| FR-16 | Bookmark any individual ayah | Must Have |
| FR-17 | Auto-save reading position on navigate-away or close | Must Have |
| FR-18 | Support three UX modes (see Section 7) | Must Have |
| FR-19 | Display Bismillah at surah start (except Surah 9) | Must Have |

### 4.4 Audio Recitation

| ID | Requirement | Priority |
|----|------------|----------|
| FR-20 | Play audio recitation for individual ayahs | Must Have |
| FR-21 | Play continuous recitation for an entire surah | Must Have |
| FR-22 | Audio player controls: play/pause, previous ayah, next ayah, progress bar | Must Have |
| FR-23 | Highlight the currently playing ayah in the reading view | Should Have |
| FR-24 | Support at least one default reciter (e.g., Mishary Rashid Alafasy) | Must Have |
| FR-25 | Allow reciter selection from settings (MVP: 2-3 reciters) | Should Have |

### 4.5 Engagement System

| ID | Requirement | Priority |
|----|------------|----------|
| FR-26 | Track daily streak — increment on any reading activity, reset after missed day | Must Have |
| FR-27 | Display streak counter prominently on home page | Must Have |
| FR-28 | Configurable daily reading goal (number of ayahs per day, default: 10) | Must Have |
| FR-29 | Track and display daily goal progress | Must Have |
| FR-30 | Track surah completion percentage | Should Have |
| FR-31 | Track juz completion percentage | Should Have |
| FR-32 | Maintain reading history (list of recently read surahs/ayahs with timestamps) | Must Have |
| FR-33 | Bookmark management: view all bookmarks, remove bookmarks | Must Have |

### 4.6 Settings and Preferences

| ID | Requirement | Priority |
|----|------------|----------|
| FR-34 | Theme toggle: Light / Dark / System default | Must Have |
| FR-35 | Translation language selection (MVP: English only, architecture should support more) | Must Have |
| FR-36 | Reciter selection | Should Have |
| FR-37 | Daily reading goal configuration | Must Have |
| FR-38 | Font size adjustment for Arabic text | Should Have |
| FR-39 | Reset progress option with confirmation | Should Have |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|----|------------|--------|
| NFR-01 | Initial page load (Lighthouse) | < 2 seconds on 4G |
| NFR-02 | Surah data load time | < 500ms (local JSON) |
| NFR-03 | Page transitions | < 300ms perceived |
| NFR-04 | Bundle size (initial) | < 500KB gzipped (excluding Quran data) |
| NFR-05 | Quran JSON data | Lazy-load per surah, not all at once |

### 5.2 Accessibility

| ID | Requirement |
|----|------------|
| NFR-06 | WCAG 2.1 AA compliance for color contrast |
| NFR-07 | Keyboard navigable — all interactive elements reachable via Tab/Enter |
| NFR-08 | Screen reader compatible — semantic HTML, ARIA labels on controls |
| NFR-09 | Minimum touch target size of 44x44px on mobile |

### 5.3 RTL and Internationalization

| ID | Requirement |
|----|------------|
| NFR-10 | Arabic text rendered RTL with correct shaping and ligatures |
| NFR-11 | Mixed-direction layout support (Arabic RTL content within LTR app shell) |
| NFR-12 | Arabic font loaded and rendered without FOUT (Flash of Unstyled Text) |
| NFR-13 | Architecture supports adding translation languages in future versions |

### 5.4 Browser Support

| ID | Requirement |
|----|------------|
| NFR-14 | Chrome (latest 2 versions) |
| NFR-15 | Safari (latest 2 versions, including iOS Safari) |
| NFR-16 | Firefox (latest 2 versions) |
| NFR-17 | Edge (latest 2 versions) |

### 5.5 Reliability

| ID | Requirement |
|----|------------|
| NFR-18 | App functions fully without network after initial load |
| NFR-19 | User data (bookmarks, streaks, progress) persists across sessions via IndexedDB |
| NFR-20 | Graceful degradation if IndexedDB is unavailable (fallback to localStorage) |

---

## 6. Data Requirements

### 6.1 Quran Data Structure (JSON)

```typescript
interface Surah {
  number: number;              // 1-114
  name_arabic: string;         // e.g., "الفاتحة"
  name_english: string;        // e.g., "Al-Fatihah"
  name_translation: string;    // e.g., "The Opening"
  revelation_type: "meccan" | "medinan";
  ayah_count: number;
  ayahs: Ayah[];
}

interface Ayah {
  number: number;              // Ayah number within surah
  number_in_quran: number;     // Global ayah number (1-6236)
  text_arabic: string;         // Arabic text
  text_translation: string;    // English translation
  tafsir: string;              // Commentary text
  audio_url: string;           // URL to audio recitation file
  juz: number;                 // Juz number (1-30)
  page: number;                // Mushaf page number
}
```

### 6.2 User State Structure (IndexedDB)

```typescript
interface UserState {
  streaks: {
    current: number;
    longest: number;
    last_read_date: string;    // ISO date
  };
  daily_goal: {
    target_ayahs: number;      // Default: 10
    read_today: number;
  };
  last_read: {
    surah: number;
    ayah: number;
    timestamp: string;
  };
  bookmarks: Bookmark[];
  reading_history: HistoryEntry[];
  settings: UserSettings;
}

interface Bookmark {
  surah: number;
  ayah: number;
  created_at: string;
  note?: string;               // Optional note (Study mode)
}

interface HistoryEntry {
  surah: number;
  ayah: number;
  timestamp: string;
}

interface UserSettings {
  theme: "light" | "dark" | "system";
  translation: string;         // Language code, default: "en"
  reciter: string;             // Reciter ID
  font_size: "small" | "medium" | "large";
  ux_mode: "serene" | "immersive" | "study";
}
```

### 6.3 Data Sourcing

| Data | Source | Format |
|------|--------|--------|
| Arabic text | quran.com API or Tanzil.net export | JSON |
| English translation | Sahih International (public domain) | JSON |
| Tafsir | Ibn Kathir (abridged, English) | JSON |
| Audio | EveryAyah.com or mp3quran.net CDN URLs | External URLs |

---

## 7. UI Requirements

### 7.1 Three UX Modes

| Mode | Purpose | Characteristics |
|------|---------|----------------|
| **Serene** | Calm, focused reading | Light warm tones, generous whitespace, minimal UI, large Arabic font, translation below |
| **Immersive** | Audio-centric / dark reading | Dark background, gold accents, audio player prominent, verse highlighting synced to audio |
| **Study** | Deep learning | Side-by-side Arabic + translation, tafsir panel visible, bookmarks and notes accessible, compact layout |

### 7.2 Design System

| Element | Specification |
|---------|--------------|
| Primary palette | Warm earth tones: deep green (#1B4332), gold (#D4A843), cream (#FDF6E3) |
| Dark mode palette | Charcoal (#1A1A2E), midnight blue (#16213E), gold accents (#D4A843) |
| Arabic font | Amiri or KFGQPC Uthmanic Script (web font) |
| Latin font | Inter or equivalent sans-serif |
| Border radius | 8px (cards), 12px (modals) |
| Spacing scale | Tailwind default (4px base) |
| Transitions | 200ms ease-in-out for mode switches and page transitions |

### 7.3 Responsive Breakpoints

| Breakpoint | Target | Layout Notes |
|-----------|--------|-------------|
| < 640px | Mobile | Single column, bottom nav, stacked Arabic/translation |
| 640-1024px | Tablet | Two-column possible in Study mode, side nav |
| > 1024px | Desktop | Full layout with sidebar navigation, comfortable reading width (max 720px for text) |

### 7.4 Navigation

- **Mobile:** Bottom tab bar (Home, Surahs, Progress, Settings)
- **Tablet/Desktop:** Left sidebar navigation
- **Reading View:** Minimal chrome — nav collapses to a top bar with back button and mode switcher

---

## 8. Engagement System Requirements

### 8.1 Streak System

| Rule | Detail |
|------|--------|
| Increment | Any reading activity (opening a surah and reading at least 1 ayah) counts as a day |
| Reset | If no reading activity is recorded for a calendar day, streak resets to 0 the following day |
| Streak persistence | Stored in IndexedDB, keyed to last_read_date |
| Visual | Flame/fire icon with counter on home page; animation on streak milestone (7, 30, 100 days) |
| Grace period | None in V1 (consider for V2) |

### 8.2 Daily Reading Goal

| Rule | Detail |
|------|--------|
| Default | 10 ayahs per day |
| Configurable | User can set 1-50 ayahs per day in Settings |
| Tracking | Each ayah scrolled into view and visible for 3+ seconds counts as "read" |
| Progress display | Circular progress indicator on home page |
| Reset | Daily goal progress resets at midnight local time |

### 8.3 Progress Tracking

| Metric | Calculation |
|--------|------------|
| Surah completion | % of ayahs read in each surah (based on reading history) |
| Juz completion | % of ayahs read in each juz |
| Total progress | Total unique ayahs read / 6236 |
| Bookmarks | Count of saved bookmarks |

---

## 9. Out of Scope (V1 Exclusions)

The following are explicitly NOT part of V1/MVP:

- User accounts / authentication / cloud sync
- Social features (sharing, community)
- Multiple translation languages (architecture supports it, but V1 is English only)
- Word-by-word translation / transliteration
- Tajweed color-coded text
- Push notifications
- Offline audio caching
- Notes and annotations beyond bookmarks
- Prayer time integration
- Qibla compass
- Dua / Hadith content
- Native mobile apps (iOS/Android)
- Monetization features
- Admin panel / CMS

---

## 10. Acceptance Criteria

The MVP is considered complete when ALL of the following are true:

### 10.1 Core Reading

- [ ] User can browse all 114 surahs in the index page
- [ ] User can search surahs by name (Arabic or English)
- [ ] User can read any surah with Arabic text and English translation displayed correctly
- [ ] Arabic text renders RTL without layout issues
- [ ] User can toggle tafsir for any ayah
- [ ] User can navigate between surahs (previous/next)

### 10.2 Audio

- [ ] User can play audio for an individual ayah
- [ ] User can play continuous audio for a full surah
- [ ] Audio player has play/pause, skip, and progress controls
- [ ] Currently playing ayah is visually highlighted

### 10.3 Engagement

- [ ] Daily streak increments correctly on reading activity
- [ ] Streak resets correctly after a missed day
- [ ] Daily ayah displays a different verse each day on home page
- [ ] User can set and track a daily reading goal
- [ ] Progress dashboard shows surah completion percentages
- [ ] Reading position is auto-saved and restorable

### 10.4 User Preferences

- [ ] User can bookmark/unbookmark individual ayahs
- [ ] User can view and manage all bookmarks
- [ ] User can switch between Light and Dark themes
- [ ] User can switch between Serene, Immersive, and Study modes
- [ ] User can adjust Arabic font size
- [ ] All settings persist across sessions

### 10.5 Quality

- [ ] App loads in under 2 seconds on 4G
- [ ] Responsive layout works correctly on mobile (< 640px), tablet (640-1024px), and desktop (> 1024px)
- [ ] No console errors in normal usage flows
- [ ] Lighthouse performance score > 90
- [ ] Lighthouse accessibility score > 90

---

*Document generated by John (Product Manager) and Bob (Scrum Master) based on the approved design document.*
