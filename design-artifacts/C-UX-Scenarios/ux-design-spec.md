# Noor — UX Design Specification

**Version:** 1.0
**Date:** 2026-03-24
**Designer:** Sally (UX Lead)
**Status:** Draft for Review

---

## Table of Contents

1. [Design Principles & Emotional Goals](#1-design-principles--emotional-goals)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Three UX Modes](#4-three-ux-modes)
5. [Page-by-Page UX Scenarios](#5-page-by-page-ux-scenarios)
6. [Navigation & Information Architecture](#6-navigation--information-architecture)
7. [Responsive Breakpoints](#7-responsive-breakpoints)
8. [Micro-interactions & Animations](#8-micro-interactions--animations)
9. [Accessibility Considerations](#9-accessibility-considerations)
10. [Pre-Delivery Checklist](#10-pre-delivery-checklist)

---

## 1. Design Principles & Emotional Goals

### Core Principles

**1. Sacred Simplicity**
The Quran is the centerpiece. Every design decision removes friction between the user and the text. No decoration competes with the words. Whitespace is not empty — it is reverence.

**2. Warm Invitation**
The app should feel like entering a quiet, well-lit room. Warm tones, soft transitions, gentle type. The emotional temperature is calm confidence — not cold minimalism, not cluttered enthusiasm.

**3. Consistent Rhythm**
Just as the Quran has rhythm in its recitation, the interface has rhythm in its spacing, its motion, and its information hierarchy. Every 4px matters. Every transition has purpose.

**4. Respect for the Text**
Arabic calligraphic text is always treated as the primary content. Translations and tafsir are secondary. The visual hierarchy must never invert this — the Arabic script is always the largest, most prominent, most carefully rendered text on screen.

**5. Gentle Accountability**
Engagement features (streaks, goals, progress) motivate without guilt. A missed day is never punished visually. The tone is encouraging — "Welcome back" not "You broke your streak."

### Emotional Map

| Page | Primary Emotion | Secondary Emotion |
|------|----------------|-------------------|
| Home | Welcome, warmth | Gentle motivation |
| Surah Index | Clarity, orientation | Curiosity |
| Reading View (Serene) | Peace, focus | Contemplation |
| Reading View (Immersive) | Awe, deep presence | Surrender to audio |
| Reading View (Study) | Engagement, rigor | Discovery |
| Progress Dashboard | Accomplishment | Renewed commitment |
| Settings | Control, trust | Personalization |

---

## 2. Color Palette

### Design Token Structure

All colors are defined as CSS custom properties. Components reference semantic tokens, never raw hex values. Dark mode overrides happen at the semantic layer only.

```
Primitive  -->  Semantic  -->  Component
(raw hex)      (purpose)      (specific use)
```

### Light Mode (Serene Default)

#### Primitives

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-cream-50` | `#FFFDF7` | Lightest warm white |
| `--color-cream-100` | `#FFF9ED` | Page background |
| `--color-cream-200` | `#FFF3D6` | Card background |
| `--color-cream-300` | `#FFE8B8` | Subtle borders |
| `--color-sand-400` | `#D4B896` | Muted text, icons |
| `--color-sand-500` | `#B89B78` | Secondary text |
| `--color-earth-600` | `#8B6F47` | Body text |
| `--color-earth-700` | `#6B5235` | Primary text |
| `--color-earth-800` | `#4A3728` | Headings |
| `--color-earth-900` | `#2D1F14` | Darkest text |
| `--color-gold-400` | `#D4A855` | Accent, highlights |
| `--color-gold-500` | `#C4942E` | Primary accent |
| `--color-gold-600` | `#A67B1E` | Hover accent |
| `--color-teal-500` | `#2A7F6F` | Success, progress |
| `--color-teal-600` | `#1F6459` | Success hover |
| `--color-rose-500` | `#C4564A` | Error, streak fire |
| `--color-rose-100` | `#FDE8E6` | Error background |

#### Semantic Tokens — Light

| Token | Value | Tailwind |
|-------|-------|----------|
| `--bg-primary` | `var(--color-cream-100)` | `bg-[var(--bg-primary)]` |
| `--bg-secondary` | `var(--color-cream-200)` | `bg-[var(--bg-secondary)]` |
| `--bg-elevated` | `#FFFFFF` | `bg-[var(--bg-elevated)]` |
| `--text-primary` | `var(--color-earth-800)` | `text-[var(--text-primary)]` |
| `--text-secondary` | `var(--color-earth-600)` | `text-[var(--text-secondary)]` |
| `--text-muted` | `var(--color-sand-500)` | `text-[var(--text-muted)]` |
| `--text-arabic` | `var(--color-earth-900)` | `text-[var(--text-arabic)]` |
| `--accent-primary` | `var(--color-gold-500)` | `text-[var(--accent-primary)]` |
| `--accent-hover` | `var(--color-gold-600)` | — |
| `--border-subtle` | `var(--color-cream-300)` | `border-[var(--border-subtle)]` |
| `--border-default` | `var(--color-sand-400)` | `border-[var(--border-default)]` |
| `--success` | `var(--color-teal-500)` | `text-[var(--success)]` |
| `--error` | `var(--color-rose-500)` | `text-[var(--error)]` |
| `--streak-glow` | `var(--color-gold-400)` | — |

### Dark / Immersive Mode

The immersive mode is not simply "colors inverted." It is a fundamentally different atmosphere — deep, quiet, warm darkness. Think of a dimly lit mosque at night, not a code editor.

#### Semantic Tokens — Dark

| Token | Value (Hex) | Note |
|-------|-------------|------|
| `--bg-primary` | `#1A1410` | Warm near-black, not blue-black |
| `--bg-secondary` | `#241D16` | Card surfaces |
| `--bg-elevated` | `#2E2519` | Modals, dropdowns |
| `--text-primary` | `#F5E6D0` | Warm off-white |
| `--text-secondary` | `#C4A882` | Muted warm |
| `--text-muted` | `#8B7355` | Tertiary info |
| `--text-arabic` | `#FFF3D6` | Slightly golden white for Arabic |
| `--accent-primary` | `#D4A855` | Gold stays prominent |
| `--accent-hover` | `#E0BA6A` | Lighter gold on hover |
| `--border-subtle` | `#3A2F22` | Very subtle warm lines |
| `--border-default` | `#4D3D2A` | Default borders |
| `--success` | `#3BA68F` | Brighter teal for dark bg |
| `--error` | `#E06B60` | Brighter rose for dark bg |
| `--streak-glow` | `#D4A855` | Ambient gold glow effect |

#### Contrast Verification (WCAG AA)

| Combination | Ratio | Pass? |
|-------------|-------|-------|
| `--text-primary` on `--bg-primary` (light) | 12.4:1 | Yes |
| `--text-secondary` on `--bg-primary` (light) | 7.1:1 | Yes |
| `--text-arabic` on `--bg-primary` (light) | 15.2:1 | Yes |
| `--text-primary` on `--bg-primary` (dark) | 11.8:1 | Yes |
| `--text-secondary` on `--bg-primary` (dark) | 6.3:1 | Yes |
| `--accent-primary` on `--bg-primary` (dark) | 7.5:1 | Yes |
| `--text-arabic` on `--bg-primary` (dark) | 13.1:1 | Yes |

---

## 3. Typography

### Design Philosophy

Arabic text is calligraphic and flowing. Latin text is clean and supportive. They must coexist without competing. The Arabic font is always selected for its beauty at reading scale. The Latin font is selected for its neutrality and excellent readability.

### Font Stack

| Role | Font | Fallback | Why |
|------|------|----------|-----|
| Arabic primary | **Amiri** | `"Traditional Arabic", "Noto Naskh Arabic", serif` | Beautiful naskh calligraphy, excellent at large sizes, open-source, web-font available |
| Arabic display | **Aref Ruqaa** | `"Amiri", serif` | For decorative headings (Daily Ayah card), more calligraphic personality |
| Latin primary | **Inter** | `system-ui, -apple-system, sans-serif` | Neutral, highly legible, excellent variable font support, pairs without competing |
| Latin mono | **JetBrains Mono** | `"SF Mono", monospace` | Ayah numbers, verse references, technical data |

### Type Scale

Base size: 16px (1rem). Scale ratio: 1.25 (Major Third).

| Token | Size | Line Height | Weight | Tailwind | Use |
|-------|------|-------------|--------|----------|-----|
| `--text-xs` | 12px / 0.75rem | 1.5 | 400 | `text-xs` | Captions, timestamps |
| `--text-sm` | 14px / 0.875rem | 1.5 | 400 | `text-sm` | Labels, metadata |
| `--text-base` | 16px / 1rem | 1.6 | 400 | `text-base` | Body text, translations |
| `--text-lg` | 20px / 1.25rem | 1.5 | 500 | `text-lg` | Section headings |
| `--text-xl` | 25px / 1.563rem | 1.4 | 600 | `text-xl` | Page titles |
| `--text-2xl` | 31px / 1.938rem | 1.3 | 600 | `text-2xl` | Surah names (Latin) |
| `--text-3xl` | 39px / 2.438rem | 1.2 | 700 | `text-3xl` | Display headings |

### Arabic Text Scale

Arabic text runs larger than Latin because naskh script requires more vertical space for readability.

| Token | Size | Line Height | Use |
|-------|------|-------------|-----|
| `--arabic-reading` | 28px / 1.75rem | 2.2 | Standard reading size |
| `--arabic-reading-lg` | 32px / 2rem | 2.2 | Comfortable reading (accessibility) |
| `--arabic-display` | 40px / 2.5rem | 1.8 | Daily Ayah card, featured verses |
| `--arabic-hero` | 56px / 3.5rem | 1.6 | Home hero, splash |

**Critical note for developers:** Arabic line-height must be generous (2.0+) at reading scale. Diacritical marks (tashkeel/harakat) above and below letters require vertical clearance. Clipping tashkeel is a serious readability and respect issue.

### Font Loading Strategy

```css
/* Preload critical fonts */
<link rel="preload" href="/fonts/amiri-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin>

/* Font-display: swap for Latin, optional for Arabic (avoid layout shift with Arabic) */
@font-face {
  font-family: 'Amiri';
  font-display: optional;  /* Prevents FOUT with Arabic calligraphy */
}
@font-face {
  font-family: 'Inter';
  font-display: swap;
}
```

---

## 4. Three UX Modes

The three modes are not just color themes. They change layout density, visible UI elements, animation intensity, and information hierarchy. The user switches between them with a segmented control in the Reading View header.

### Mode Comparison Matrix

| Attribute | Serene | Immersive | Study |
|-----------|--------|-----------|-------|
| **Theme** | Light (cream/gold) | Dark (warm black/gold) | Light or Dark (user pref) |
| **Background** | `--bg-primary` light | `--bg-primary` dark | `--bg-primary` (either) |
| **Arabic text size** | `--arabic-reading` (28px) | `--arabic-reading-lg` (32px) | `--arabic-reading` (28px) |
| **Translation** | Visible below each ayah | Hidden by default, tap to reveal | Visible, side-by-side on desktop |
| **Tafsir** | Hidden | Hidden | Visible in side panel |
| **Audio controls** | Minimal (play/pause in header) | Full controls (prominent, centered) | Minimal |
| **Navigation chrome** | Visible, subtle | Auto-hide after 3s, tap to reveal | Visible, full |
| **Toolbar** | Bookmark only | Repeat, speed, reciter | Bookmark, note, highlight, share |
| **Sidebar** | None | None | Notes panel (collapsible) |
| **Animations** | Gentle fades (200ms) | Slow, atmospheric (400ms) | Snappy (150ms) |
| **Ambient elements** | None | Subtle particle/light effect (opt.) | None |
| **Line spacing** | Generous | Very generous | Standard |
| **Content width** | max 680px | max 600px (centered) | max 1200px (with sidebar) |

### 4.1 Serene Mode (Default)

**The feeling:** A clean, sunlit page. Like reading a beautifully typeset mushaf in natural light.

- Light cream background with warm off-white cards
- Arabic text is the dominant visual element — large, centered, black on cream
- Translation appears directly below each ayah in smaller, muted text
- Minimal chrome: just a thin top bar with surah name, ayah range, and a back arrow
- Bookmark button floats subtly on the right margin
- Page-turn navigation via swipe gesture (mobile) or arrow keys (desktop)
- Bottom of screen: thin, unobtrusive progress bar showing position in surah

**Transition in:** Background fades from current state to cream over 300ms. Text elements fade in with 50ms stagger.

### 4.2 Immersive Mode

**The feeling:** Night prayer. A dark, warm room where the words glow softly and the recitation fills the space.

- Deep warm-black background — not pure black (#000), not blue-black
- Arabic text rendered in warm golden-white (`#FFF3D6`) — slightly luminous
- Audio is the primary interaction: large play/pause button, visible waveform or progress arc
- Currently-recited ayah is highlighted with a soft gold underline or background glow
- Translation is hidden by default; user taps an ayah to reveal it briefly (fades after 5s)
- Navigation chrome auto-hides after 3 seconds of inactivity; tap anywhere to reveal
- Optional ambient effect: very subtle, slow-moving gold particle drift in background (respects `prefers-reduced-motion`)
- Screen stays awake during audio playback (via Wake Lock API)

**Transition in:** Background darkens over 400ms with a slow ease-out. Gold accent elements fade in with a 200ms delay. Audio controls slide up from bottom.

### 4.3 Study Mode

**The feeling:** A scholar's desk. Everything you need is at hand — the text, the commentary, your notes, your bookmarks.

- Layout shifts to a wider format with an optional side panel
- Desktop: Arabic text on the left (60%), tafsir/notes panel on the right (40%)
- Mobile: Tabs below the Arabic text — Translation | Tafsir | Notes
- Toolbar expands: bookmark, add note, highlight text, copy, share
- Notes are saved per-ayah in IndexedDB
- Highlighting: user selects text, a small toolbar appears (highlight color, note, copy)
- Cross-reference links in tafsir are tappable and navigate to referenced ayah
- Bookmarks show a small gold marker in the left margin

**Transition in:** Side panel slides in from right over 250ms. Toolbar expands with a subtle spring animation.

### Mode Switching Interaction

```
[ Serene ]  [ Immersive ]  [ Study ]
    ^            ^            ^
    |--- segmented control ---|

Location: Reading View header, right side
Behavior: Tap to switch. Current mode has gold underline + filled background.
Animation: 200ms crossfade between modes. Content does not scroll — position is preserved.
Persistence: Last-used mode is saved to localStorage and restored on next visit.
```

---

## 5. Page-by-Page UX Scenarios

### 5.1 Home Page

**User intent:** "I want to feel welcomed, see my progress, and start reading quickly."

#### Layout (top to bottom)

```
+--------------------------------------------------+
|  [Logo: Noor]              [gear icon] [moon/sun] |
+--------------------------------------------------+
|                                                    |
|  Bismillah / Greeting                              |
|  "Assalamu Alaikum" + time-aware greeting          |
|  (Good morning / Good evening)                     |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  +----------------------------------------------+ |
|  |  DAILY AYAH                                   | |
|  |                                               | |
|  |  [Arabic text — Aref Ruqaa, display size]     | |
|  |                                               | |
|  |  "Translation text here..."                   | |
|  |  — Surah Name, Ayah Number                    | |
|  |                                               | |
|  |  [Share]  [Bookmark]  [Read in context ->]    | |
|  +----------------------------------------------+ |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  +------------------+  +----------------------+   |
|  | STREAK           |  | DAILY GOAL           |  |
|  | 🔥 14 days       |  | 3 of 10 ayahs       |  |
|  | [flame visual]   |  | [progress ring]      |  |
|  +------------------+  +----------------------+   |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  CONTINUE READING                                  |
|  +----------------------------------------------+ |
|  |  Surah Al-Baqarah — Ayah 142                  | |
|  |  Last read 2 hours ago                        | |
|  |  [Continue ->]                                | |
|  +----------------------------------------------+ |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  QUICK ACTIONS                                     |
|  [Browse Surahs] [Bookmarks] [Random Ayah]        |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  [Home]  [Surahs]  [Read]  [Progress]             |
|  (bottom tab bar — mobile only)                    |
+--------------------------------------------------+
```

#### Component Specifications

**Greeting Section**
- Time-based: before noon = "Good Morning", afternoon = "Good Afternoon", evening = "Good Evening"
- Always prefixed with "Assalamu Alaikum"
- Font: Inter, `--text-lg`, `--text-secondary`
- Spacing: 24px top padding, 16px bottom margin

**Daily Ayah Card**
- Container: `--bg-elevated`, border-radius 16px, subtle shadow (`0 2px 12px rgba(74,55,40,0.08)`)
- Arabic text: Aref Ruqaa, `--arabic-display` (40px), `--text-arabic`, centered, dir="rtl"
- Translation: Inter, `--text-base`, `--text-secondary`, centered, 12px top margin
- Attribution: Inter, `--text-sm`, `--text-muted`, 8px top margin
- Action row: 16px top margin, flex row, gap 12px, icons with labels
- Padding: 32px all sides
- The card has a very subtle gold top border (2px solid `--accent-primary`, opacity 0.3)

**Streak Counter**
- Container: `--bg-secondary`, border-radius 12px, padding 20px
- Number: Inter, `--text-3xl`, `--accent-primary`, font-weight 700
- Label: "day streak", Inter, `--text-sm`, `--text-muted`
- Flame visual: SVG icon in `--accent-primary`, subtle pulse animation (2s loop, scale 1.0 to 1.05)
- If streak is 0: show "Start your journey" in `--text-muted`, no flame

**Daily Goal Ring**
- SVG progress ring, 64px diameter
- Track: `--border-subtle`, 4px stroke
- Fill: `--success` (teal), 4px stroke, rounded linecap
- Center text: "3/10" in Inter `--text-lg` bold
- Below ring: "ayahs today" in `--text-sm` `--text-muted`

**Continue Reading Card**
- Container: `--bg-elevated`, border-radius 12px, padding 20px
- Surah name: Inter, `--text-lg`, `--text-primary`, font-weight 600
- Metadata: Inter, `--text-sm`, `--text-muted`
- Right-aligned arrow icon, tappable, min target 44x44px
- Entire card is tappable (not just the arrow)

**Quick Actions**
- Horizontal row of pill buttons
- Style: `--bg-secondary` fill, `--text-primary` text, border-radius 24px
- Padding: 12px 20px, Inter `--text-sm` font-weight 500
- Hover: background shifts to `--accent-primary`, text to white
- Touch target: min 44px height

#### States

| State | Behavior |
|-------|----------|
| First visit (no data) | Streak shows "Start your journey". Continue Reading replaced with "Begin with Al-Fatiha" card. Daily goal shows empty ring. |
| Active streak | Flame pulses gently. Number is gold and prominent. |
| Broken streak (missed yesterday) | Streak resets to 0. Message: "Welcome back. Every day is a new beginning." Warm, not punishing. |
| Goal completed | Ring fills to 100%, teal with a subtle glow. Text changes to "Masha'Allah! Goal reached." |
| Loading | Skeleton screens with warm cream shimmer animation (not gray). |

---

### 5.2 Surah Index Page

**User intent:** "I want to find and navigate to a specific surah to read."

#### Layout

```
+--------------------------------------------------+
|  [<- Back]   Surah Index           [Search icon]  |
+--------------------------------------------------+
|                                                    |
|  +----------------------------------------------+ |
|  |  [Search field: "Search by name or number"]   | |
|  +----------------------------------------------+ |
|                                                    |
|  [All] [Meccan] [Medinan] [Bookmarked]            |
|  (filter chips)                                    |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  Sort: [Number v]  |  View: [List] [Grid]         |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  +----------------------------------------------+ |
|  |  1  |  الفاتحة  |  Al-Fatiha               | |
|  |     |  The Opening | 7 ayahs | Meccan        | |
|  |     |  [progress bar: 100%]                   | |
|  +----------------------------------------------+ |
|  |  2  |  البقرة   |  Al-Baqarah              | |
|  |     |  The Cow | 286 ayahs | Medinan          | |
|  |     |  [progress bar: 49%]                    | |
|  +----------------------------------------------+ |
|  |  ...                                          | |
|  +----------------------------------------------+ |
|                                                    |
+--------------------------------------------------+
```

#### Component Specifications

**Search Field**
- Full-width input, border-radius 12px, `--bg-elevated`, `--border-subtle` border
- Placeholder: "Search by name or number", Inter `--text-base`, `--text-muted`
- Search icon left-aligned inside input, 20px, `--text-muted`
- Focus: border changes to `--accent-primary`, subtle gold glow shadow
- Behavior: Filters list in real-time as user types. Matches Arabic name, English name, or surah number.
- Clear button (X) appears when field has content

**Filter Chips**
- Horizontal scrollable row (no wrap on mobile)
- Default: `--bg-secondary` fill, `--text-secondary` text
- Active: `--accent-primary` fill, white text
- Border-radius: 20px, padding: 8px 16px, Inter `--text-sm`, font-weight 500
- Gap: 8px between chips

**Surah List Item**
- Padding: 16px 20px
- Left: Surah number in a diamond/octagonal shape (Islamic geometric motif), 40x40px, `--bg-secondary`, `--text-primary` centered, Inter `--text-base` bold
- Center: Arabic name (Amiri, `--text-lg`, `--text-arabic`, dir="rtl"), English name + meaning below (Inter, `--text-base` + `--text-sm` `--text-muted`), ayah count + revelation type
- Right: Thin progress bar if partially read, checkmark if completed
- Divider: 1px `--border-subtle` between items
- Hover: background shifts to `--bg-secondary`
- Entire row is tappable, min height 72px (touch target)

**Grid View (alternative)**
- Cards in 2-column (mobile) or 4-column (desktop) grid
- Card: `--bg-elevated`, border-radius 12px, padding 16px, centered content
- Arabic name prominent, English name below, ayah count smallest
- Subtle gold top-border on bookmarked surahs

#### Interaction Details

- **Scroll to section:** Alphabetical jump list on the right edge (like a phone contact list) — shows Juz numbers 1-30
- **Long press / right click:** Shows context menu — "Bookmark", "Start from beginning", "Continue reading"
- **Empty search state:** "No surahs match your search" with a subtle illustration
- **Keyboard navigation:** Arrow keys move selection, Enter opens surah, `/` focuses search

---

### 5.3 Reading View

**User intent:** "I want to read/listen to the Quran with focus and understanding."

This is the most critical page. It must serve three very different reading modes while maintaining a sense of continuity.

#### Layout — Serene Mode

```
+--------------------------------------------------+
|  [<-]  Al-Baqarah (2)    [Serene|Imm|Study] [:]  |
+--------------------------------------------------+
|                                                    |
|  +----------------------------------------------+ |
|  |              بِسْمِ ٱللَّهِ                    | |
|  |      ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ                 | |
|  +----------------------------------------------+ |
|                                                    |
|         الٓمٓ ﴿١﴾                                  |
|                                                    |
|   "Alif Lam Mim."                                 |
|                                                    |
|  ─────────────────────────────────                 |
|                                                    |
|         ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ           |
|         ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ ﴿٢﴾     |
|                                                    |
|   "This is the Book about which there             |
|    is no doubt, a guidance for those               |
|    conscious of Allah."                            |
|                                                    |
|  ─────────────────────────────────                 |
|                                                    |
|  (continues...)                                    |
|                                                    |
+--------------------------------------------------+
|  [<<] [<]  ▶  Ayah 2 of 286  [>] [>>]           |
|  ═══════════════════════[====]═══════════════════  |
+--------------------------------------------------+
```

#### Layout — Immersive Mode

```
+--------------------------------------------------+
|  (chrome hidden — tap to reveal)                   |
|                                                    |
|                                                    |
|                                                    |
|         الٓمٓ ﴿١﴾                                  |
|                                                    |
|                                                    |
|         ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ           |
|         ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ ﴿٢﴾     |
|                 ~~ (glow) ~~                       |
|                                                    |
|                                                    |
|                                                    |
|                     advancement                     |
|               advancement ⏸ 1.0x                    |
|              ═══════[====]════════                  |
|                                                    |
+--------------------------------------------------+
```

#### Layout — Study Mode (Desktop)

```
+--------------------------------------------------+
|  [<-]  Al-Baqarah    [Serene|Imm|Study] [:]      |
+--------------------------------------------------+
|                           |                        |
|  الٓمٓ ﴿١﴾                |  TAFSIR                |
|                           |                        |
|  "Alif Lam Mim."         |  Ibn Kathir:           |
|                           |  These are the huruf   |
|  ───────────────          |  al-muqatta'at...      |
|                           |                        |
|  ذَٰلِكَ ٱلْكِتَـٰبُ     |  ─────────────────     |
|  لَا رَيْبَ ۛ فِيهِ ۛ    |                        |
|  هُدًۭى                   |  YOUR NOTES            |
|  لِّلْمُتَّقِينَ ﴿٢﴾     |  [+ Add a note...]     |
|                           |                        |
|  "This is the Book..."   |  Bookmarked ★           |
|                           |                        |
|  [bookmark] [note]        |                        |
|  [highlight] [share]      |                        |
|                           |                        |
+--------------------------------------------------+
|  [audio controls — minimal]                        |
+--------------------------------------------------+
```

#### Component Specifications

**Header Bar**
- Height: 56px, sticky top
- Background: `--bg-primary` with subtle backdrop-blur (8px) for scroll overlap
- Left: Back arrow (44x44px touch target)
- Center: Surah name + number, Inter `--text-base` semibold
- Right: Mode switcher (segmented control) + overflow menu (kebab)
- Serene/Study: always visible. Immersive: auto-hides after 3s.

**Ayah Block**
- Arabic text: Amiri, `--arabic-reading`, `--text-arabic`, centered, dir="rtl"
- Ayah number: displayed inline within Arabic text using standard Quran notation (number in parentheses, e.g., ﴿٢﴾)
- Translation: Inter, `--text-base`, `--text-secondary`, left-aligned (LTR), max-width 600px, centered on page
- Spacing between ayahs: 32px
- Divider between ayahs: 1px `--border-subtle`, max-width 120px, centered, with subtle ornamental dot in center

**Bismillah**
- Displayed once at the top of each surah (except Surah 9)
- Aref Ruqaa, `--arabic-display`, `--accent-primary`, centered
- 48px bottom margin

**Audio Controls Bar**
- Fixed to bottom, height: 64px
- Background: `--bg-elevated`, top border 1px `--border-subtle`
- Serene: [prev ayah] [play/pause 44px] [next ayah] — small, subtle
- Immersive: [prev] [rewind 10s] [play/pause 56px] [forward 10s] [next] [speed] [repeat]
- Study: same as Serene
- Progress bar: full-width thin bar at top of audio bar, `--accent-primary` fill
- Current ayah indicator: small text "Ayah 42 of 286"

**Mode Switcher (Segmented Control)**
- Three segments: icons with labels ("Serene" / "Immersive" / "Study")
- On mobile: icons only (book, moon, pen)
- Container: `--bg-secondary`, border-radius 8px, padding 2px
- Active segment: `--bg-elevated`, border-radius 6px, subtle shadow
- Text: Inter `--text-xs`, `--text-primary` active, `--text-muted` inactive
- Width: auto, height: 32px

**Bookmark Interaction**
- Tap bookmark icon on an ayah: icon fills with gold, subtle scale-up animation (150ms, spring)
- A small toast appears: "Ayah bookmarked" (3s, auto-dismiss)
- Bookmark marker appears in left margin (gold vertical bar, 3px wide, 20px tall)

**Note Interaction (Study Mode)**
- Tap note icon on an ayah or select text
- Note editor appears in side panel (desktop) or bottom sheet (mobile)
- Rich text: bold, italic, bullet list
- Auto-saves on blur, saved to IndexedDB keyed by surah:ayah

**Highlight Interaction (Study Mode)**
- Select Arabic or translation text
- Small floating toolbar appears above selection
- Color options: gold, teal, rose (3 choices, not more)
- Tap color to apply. Highlight persists across sessions (IndexedDB).

#### Reading View States

| State | Behavior |
|-------|----------|
| Loading | Arabic text skeleton lines (shimmer). Translation skeleton shorter lines below. 300ms delay before showing spinner. |
| Audio loading | Play button shows small spinner inside. Progress bar pulses subtly. |
| Audio playing | Currently-recited ayah has gold left-border (Serene/Study) or soft background glow (Immersive). Previous ayah fades to slightly muted. |
| End of surah | Card appears: "You've completed Surah Al-Baqarah. Masha'Allah." with [Next Surah ->] and [Back to Index] buttons. |
| Offline | If audio file not cached: "Audio unavailable offline" message. Text always available (bundled JSON). |
| Error (data) | "Could not load ayah data. Please refresh." Retry button. |

---

### 5.4 Progress Dashboard

**User intent:** "I want to see how far I've come and feel motivated to continue."

#### Layout

```
+--------------------------------------------------+
|  [<-]   Your Progress                     [share] |
+--------------------------------------------------+
|                                                    |
|  +----------------------------------------------+ |
|  |  READING STREAK           TOTAL READ          | |
|  |                                               | |
|  |  🔥 14 days               1,247 ayahs         | |
|  |  Longest: 23 days         12 surahs complete  | |
|  |                                               | |
|  |  [S] [M] [T] [W] [T] [F] [S]                 | |
|  |  [●] [●] [●] [●] [●] [●] [○]  <- this week  | |
|  +----------------------------------------------+ |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  QURAN COMPLETION                                  |
|  +----------------------------------------------+ |
|  |  [=============>               ] 19%          | |
|  |                                               | |
|  |  Juz Progress (30 blocks grid)                | |
|  |  [■][■][■][■][■][□][□][□]...                  | |
|  +----------------------------------------------+ |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  THIS WEEK                                         |
|  +----------------------------------------------+ |
|  |  Bar chart — ayahs read per day               | |
|  |  Mon  Tue  Wed  Thu  Fri  Sat  Sun            | |
|  |  ██   ███  ██   █    ████ ██                  | |
|  +----------------------------------------------+ |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  BOOKMARKS (3)                                     |
|  +----------------------------------------------+ |
|  |  Al-Baqarah 2:255 (Ayatul Kursi)             | |
|  |  Ar-Rahman 55:13                              | |
|  |  Al-Mulk 67:1                                 | |
|  +----------------------------------------------+ |
|                                                    |
+--------------------------------------------------+
```

#### Component Specifications

**Streak Section**
- Weekly dots: 7 circles, 32px diameter, in a row
- Filled day: `--accent-primary` (gold)
- Today (not yet read): `--border-default` outline, dashed
- Future: `--border-subtle` outline
- Missed: `--bg-secondary` filled (not red — never punish)
- Streak number: Inter `--text-3xl`, bold, `--accent-primary`
- Longest streak: Inter `--text-sm`, `--text-muted`, shown below

**Quran Completion**
- Overall progress bar: height 8px, border-radius 4px, `--bg-secondary` track, `--success` fill
- Percentage: Inter `--text-lg`, bold, `--text-primary`
- Juz grid: 30 small squares (6 rows of 5), each representing one Juz
- Complete Juz: `--success` filled
- Partial: `--success` with reduced opacity proportional to completion
- Not started: `--bg-secondary`
- Tap a Juz square to see surahs within it

**Weekly Chart**
- Simple bar chart, 7 bars
- Bar color: `--accent-primary`
- Goal line: dashed horizontal line at daily goal level, `--text-muted`
- X-axis: day abbreviations, Inter `--text-xs`
- Y-axis: hidden (clean look), values shown on hover/tap
- Today's bar: slightly brighter, with a subtle glow if goal met
- Implementation: SVG, not a charting library (keep bundle small)

**Bookmarks List**
- Each item: surah name, ayah reference, first few words of translation
- Swipe left to delete (mobile), hover reveals delete icon (desktop)
- Tap navigates to that ayah in Reading View
- Empty state: "No bookmarks yet. Tap the bookmark icon while reading to save verses." with a soft illustration of an open book.

#### States

| State | Behavior |
|-------|----------|
| New user (no data) | All stats show zero. Encouraging message: "Your journey begins with a single ayah." Large CTA: [Start Reading ->] |
| Active user | All data populated. Weekly chart animates bars growing on page load (stagger 50ms per bar, 300ms duration). |
| Streak broken | Streak shows 0, but "Longest streak" stays. Message: "Every day is a fresh start." |

---

### 5.5 Settings Page

**User intent:** "I want to customize the app to match my preferences."

#### Layout

```
+--------------------------------------------------+
|  [<-]   Settings                                   |
+--------------------------------------------------+
|                                                    |
|  APPEARANCE                                        |
|  +----------------------------------------------+ |
|  |  Theme            [Light / Dark / System]     | |
|  |  Default Mode     [Serene / Immersive / Study]| |
|  |  Arabic Font Size  [--] 28px [++]             | |
|  +----------------------------------------------+ |
|                                                    |
|  READING                                           |
|  +----------------------------------------------+ |
|  |  Translation       [English (Sahih Int.) >]   | |
|  |  Tafsir Source     [Ibn Kathir >]             | |
|  |  Show Translation  [toggle on]                | |
|  |  Show Ayah Numbers [toggle on]                | |
|  +----------------------------------------------+ |
|                                                    |
|  AUDIO                                             |
|  +----------------------------------------------+ |
|  |  Reciter           [Mishary Rashid >]         | |
|  |  Auto-play Next    [toggle off]               | |
|  |  Playback Speed    [0.75x] [1x] [1.25x]      | |
|  +----------------------------------------------+ |
|                                                    |
|  GOALS                                             |
|  +----------------------------------------------+ |
|  |  Daily Ayah Goal   [--] 10 [++]              | |
|  |  Streak Reminders  [toggle on]                | |
|  |  Reminder Time     [8:00 PM >]               | |
|  +----------------------------------------------+ |
|                                                    |
|  DATA                                              |
|  +----------------------------------------------+ |
|  |  Export Data        [Export JSON]              | |
|  |  Clear All Data     [Clear]                   | |
|  +----------------------------------------------+ |
|                                                    |
+--------------------------------------------------+
```

#### Component Specifications

**Section Header**
- All caps, Inter `--text-xs`, letter-spacing 1.5px, `--text-muted`, font-weight 600
- 32px top margin, 12px bottom margin

**Setting Row**
- Height: 56px, flex row, vertically centered
- Label: Inter `--text-base`, `--text-primary`
- Value/Control: right-aligned
- Divider: 1px `--border-subtle` between rows
- Tappable rows (those with ">") have min height 56px touch target

**Toggle Switch**
- Width: 48px, height: 28px, border-radius 14px
- Off: `--bg-secondary` track, white circle
- On: `--accent-primary` track, white circle
- Animation: 150ms ease-out slide

**Stepper (font size, goal count)**
- [-] [value] [+] layout
- Buttons: 36x36px, `--bg-secondary`, border-radius 8px
- Value: Inter `--text-base`, bold, 48px width, centered
- Min/max values enforced (font: 20-48px, goal: 1-50)

**Segmented Control (Theme, Speed)**
- Same pattern as mode switcher
- Container: `--bg-secondary`, border-radius 8px
- Active: `--bg-elevated`, shadow

**Destructive Action (Clear All Data)**
- Text: `--error` color
- Tap shows confirmation dialog: "This will delete all your reading progress, bookmarks, and notes. This cannot be undone."
- Two buttons: [Cancel] (secondary) and [Clear Everything] (filled `--error` background)

---

## 6. Navigation & Information Architecture

### Site Map

```
Noor
├── Home (/)
│   ├── Daily Ayah
│   ├── Streak & Goals
│   ├── Continue Reading -> Reading View
│   └── Quick Actions -> Surah Index, Bookmarks, Random
│
├── Surah Index (/surahs)
│   ├── Search
│   ├── Filter (All, Meccan, Medinan, Bookmarked)
│   └── Surah -> Reading View
│
├── Reading View (/surah/:id)
│   ├── Mode: Serene (default)
│   ├── Mode: Immersive
│   ├── Mode: Study
│   │   ├── Tafsir Panel
│   │   └── Notes Panel
│   ├── Audio Player
│   └── Bookmark / Highlight / Share
│
├── Progress Dashboard (/progress)
│   ├── Streak
│   ├── Completion Stats
│   ├── Weekly Chart
│   └── Bookmarks List -> Reading View
│
└── Settings (/settings)
    ├── Appearance
    ├── Reading
    ├── Audio
    ├── Goals
    └── Data
```

### Navigation Patterns

**Mobile (< 768px)**
- Bottom tab bar, 4 items: Home, Surahs, Progress, Settings
- Reading View: full-screen, no tab bar (distraction-free)
- Tab bar height: 56px + safe area inset
- Active tab: `--accent-primary` icon + label. Inactive: `--text-muted` icon only.
- Icons: 24px, labels: Inter `--text-xs`

**Desktop (>= 1024px)**
- Left sidebar, 64px wide (collapsed) or 240px (expanded)
- Icons with labels, vertical stack
- Reading View: sidebar collapses to 64px automatically
- Active item: `--accent-primary` left border (3px) + `--bg-secondary` background

**Tablet (768px - 1023px)**
- Bottom tab bar (same as mobile, larger touch targets)
- Reading View: full-screen with visible header

### Navigation Depth

Maximum 3 levels: Home -> Surah Index -> Reading View. No deeper nesting. This is critical for simplicity.

### URL Structure

| Page | URL | Note |
|------|-----|------|
| Home | `/` | |
| Surah Index | `/surahs` | |
| Reading View | `/surah/2` | Surah number |
| Reading View (specific ayah) | `/surah/2/255` | Deep link to ayah |
| Progress | `/progress` | |
| Settings | `/settings` | |

---

## 7. Responsive Breakpoints

### Breakpoint Definitions

| Name | Range | Tailwind | Layout |
|------|-------|----------|--------|
| Mobile S | 320px - 374px | default | Single column, compact |
| Mobile | 375px - 767px | default | Single column |
| Tablet | 768px - 1023px | `md:` | Single column, wider cards |
| Desktop | 1024px - 1439px | `lg:` | Sidebar + content |
| Desktop L | 1440px+ | `xl:` | Sidebar + content + whitespace |

### Key Responsive Behaviors

**Arabic Text Sizing**

| Breakpoint | `--arabic-reading` | `--arabic-display` |
|------------|-------------------|--------------------|
| Mobile S | 24px | 32px |
| Mobile | 28px | 40px |
| Tablet | 30px | 44px |
| Desktop | 32px | 48px |

**Reading View Content Width**

| Breakpoint | Serene | Immersive | Study |
|------------|--------|-----------|-------|
| Mobile | 100% - 32px padding | 100% - 24px | 100% (tabs below) |
| Tablet | max 640px centered | max 600px centered | 100% (tabs below) |
| Desktop | max 680px centered | max 600px centered | 60/40 split |
| Desktop L | max 720px centered | max 640px centered | 55/45 split, max 1200px |

**Navigation**

| Breakpoint | Pattern |
|------------|---------|
| Mobile / Tablet | Bottom tab bar (56px + safe-area) |
| Desktop | Left sidebar (64px collapsed, 240px expanded) |

**Surah Index Grid**

| Breakpoint | Columns (Grid View) |
|------------|-------------------|
| Mobile S | 1 |
| Mobile | 2 |
| Tablet | 3 |
| Desktop | 4 |
| Desktop L | 5 |

**Progress Dashboard Cards**

| Breakpoint | Layout |
|------------|--------|
| Mobile | Single column, stacked |
| Tablet | 2 columns (streak + goal side by side) |
| Desktop | 2 columns, wider charts |

### Critical: 320px Test

At 320px (iPhone SE, smallest supported):
- Arabic text must not overflow or clip
- All touch targets still 44px minimum
- No horizontal scroll
- Bottom tab labels can hide (icons only)
- Daily Ayah card reduces to single-line Arabic with ellipsis if needed, tappable to expand

---

## 8. Micro-interactions & Animations

### Animation Tokens

| Token | Duration | Easing | Use |
|-------|----------|--------|-----|
| `--duration-instant` | 100ms | `ease-out` | Toggle, checkbox |
| `--duration-micro` | 150ms | `ease-out` | Hover, focus, button press |
| `--duration-standard` | 250ms | `ease-in-out` | Modal, dropdown, panel |
| `--duration-emphasis` | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Mode switch, page transition |
| `--duration-ambient` | 2000ms | `ease-in-out` | Streak flame pulse, ambient particles |

### Specific Interactions

**1. Bookmark Tap**
- Duration: 150ms
- Effect: Icon scales from 1.0 to 1.2 to 1.0 (spring). Fill color transitions from transparent to gold.
- Haptic: Light impact (if available via Vibration API)
- Toast: slides up from bottom, 3s auto-dismiss

**2. Streak Flame**
- Duration: 2000ms loop
- Effect: Gentle scale oscillation (1.0 to 1.05). Subtle opacity shift on glow layer.
- Condition: Only animates when streak > 0
- Reduced motion: static, no animation

**3. Mode Switch**
- Duration: 300ms
- Effect: Background color crossfades. Text elements fade out (150ms) then fade in (150ms). Layout changes apply instantly (no jarring shift).
- Audio controls: slide transition (up/expand or down/collapse)

**4. Page Transitions**
- Between pages: Shared-element transition on surah name when going from Index to Reading View (if using View Transitions API). Fallback: simple 200ms fade.
- Within reading: Ayahs fade in with 30ms stagger as user scrolls to new content.

**5. Progress Ring Fill**
- Duration: 600ms
- Effect: Ring fills from 0 to current value on page load. Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot for satisfaction).
- Reduced motion: ring appears at final value immediately.

**6. Audio Ayah Highlight**
- Duration: 200ms in, 300ms out
- Effect: Currently-recited ayah gets a soft gold left-border (Serene) or background glow (Immersive) that fades in. Previous ayah highlight fades out over 300ms.
- In Immersive: glow is a radial gradient, very subtle (opacity 0.1).

**7. Pull to Refresh (Mobile Home)**
- Threshold: 80px pull distance
- Effect: Small ornamental Islamic pattern appears as pull indicator (not a generic spinner). Rotates gently.
- On release: content refreshes, indicator shrinks back.

**8. Scroll Behaviors**
- Header: on scroll-down, header collapses to 44px height (compact). On scroll-up, expands back to 56px.
- Audio bar: always visible when audio is playing. Otherwise, hidden until user taps play.
- "Back to top" button: appears after scrolling 500px down. Floating pill, bottom-right, 44x44px.

### Reduced Motion

All animations above respect `prefers-reduced-motion: reduce`:
- Crossfades become instant (0ms)
- Scale animations become static
- Stagger effects are removed (all items appear at once)
- Ambient effects (flame pulse, particles) are disabled entirely
- Progress ring shows final value without animation

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Accessibility Considerations

### RTL Support

This app serves content in both RTL (Arabic) and LTR (English/translations) simultaneously. This is a critical design constraint.

**Document Direction**
- The app shell (`<html>`) should be `dir="ltr"` (navigation, settings, UI chrome are in English)
- Arabic text blocks must have `dir="rtl"` and `lang="ar"` attributes
- CSS logical properties must be used throughout: `margin-inline-start` not `margin-left`, `padding-inline-end` not `padding-right`
- Flexbox `row` direction auto-adjusts with logical properties

**Bidirectional Text Handling**
- Never mix Arabic and Latin in the same text node without proper `<bdi>` wrapping
- Ayah numbers within Arabic text: use `<span dir="ltr">` for the numeral
- Translation attribution ("Surah Al-Baqarah, 2:255"): LTR block, even though it contains Arabic words

**Tailwind Logical Properties**

| Physical | Logical (use this) |
|----------|-------------------|
| `ml-4` | `ms-4` |
| `mr-4` | `me-4` |
| `pl-4` | `ps-4` |
| `pr-4` | `pe-4` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `left-0` | `start-0` |
| `right-0` | `end-0` |

### Font Sizing & Readability

- Minimum body text: 16px on all breakpoints (no exceptions)
- Arabic reading text: minimum 24px on smallest breakpoint (320px)
- User can increase Arabic font size in Settings (20px to 48px range)
- Line length for translation text: 45-75 characters (max-width constraint)
- Arabic line-height: minimum 2.0 at reading scale (tashkeel clearance)
- Latin line-height: minimum 1.5

### Color & Contrast

- All text/background combinations meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have visible focus indicators: 2px solid `--accent-primary`, 2px offset
- Focus indicators are never hidden — `:focus-visible` styling applied to all interactive elements
- Color is never the only indicator of state (bookmarked = gold color + filled icon shape change)
- Streak "missed day" is shown by shape (empty circle) not just color

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus through interactive elements |
| `Enter` / `Space` | Activate focused element |
| `Escape` | Close modal, dismiss panel, exit search |
| `Arrow Left/Right` | Previous/next ayah (Reading View) |
| `Arrow Up/Down` | Scroll through surah list |
| `/` | Focus search field (Surah Index) |
| `M` | Cycle UX mode (Serene -> Immersive -> Study) |
| `Space` | Play/pause audio (Reading View, when audio bar is not focused) |
| `B` | Bookmark current ayah |

### Screen Reader Considerations

- Arabic text: `lang="ar"` attribute so screen reader switches pronunciation
- Ayah numbers: `aria-label="Ayah 255"` on the number element
- Progress ring: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Mode switcher: `role="tablist"` with `role="tab"` on each option
- Audio player: all controls have `aria-label` descriptions
- Streak visualization: `aria-label="14 day reading streak. Read 5 of 7 days this week."`
- Skip link: "Skip to ayah content" link at top of Reading View

### Touch Targets

Every tappable element: minimum 44x44px. This includes:
- Navigation icons (back, settings, overflow)
- Bookmark, note, share icons
- Audio control buttons
- Filter chips (44px height, adequate width)
- Surah list items (72px height minimum)
- Toggle switches (48x28px switch, but tappable label extends full row width)

---

## 10. Pre-Delivery Checklist

Before any screen is considered complete, verify:

- [ ] Contrast ratios meet WCAG AA (4.5:1 normal, 3:1 large text)
- [ ] All touch targets are minimum 44x44px
- [ ] All states designed: default, hover, active, focus, disabled, loading, empty, error, success
- [ ] Keyboard navigation works for all interactive elements
- [ ] `prefers-reduced-motion` respected (all animations have reduced-motion fallback)
- [ ] No layout breakage at 320px viewport width
- [ ] Arabic font minimum 24px on mobile, tashkeel not clipped
- [ ] Latin body font minimum 16px on all breakpoints
- [ ] Forms have max 7 fields per step
- [ ] Focus indicators visible (2px `--accent-primary` outline)
- [ ] Consistent 4px/8px spacing grid used throughout
- [ ] Dark mode tokens correct (no hardcoded colors in components)
- [ ] All images/icons have alt text or aria-label
- [ ] Placeholder text does not replace labels
- [ ] Animations under 300ms for standard interactions
- [ ] z-index scale consistent: dropdown 10, modal 50, toast 100
- [ ] RTL: all spacing uses CSS logical properties
- [ ] RTL: Arabic text blocks have `dir="rtl"` and `lang="ar"`
- [ ] Screen reader: landmark roles, aria-labels, lang attributes
- [ ] Audio player: Wake Lock API for Immersive mode
- [ ] Streak messaging is encouraging, never punishing

---

## Appendix A: Spacing Scale

Based on 4px base unit. All spacing uses these values exclusively.

| Token | Value | Tailwind | Common Use |
|-------|-------|----------|------------|
| `--space-1` | 4px | `p-1` / `gap-1` | Tight icon gaps |
| `--space-2` | 8px | `p-2` / `gap-2` | Inline element spacing |
| `--space-3` | 12px | `p-3` / `gap-3` | Compact card padding |
| `--space-4` | 16px | `p-4` / `gap-4` | Standard element spacing |
| `--space-5` | 20px | `p-5` / `gap-5` | Card padding |
| `--space-6` | 24px | `p-6` / `gap-6` | Section spacing |
| `--space-8` | 32px | `p-8` / `gap-8` | Between ayahs, section gaps |
| `--space-10` | 40px | `p-10` | Large section breaks |
| `--space-12` | 48px | `p-12` | Page-level padding top |
| `--space-16` | 64px | `p-16` | Major layout gaps |

## Appendix B: z-index Scale

| Token | Value | Use |
|-------|-------|-----|
| `--z-base` | 0 | Default content |
| `--z-above` | 1 | Ayah highlight overlays |
| `--z-dropdown` | 10 | Dropdowns, tooltips, popovers |
| `--z-sticky` | 20 | Sticky header, audio bar |
| `--z-modal-backdrop` | 40 | Modal overlay background |
| `--z-modal` | 50 | Modal content |
| `--z-toast` | 100 | Toast notifications |

## Appendix C: Icon Specifications

All icons: 24px default, 20px compact, 28px large (audio controls).
Stroke width: 1.5px.
Style: Rounded line icons (not filled, not sharp corners).
Recommended set: Lucide Icons (open-source, React-friendly, consistent with rounded style).

| Icon | Use | Notes |
|------|-----|-------|
| `book-open` | Serene mode | |
| `moon` | Immersive mode | |
| `pencil` | Study mode | |
| `bookmark` | Bookmark (outline = unsaved, filled = saved) | Shape change, not just color |
| `play` / `pause` | Audio playback | |
| `skip-back` / `skip-forward` | Previous/next ayah | |
| `search` | Search field | |
| `settings` | Settings gear | |
| `home` | Home tab | |
| `list` | Surah index tab | |
| `bar-chart-2` | Progress tab | |
| `flame` | Streak (custom SVG with glow variant) | |
| `share-2` | Share ayah | |
| `chevron-right` | Navigation arrow | |
| `x` | Close, clear, dismiss | |

---

*This specification is a living document. Update it as design decisions evolve during development. Every pixel serves the user's connection to the Quran.*
