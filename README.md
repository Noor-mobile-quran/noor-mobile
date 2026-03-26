<h1 align="center">نور</h1>

<h3 align="center">Your Daily Quran Companion</h3>

<p align="center">
  Beautiful. Reverent. Personal.<br/>
  The Quran app that feels like opening a mushaf — not a productivity tool.
</p>

---

### See it in action

<p align="center">
  <img src="assets/screenshots/home.png" width="250" alt="Home Screen" />
  <img src="assets/screenshots/reading.png" width="250" alt="Reading View" />
  <img src="assets/screenshots/journey-explore.png" width="250" alt="Knowledge Explorer" />
</p>

<p align="center">
  <img src="assets/screenshots/quran.png" width="250" alt="Surah Index" />
  <img src="assets/screenshots/journey-completion.png" width="250" alt="Quran Completion" />
  <img src="assets/screenshots/settings.png" width="250" alt="Settings" />
</p>

---

### Read the Quran your way

Noor gives you three reading modes designed around how you actually read:

- **Serene** — Clean, distraction-free. Just you and the Quran. Perfect for your daily reading on the commute.
- **Immersive** — Dark, atmospheric, with auto-advancing audio recitation. Made for deep reading at Fajr.
- **Study** — Side-by-side translation, inline notes, bookmarks. For your weekend tafsir sessions.

### Hear it beautifully recited

Choose from 6 world-renowned reciters including Mishary Al-Afasy, Abdul Basit, Sudais, Maher Al-Muaiqly, Husary, and Minshawi. Play ayah-by-ayah or let it flow continuously.

### Read in your language

Full Quran in Arabic with English and Urdu translations. Switch between languages anytime. Arabic text rendered in beautiful Amiri calligraphy with proper diacritical marks.

### Explore deeper

Noor includes a one-of-a-kind **Knowledge Explorer** — 222 Quranic entities (prophets, angels, places, themes, events, divine attributes) mapped across surahs. Follow the story of Yusuf (AS) across 7 surahs. Trace every mention of patience in the Quran. No other app does this.

### Track your journey

- See your Quran completion at a glance — all 114 surahs on one screen
- Track progress through 30 Juz with visual progress rings
- Save bookmarks with personal reflections
- Search any word across all 6,236 ayahs

### Share what moves you

Long-press any ayah to share a beautiful card with Arabic text, translation, and surah reference — perfect for WhatsApp, Instagram, or your family group chat.

### Designed with intention

Noor's warm cream, gold, and forest green palette was designed to feel reverent — like holding a real mushaf. No neon colors. No gamified badges. No guilt trips about missed days. Just beauty that invites you back.

Light mode, dark mode, and high contrast. Adjustable font sizes. Full accessibility support.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 55 + React Native 0.83 |
| Language | TypeScript |
| Routing | Expo Router (file-based) |
| Styling | NativeWind 4 (Tailwind CSS for RN) |
| State | Zustand 5 + MMKV (native) / localStorage (web) |
| Data fetching | TanStack React Query 5 |
| Animation | React Native Reanimated |
| Audio | expo-av |
| Typography | Amiri (Arabic) + Inter (Latin) |

