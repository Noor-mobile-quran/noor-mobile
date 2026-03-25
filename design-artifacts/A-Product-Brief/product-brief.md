# Product Brief: Noor

> Complete Strategic Foundation

**Created:** 2026-03-24
**Author:** Mary (Strategic Business Analyst)
**Brief Type:** Complete
**Status:** Product Brief Complete

---

## Strategic Summary

Noor is a Quran-focused Islamic content hub designed to become the daily digital companion for Muslims worldwide. The app addresses a fundamental gap in the market: existing Quran apps treat the Quran as a reference tool -- something you open, search, and close. Noor reframes the relationship. It treats the Quran as a daily practice, weaving engagement hooks like streaks, reading goals, and progress tracking into a spiritually respectful experience that keeps users returning every single day.

The product is built on a core insight: the barrier to consistent Quran engagement is not access to text -- it is the absence of a habit-forming, beautiful digital experience that meets users where they are. A student commuting to university needs a different mode than a scholar conducting tafsir research, and both need something different from a parent reading with their child at night. Noor serves all of them through three distinct UX modes (Serene, Immersive, Study) within a single responsive web application.

By shipping as a lightweight, statically-hosted web app with bundled JSON data, Noor eliminates connectivity barriers, reduces infrastructure costs to near zero, and enables rapid iteration. This is a product that can reach millions without requiring millions to build.

---

## 1. Product Vision and Mission

### Vision
A beautiful, immersive Quran-focused web app with addictive daily engagement hooks that keeps users connected to the Quran every day.

### Mission
To make daily Quran engagement effortless, beautiful, and habit-forming for every Muslim -- regardless of age, language, or technical ability -- by delivering a responsive web experience that adapts to how each person reads, listens, and studies.

### The North Star
Noor succeeds when a user opens it before they open social media. The measure is not downloads or sign-ups -- it is daily return rate and streak continuity.

---

## 2. Problem Statement

### The Problem (in the user's words)
"I want to read Quran more consistently, but I keep falling off. The apps I have feel like dictionaries -- I open them when I need a specific ayah, not because I want to spend time there."

### The Real Need (three 'whys' deep)
- **Why do users not read consistently?** Because existing tools are transactional, not relational. They serve search, not habit.
- **Why does that matter?** Because Quran engagement is a daily spiritual practice, not an occasional lookup. Without a system that supports the rhythm of daily reading, users rely on willpower alone.
- **Why is willpower not enough?** Because every other app on their phone is engineered for retention -- streaks, notifications, progress bars. The Quran deserves the same intentional design, applied with spiritual sensitivity.

### The Opportunity
There are approximately 1.9 billion Muslims globally. Smartphone and web access is nearly universal in key markets (Southeast Asia, Middle East, South Asia, Africa, Western diaspora). The intersection of faith-tech and habit-forming product design is underserved. Products that do exist either prioritize text accuracy without UX investment, or prioritize aesthetics without engagement mechanics. Noor sits at the intersection.

---

## 3. Target Audience and User Personas

### Primary User Profile (ICP)
**Universal Muslim audience, all age groups.** The product is intentionally designed without a narrow demographic slice. The three UX modes serve three behavioral archetypes:

### Persona 1: Amina -- The Daily Reader
- **Age:** 25-40
- **Behavior:** Reads Quran daily or wants to. Uses her phone during commute and before bed.
- **Need:** A frictionless, beautiful reading experience with progress tracking that keeps her accountable.
- **Mode:** Serene (reading focus, clean typography, minimal distractions)
- **Success signal:** 30-day streak maintained

### Persona 2: Yusuf -- The Listener
- **Age:** 18-35
- **Behavior:** Prefers audio recitation. Listens while driving, exercising, or winding down.
- **Need:** An immersive listening experience with dark mode, prominent audio controls, and background playback.
- **Mode:** Immersive (listening/dark, audio-forward)
- **Success signal:** Completes a full juz through listening in one week

### Persona 3: Fatima -- The Student
- **Age:** 16-60
- **Behavior:** Studies tafsir, takes notes, bookmarks verses for classes or khutbah preparation.
- **Need:** Side-by-side Arabic, translation, and tafsir with note-taking and bookmark management.
- **Mode:** Study (notes, bookmarks, reference tools)
- **Success signal:** 50+ bookmarked verses with personal annotations

### Secondary Users
- **Parents** introducing children to Quran (simplified UI, larger Arabic text)
- **New Muslims** exploring the Quran for the first time (guided starting points, contextual tafsir)
- **Islamic educators** using Noor as a teaching reference tool

