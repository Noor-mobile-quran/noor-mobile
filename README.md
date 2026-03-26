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

## Developer Setup

Follow these steps in order to get your development environment ready.

### 1. Prerequisites

Make sure you have these installed on your machine:

- **Node.js** (v20 or later) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)

Verify your installation:

```bash
node -v    # should be v20+
npm -v     # should be 10+
git --version
```

### 2. Install Claude Code CLI

Claude Code is our AI-powered development assistant. Install it globally:

```bash
npm install -g @anthropic-ai/claude-code
```

Verify it works:

```bash
claude --version
```

On first run, it will ask you to authenticate with your Anthropic account. Follow the prompts to log in.

> **Note:** You need an Anthropic account with API access. Ask the team lead if you need an invite.

### 3. Install Superpowers (Skills & Workflows)

Superpowers gives Claude Code a library of specialized skills (design review, debugging, shipping, etc.). Install it:

```bash
claude install-skill https://github.com/gstack-gg/superpowers
```

This adds skills like `/browse`, `/review`, `/ship`, `/qa`, `/design-review`, and many more. You can see the full list by running `/help` inside Claude Code.

### 4. Install gstack (Browser & QA Tools)

gstack gives Claude Code a real headless Chromium browser for QA testing, site dogfooding, and web browsing.

```bash
claude install-skill https://github.com/gstack-gg/gstack
```

This adds the `/browse`, `/qa`, `/qa-only`, and `/setup-browser-cookies` skills among others.

### 5. Install BRV (Context Tree & Skills)

BRV provides context tree management and additional skills for the project.

```bash
claude install-skill https://github.com/varunmoka7/brv
```

The `.brv/` directory in the project root contains the local config — it's already committed.

### 6. Install Vestige (Agents & Orchestration)

Vestige provides multi-agent orchestration capabilities for complex development tasks.

```bash
claude install-skill https://github.com/varunmoka7/vestige
```

### 7. Install BMad Builder Module

BMad provides structured workflows for product development — PRDs, architecture docs, sprint planning, story creation, and more.

Inside the project root, the `_bmad/` directory is already included. Claude Code will pick it up automatically.

### 8. Install Impeccable (Design Intelligence)

Impeccable gives Claude Code deep understanding of our design system. The `.impeccable.md` file in the project root contains Noor's complete design context (colors, typography, brand personality, anti-patterns).

It's already committed to the repo — no extra installation needed. Claude Code reads it automatically.

### 9. Clone the Noor App

```bash
git clone https://github.com/Noor-mobile-quran/noor-mobile.git
cd noor-mobile
```

### 10. Install Dependencies

```bash
npm install
```

### 11. Run the App

```bash
npx expo start
```

This starts the Expo dev server. From here you can:

- **Press `w`** — open in your web browser
- **Press `i`** — open in iOS Simulator (macOS only, requires Xcode)
- **Press `a`** — open on Android Emulator (requires Android Studio)
- **Scan the QR code** — open on your physical device with [Expo Go](https://expo.dev/go)

### 12. Start Claude Code

Open a terminal in the project root and run:

```bash
claude
```

Claude Code will read the `CLAUDE.md` and `.impeccable.md` files automatically, giving it full context about the project's tech stack, architecture, and design system.

### Recommended Tools (Optional)

| Tool | Purpose | Install |
|------|---------|---------|
| [Expo Go](https://expo.dev/go) | Test on your physical device | App Store / Play Store |
| [VS Code](https://code.visualstudio.com/) | Code editor | Download from site |
| [React Native Debugger](https://github.com/nickvdh/react-native-debugger) | Debug React Native apps | `brew install react-native-debugger` |

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

### Built with

Expo + React Native (iOS, Android, Web) | TypeScript | Amiri + Inter typography | Hand-crafted SVG Islamic ornaments

---

### Contributing

Noor is open source and welcomes contributions from anyone who cares about making the Quran more accessible. Whether you're a developer, designer, Arabic linguist, or Islamic studies student — there's a place for you here.

### License

MIT

### Acknowledgments

[Al-Quran Cloud API](https://alquran.cloud/api) for Quran text and audio | [Amiri](https://www.amirifont.org) typeface by Khaled Hosny | [Inter](https://rsms.me/inter/) typeface by Rasmus Andersson