Quran text and audio come from the [Al-Quran Cloud API](https://alquran.cloud/api). No API key needed — it's free and open. The app also bundles all 114 surahs as local JSON, so it works offline for reading.

---

## Developer Setup

Follow these steps in order. Steps 1-5 are tools you install **before** cloning. Steps 6-9 are the app itself.

### 1. Prerequisites

Make sure you have these installed:

- **Node.js** (v20 or later) — we recommend using [nvm](https://github.com/nvm-sh/nvm) to manage versions
- **npm** (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)

```bash
node -v    # should be v20+
npm -v     # should be 10+
git --version
```

### 2. Install Claude Code CLI

Claude Code is our AI-powered development assistant. We use it for code generation, reviews, QA, and design feedback.

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

On first run, it will ask you to authenticate with your Anthropic account.

> **Note:** You need an Anthropic account with API access. Ask the team lead if you need an invite.

### 3. Install Superpowers (Skills & Workflows)

Adds specialized skills to Claude Code — design review, debugging, shipping, QA, and more.

```bash
claude install-skill https://github.com/gstack-gg/superpowers
```

### 4. Install gstack (Browser & QA Tools)

Gives Claude Code a real headless Chromium browser for QA testing and web browsing.

```bash
claude install-skill https://github.com/gstack-gg/gstack
```

### 5. Install Vestige (Cognitive Memory)

Vestige gives Claude Code persistent memory across sessions using spaced repetition. Follow the setup instructions at [samvallad33/vestige](https://github.com/samvallad33/vestige) to configure it as an MCP server. The README there has copy-paste config for `claude_desktop_config.json`.

### 6. Clone the Noor App

```bash
git clone https://github.com/Noor-mobile-quran/noor-mobile.git
cd noor-mobile
```

### 7. Install Dependencies

```bash
npm install
```

### 8. Run the App

```bash
npx expo start
```

From here:

- **`w`** — open in your web browser
- **`i`** — open in iOS Simulator (macOS only, requires Xcode)
- **`a`** — open on Android Emulator (requires Android Studio)
- **Scan QR code** — open on your physical device with [Expo Go](https://expo.dev/go)

> **Troubleshooting:** If `expo start` fails, try `npx expo start --clear` to reset the bundler cache. If you get a port conflict, kill the process on port 8081 or use `npx expo start --port 8082`.

### 9. Start Claude Code

Open a terminal in the project root and run:

```bash
claude
```

Claude Code automatically reads two key files from the repo:

- **`CLAUDE.md`** — Tech stack, architecture, file structure, design rules, and UX modes (Serene/Immersive/Study). **Read this file before making any UI changes** — it defines how the app should look and behave.
- **`.impeccable.md`** — Deep design context: brand personality, color palette (cream/gold/forest), typography rules, accessibility requirements, and anti-patterns to avoid.

You don't need to install anything for these — they're already in the repo and Claude Code picks them up on startup.

### Recommended Tools (Optional)

| Tool | Purpose | Install |
|------|---------|---------|
| [Expo Go](https://expo.dev/go) | Test on your physical device | App Store / Play Store |
| [VS Code](https://code.visualstudio.com/) | Code editor | Download from site |

---

## Project Structure

```
app/              — Expo Router screens (file-based routing)
  (tabs)/         — Tab navigator (Home, Quran, Journey, Settings)
  surah/[id].tsx  — Reading view with Serene/Immersive/Study modes
components/       — Shared UI components
  ornaments/      — SVG Islamic ornaments
  ui/             — Primitives (ArabicText, GoldShimmer)
hooks/            — Custom hooks (useAudioPlayer, useQuranData)
theme/            — Colors, typography, ThemeProvider
store/            — Zustand state management
assets/
  data/           — Bundled Quran JSON (114 surahs)
  knowledge/      — HyperGraph (entities, themes, narratives)
  fonts/          — Amiri + Inter font files
```

---

## For Team Members

If you've been invited as a collaborator, welcome! Here's how we work:

- **All development goes through Claude Code** — use it for implementation, reviews, and QA
- **Read `CLAUDE.md` before writing any code** — it has the design rules and architecture decisions
- **No emoji in UI** — all icons are SVG via react-native-svg
- **No gamification** — no badges, leaderboards, or guilt-based motivation
- **Three UX modes** matter: Serene (minimal), Immersive (dark + audio), Study (translations + notes). Know which mode your code affects.

Questions? Reach out to the team lead.

### License

MIT

### Acknowledgments

[Al-Quran Cloud API](https://alquran.cloud/api) for Quran text and audio | [Amiri](https://www.amirifont.org) typeface by Khaled Hosny | [Inter](https://rsms.me/inter/) typeface by Rasmus Andersson