---

## 4. Core Value Proposition

### Positioning Statement
For **Muslims worldwide** who want to **engage with the Quran daily**, **Noor** is a **Quran-focused web app** that **makes consistent reading, listening, and study effortless and rewarding**. Unlike **existing Quran apps that function as static reference tools**, Noor **combines beautiful Arabic typography, three adaptive UX modes, and habit-forming engagement mechanics** to turn occasional access into daily practice.

**Breakdown:**

- **Target Customer:** Muslims of all ages seeking consistent Quran engagement
- **Need/Opportunity:** Habit-forming daily Quran interaction (not just reference lookup)
- **Category:** Islamic faith-tech / Quran engagement platform
- **Key Benefit:** Daily engagement through beauty, adaptability, and accountability
- **Differentiator:** Three UX modes (Serene, Immersive, Study) combined with streak-based engagement hooks in a zero-infrastructure web app

---

## 5. Key Features (Prioritized -- MoSCoW)

### Must Have (MVP)

| # | Feature | Description | Acceptance Criteria |
|---|---------|-------------|-------------------|
| 1 | **Home Dashboard** | Daily ayah, streak counter, continue reading, quick actions | User sees personalized home within 1 second of load; daily ayah rotates every 24h |
| 2 | **Surah Index** | Browse all 114 surahs with search and filters | User can find any surah by name (Arabic or English) or number within 3 interactions |
| 3 | **Reading View** | Arabic text + translation + audio player per ayah | Arabic text renders correctly with tashkeel; translation displays below; audio plays per ayah or continuously |
| 4 | **Daily Streak System** | Consecutive-day reading counter with localStorage persistence | Streak increments on any reading session > 1 ayah; resets after 48h of inactivity; persists across browser sessions |
| 5 | **Progress Tracking** | Juz and surah completion visualization | User sees percentage complete per surah and per juz; visual progress bar on dashboard |
| 6 | **Bookmarks** | Save and revisit specific ayahs | User can bookmark any ayah with one tap; bookmarks list accessible from dashboard and reading view |
| 7 | **Serene Mode** | Clean, minimal reading experience | White/cream background, large Arabic typography, generous whitespace, no distracting UI elements |
| 8 | **Responsive Layout** | Works on mobile, tablet, desktop browsers | Passes manual QA on iPhone SE, iPad, and 1440px desktop viewport |
| 9 | **Local Data Bundle** | All Quran text, translations, tafsir bundled as JSON | App loads and functions fully offline after first visit; no API calls required for core content |

### Should Have (Post-MVP Sprint 1)

| # | Feature | Description |
|---|---------|-------------|
| 10 | **Immersive Mode** | Dark theme, prominent audio controls, listening-focused layout |
| 11 | **Study Mode** | Side-by-side tafsir, personal notes per ayah, bookmark collections |
| 12 | **Reading Goals** | Configurable daily ayah/page targets with progress indicator |
| 13 | **Reading History** | Automatic "pick up where you left off" with session history |
| 14 | **Settings Panel** | Translation language selection, reciter selection, theme toggle |
| 15 | **Audio Recitation** | Continuous playback with reciter selection and surah-level controls |

### Could Have (Future Releases)

| # | Feature | Description |
|---|---------|-------------|
| 16 | **Multiple Translations** | Support for 5+ languages simultaneously |
| 17 | **Social Sharing** | Share daily ayah as an image card to social platforms |
| 18 | **Push Notifications** | Daily reminder to maintain streak (requires PWA) |
| 19 | **Offline PWA** | Full Progressive Web App with install prompt and service worker |
| 20 | **Favorites Collections** | Organize bookmarks into thematic collections |

### Won't Have (Out of Scope)

- User accounts / authentication / cloud sync (MVP is local-only)
- Hadith content or non-Quran Islamic texts
- Community features (forums, comments, social feed)
- E-commerce (donations, merchandise)
- Native mobile apps (iOS/Android)
- Content creation or user-generated content
- Gamification beyond streaks and goals (no leaderboards, badges, points)
- Multi-tenant or admin dashboards

---

## 6. Success Metrics and KPIs

### Primary Success Metric (North Star)
**Daily Active Return Rate (DARR):** Percentage of users who return within 24 hours of their last session.
- **Target:** 40% DARR within 90 days of launch

### Secondary Metrics

