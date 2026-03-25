# Noor — Quran Content Hub Design Document

**Date:** 2026-03-24
**Status:** Approved
**Author:** Safwan + BMAD Party Mode Team

## Vision

A beautiful, immersive Quran-focused web app with addictive daily engagement hooks that keeps users connected to the Quran every day.

## Core Product

| Aspect | Decision |
|--------|----------|
| **Product** | Quran-focused Islamic content hub |
| **Core Content** | Quran verses, translations, tafsir (commentary), audio recitation |
| **Audience** | All age groups — universal |
| **UX Modes** | Serene (reading) + Immersive (listening/dark) + Study (notes/bookmarks) |
| **Engagement** | Daily streaks, reading goals, progress tracking, daily ayah |
| **Platform** | Responsive web app (browser-based) |
| **Data** | Local/bundled JSON |

## Tech Stack

- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Data:** Local bundled JSON (Quran text, translations, tafsir)
- **Storage:** localStorage / IndexedDB (user progress, streaks, bookmarks)
- **Deployment:** Static hosting (Vercel/Netlify)

## Key Pages

1. **Home** — Daily ayah, streak counter, continue reading, quick actions
2. **Surah Index** — Browse all 114 surahs with search & filters
3. **Reading View** — Arabic text + translation + tafsir + audio player
4. **Progress Dashboard** — Streaks, completion stats, bookmarks, history
5. **Settings** — Translation language, reciter selection, theme toggle

## Design Direction

- Arabic calligraphy-inspired typography
- Warm earthy/gold tones with dark mode immersive option
- Clean minimalist layout with generous whitespace
- Three UX modes: Serene, Immersive, Study
- Smooth transitions and micro-interactions

## Engagement Hooks

- **Daily streak counter** — consecutive days of reading
- **Daily Ayah** — featured verse on home screen each day
- **Reading goals** — configurable daily ayah/page targets
- **Progress tracker** — Juz and Surah completion visualization
- **Bookmarks & favorites** — save and revisit meaningful verses
- **Reading history** — pick up where you left off

## Data Model

```
Surah (114)
  ├── number, name (Arabic + English), revelation_type, ayah_count
  └── Ayah[]
        ├── number, text_arabic, text_translation, tafsir
        └── audio_url (recitation)

UserProgress (IndexedDB)
  ├── streaks, last_read_date
  ├── bookmarks[], favorites[]
  ├── reading_history[]
  └── settings (theme, translation, reciter)
```