| Metric | Definition | Target | Timeline |
|--------|-----------|--------|----------|
| **7-Day Streak Rate** | % of users maintaining 7+ day streaks | 25% | 90 days post-launch |
| **Session Duration** | Average time spent per session | > 5 minutes | 60 days post-launch |
| **Surah Completion Rate** | % of users who finish at least 1 full surah | 30% | 90 days post-launch |
| **Mode Adoption** | % of users who try all 3 UX modes | 20% | 120 days post-launch |
| **Bookmark Usage** | % of users with 5+ bookmarks | 15% | 90 days post-launch |
| **Performance (LCP)** | Largest Contentful Paint on mobile | < 2 seconds | Launch |
| **Lighthouse Score** | Performance + Accessibility combined | > 90 | Launch |

### How We Measure (Without User Accounts)
Since MVP is local-only with no authentication, analytics will rely on:
- Privacy-respecting anonymous analytics (e.g., Plausible, Umami)
- Aggregate page view and session data
- No personally identifiable information collected
- localStorage-based engagement data stays on device

---

## 7. Competitive Landscape

### Direct Competitors

| App | Strengths | Weaknesses |
|-----|-----------|------------|
| **Quran.com** | Comprehensive, trusted, multiple translations and reciters | Reference-focused, not habit-forming, complex UI |
| **Muslim Pro** | All-in-one Islamic app (prayer, Quran, qibla) | Jack of all trades, Quran is secondary feature; privacy controversies |
| **Tarteel AI** | AI-powered recitation tracking | Narrow use case (recitation practice only), requires microphone |
| **Al Quran (various)** | Simple, lightweight | Poor UX, outdated design, no engagement mechanics |
| **Ayah App** | Clean design | Limited features, small user base |

### Indirect Competitors
- Physical Quran (no tracking, no modes, but deeply trusted)
- YouTube Quran recitation channels (passive listening, no structure)
- Duolingo/Headspace (competing for the same "daily habit" slot on the phone)

### Our Unfair Advantage
1. **Mode-based UX** -- No competitor offers three distinct interaction modes within one app. Users do not have to choose between a reading app, a listening app, and a study app.
2. **Habit-first design** -- Competitors treat engagement as secondary. Noor treats it as the product. Streak mechanics, daily ayah, and reading goals are not features -- they are the core loop.
3. **Zero-infrastructure architecture** -- Bundled JSON data means no server costs, no API rate limits, no downtime. This scales to millions of users at the cost of a static CDN.
4. **Spiritual sensitivity** -- The design language (calligraphy-inspired typography, warm earthy tones, generous whitespace) respects the content. This is not a generic productivity app with Islamic skin.

---

## 8. Risks and Assumptions

### Assumptions
| ID | Assumption | Validation Method |
|----|-----------|-------------------|
| A1 | Muslims want a dedicated Quran app rather than an all-in-one Islamic app | User interviews; competitive analysis of Quran.com traffic vs. Muslim Pro |
| A2 | Streak mechanics are culturally appropriate for Quran engagement | Community feedback during beta; consult with Islamic scholars |
| A3 | Users will accept a web app instead of a native app | Analytics on mobile web vs. PWA install rates |
| A4 | Bundled JSON data is sufficient (users do not need real-time content updates) | Content audit; Quran text is static, translations update rarely |
| A5 | localStorage/IndexedDB is reliable enough for progress persistence | Technical testing across browsers; data loss rate monitoring |

### Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R1 | **Arabic text rendering issues** across browsers/devices | Medium | High | Test on 20+ device/browser combinations; use well-established Arabic web fonts (Amiri, Scheherazade); fallback font stack |
| R2 | **localStorage data loss** (user clears browser data, loses streaks) | Medium | High | Prominent export/backup feature; future cloud sync option; clear user education |
| R3 | **Audio file size** makes initial load heavy | High | Medium | Lazy-load audio on demand; do not bundle audio in initial payload; use streaming URLs |
| R4 | **Cultural sensitivity** -- gamification of Quran could offend users | Low | High | Frame engagement as "accountability" not "gaming"; consult community leaders; provide opt-out for streak notifications |
| R5 | **JSON bundle size** for full Quran + translations + tafsir | Medium | Medium | Measure bundle; consider lazy-loading tafsir per surah; gzip compression; code-split by surah |
| R6 | **Discoverability** -- web apps are harder to find than app store listings | High | Medium | SEO optimization; social sharing of daily ayah; future PWA with install prompt |
| R7 | **Right-to-left (RTL) layout** complexity with mixed Arabic/English content | Medium | Medium | Use CSS logical properties; test bidirectional text rendering; dedicated RTL QA pass |

---

## 9. MVP Scope Definition

### What MVP Includes
The Minimum Viable Product is a fully functional, responsive Quran reading web app with engagement hooks. A user should be able to:

1. Open the app and see a daily ayah with their current streak
2. Browse and search all 114 surahs
3. Read any surah with Arabic text and English translation
4. Listen to audio recitation per ayah
5. Bookmark ayahs for later
6. Track their reading progress (surah and juz completion)
7. Maintain a daily reading streak
8. Use Serene mode for focused reading
9. Access the app on any device (mobile, tablet, desktop)

### What MVP Excludes
- Immersive and Study modes (Should Have, post-MVP)
- Tafsir content display (Should Have, post-MVP)
- Multiple translation languages (Could Have)
- Push notifications (Could Have)
- User accounts and cloud sync (Won't Have for now)
- Any non-Quran content (Won't Have)

### MVP Technical Boundaries
- **Data:** Quran Arabic text + 1 English translation + audio URLs bundled as JSON
- **Storage:** localStorage for streaks, bookmarks, progress, last-read position
- **Hosting:** Static deployment on Vercel or Netlify
- **Performance target:** < 2s LCP on 3G mobile connection
- **Browser support:** Last 2 versions of Chrome, Safari, Firefox, Edge
- **Bundle size target:** < 5MB initial load (excluding lazy-loaded audio)

### MVP User Stories

**US-01: Daily Ayah**
As a Muslim user, I want to see a featured verse when I open the app, so that I begin each session with spiritual inspiration.
- AC: A different ayah displays each day; includes Arabic text and English translation; displays on home screen above the fold.

**US-02: Surah Browsing**
As a user, I want to browse all surahs and search by name or number, so that I can quickly find what I want to read.
- AC: All 114 surahs listed with Arabic name, English name, and ayah count; search returns results as user types; Makki/Madani filter available.

**US-03: Quran Reading**
As a user, I want to read a surah with Arabic text and English translation displayed together, so that I can understand what I am reading.
- AC: Arabic text displays with correct tashkeel; English translation appears below each ayah; text is scrollable; ayah numbers are visible.

**US-04: Audio Recitation**
As a user, I want to listen to audio recitation of any ayah, so that I can hear the correct pronunciation and enjoy the recitation.
- AC: Play button per ayah; continuous play through surah; pause/resume controls; audio loads on demand (not pre-bundled).

**US-05: Streak Tracking**
As a user, I want to see my consecutive reading days, so that I feel motivated to maintain my daily habit.
- AC: Streak counter visible on home screen; increments after reading > 1 ayah; resets after 48 hours of no activity; persists in localStorage.

**US-06: Bookmarking**
As a user, I want to bookmark specific ayahs, so that I can return to meaningful verses later.
- AC: Bookmark icon on each ayah; bookmarks list accessible from home and navigation; one-tap add/remove.

**US-07: Progress Tracking**
As a user, I want to see how much of the Quran I have read, so that I feel a sense of accomplishment and direction.
- AC: Progress bar per surah; overall juz completion percentage; visual dashboard on dedicated page.

**US-08: Responsive Experience**
As a user, I want the app to work well on my phone, tablet, and laptop, so that I can use it wherever I am.
- AC: Layout adapts to viewport; touch targets meet 44px minimum on mobile; no horizontal scroll; readable Arabic text at all sizes.

---

## Platform and Device Strategy

**Primary Platform:** Responsive web application (browser-based)

**Supported Devices:**
- Mobile phones (iOS Safari, Android Chrome) -- primary usage context
- Tablets (iPadOS Safari, Android Chrome)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

**Device Priority:** Mobile-first design, scaling up to tablet and desktop

**Interaction Models:**
- Touch (mobile/tablet): swipe between ayahs, tap to bookmark, tap to play audio
- Mouse/keyboard (desktop): click interactions, keyboard shortcuts for navigation

**Technical Requirements:**
- **Offline Functionality:** Full offline reading after first load (bundled JSON); audio requires connectivity
- **Native Features:** None required for MVP; future PWA for home screen install

**Platform Rationale:**
A web app removes the App Store/Play Store gatekeeping, enables instant access via URL sharing, and eliminates the need for separate iOS/Android codebases. The target audience spans dozens of countries with varying device ecosystems -- the web is the only truly universal platform.

**Future Platform Plans:**
- PWA with service worker for full offline + install prompt (Could Have)
- React Native wrapper for app store presence if demand warrants (Won't Have for now)

---

## Tone of Voice

**For UI Microcopy and System Messages**

### Tone Attributes

1. **Warm:** Like a kind companion on the journey, not a cold interface. "Welcome back" not "Session resumed."
2. **Reverent:** The content is sacred. The UI language reflects respect. No casual slang around Quranic text.
3. **Encouraging:** Gently motivating without guilt. "You read 3 ayahs today" not "You only read 3 ayahs."
4. **Clear:** Simple language accessible to non-native English speakers. Short sentences. No jargon.

### Examples

**Error Messages:**
- Good: "We could not load this surah. Please check your connection and try again."
- Avoid: "Error 404: Resource not found."

**Button Text:**
- Good: "Continue Reading"
- Avoid: "Resume Session"

**Empty States:**
- Good: "Your bookmarks will appear here. Tap the bookmark icon on any ayah to save it."
- Avoid: "No bookmarks found."

**Success Messages:**
- Good: "Masha'Allah! You have completed Surah Al-Baqarah."
- Avoid: "Surah complete. +1 achievement."

### Guidelines

**Do:**
- Use Islamic phrases naturally where appropriate (Bismillah, Masha'Allah, In sha Allah)
- Keep encouragement gentle and sincere
- Respect the user's time and attention
- Write for a global audience (simple English, no idioms)

**Do Not:**
- Gamify language around the Quran itself ("You unlocked a new surah!")
- Use guilt-based motivation ("You broke your streak!")
- Assume a specific school of thought or denomination
- Use overly casual or trendy language

---

## Design Direction

- Arabic calligraphy-inspired typography (Amiri, Scheherazade New, or similar)
- Warm earthy and gold tones as primary palette; dark mode uses deep navy/charcoal, not pure black
- Clean minimalist layout with generous whitespace -- let the text breathe
- Three UX modes with smooth transitions between them
- Micro-interactions that feel intentional (page turns, bookmark animations, streak celebrations)
- The design should feel like opening a beautiful mushaf, not opening a tech product

---

## Constraints

- **Timeline:** MVP target within 4-6 weeks of development start
- **Team:** Small team; architecture must stay simple and maintainable
- **Budget:** Near-zero infrastructure costs (static hosting only)
- **Content accuracy:** Quran text must be verified against established digital Quran databases (Tanzil.net, quran.com API data)
- **No backend:** MVP has no server, no database, no authentication
- **Accessibility:** Must meet WCAG 2.1 AA for core reading experience
- **Performance:** Must perform well on mid-range Android devices over 3G connections (large portion of target audience)

---

## Business Context

- **Primary Goal:** Build a Quran engagement product that becomes a daily habit for millions of Muslims
- **Solution:** A responsive web app combining beautiful Quran content with habit-forming UX mechanics
- **Target Users:** Universal Muslim audience, all ages, global
- **Revenue model:** To be defined post-MVP validation (potential paths: ethical ads, premium features, donations, partnerships with Islamic organizations)

---

## Open Questions (To Be Resolved)

| # | Question | Owner | Deadline |
|---|----------|-------|----------|
| 1 | Which specific Quran translation to bundle for MVP (Sahih International, Yusuf Ali, other)? | Product | Before development starts |
| 2 | Which reciter(s) to support at launch? Where are audio files hosted? | Product + Engineering | Before development starts |
| 3 | Is tafsir included in MVP or deferred? If included, which tafsir source? | Product | Before development starts |
| 4 | What is the exact streak reset threshold -- 24h, 48h, or end of Islamic day (Maghrib)? | Product + Community advisors | Before development starts |
| 5 | Do we need scholar/community review of engagement mechanics before launch? | Product | Before beta |
| 6 | What analytics platform aligns with privacy-first approach? | Engineering | Before launch |
| 7 | How do we handle Quran text verification and accuracy certification? | Product + Content | Before development starts |
| 8 | Should the daily ayah be random, sequential, or curated by theme? | Product | Before development starts |

---

## Next Steps

This product brief provides the strategic foundation for all subsequent design and development work:

- [ ] **Phase 2: Trigger Mapping** -- Map user psychology to engagement hooks and daily return triggers
- [ ] **Phase 3: UX Scenarios** -- Define detailed interaction flows for each mode
- [ ] **Phase 4: Design System** -- Build component library with Arabic typography system
- [ ] **Phase 5: PRD** -- Technical requirements document for development handoff
- [ ] **Phase 6: Testing Plan** -- QA strategy for cross-browser, RTL, and accessibility
- [ ] **Phase 7: Development** -- Build, ship, iterate

---

**Status:** Product Brief Complete
**Next Phase:** Trigger Mapping (Phase 2)
**Last Updated:** 2026-03-24

---

_Generated by Mary, Strategic Business Analyst -- BMAD Workflow_
