<h1 align="center">نور</h1>

<h2 align="center">Noor — Your Daily Quran Companion</h2>

<p align="center">
  A daily Quran companion that turns occasional reading into a lifelong habit — through beauty, not pressure.
</p>

---

## Features

### Reading

- Complete Quran — all 114 surahs with Arabic text and English translation
- 3 UX modes: Serene (distraction-free), Immersive (audio-forward), Study (side-by-side with tafsir)
- Configurable font sizes for comfortable extended reading

### Engagement

- Daily reading streaks to build consistency
- Daily featured ayah on the home screen
- Progress tracking by juz and surah
- Bookmarks with personal notes and reflections
- Reading goals to guide your journey

### Design

- Islamic SVG ornaments (crescent, star, geometric patterns)
- Amiri calligraphy for Arabic text
- Warm gold, cream, and earth palette
- 3 themes: Light, Dark, and High Contrast

### Accessibility

- WCAG 2.1 AA compliant
- Full RTL Arabic with screen reader support
- 44px minimum touch targets
- High contrast mode for low-vision readers

### Performance

- ~15–20MB app size
- All Quran data bundled offline — no internet required to read
- Audio recitation streams on-demand
- <2s cold start load time

---

## Design Principles

1. **Sacred content, sacred space** — the UI serves the Quran, never competes with it. No clutter, no distractions.
2. **Typography is the interface** — Amiri + Inter, generous whitespace, proper RTL. The text is the design.
3. **Habit through beauty, not pressure** — gentle encouragement, never guilt. A missed day is met with a warm return.
4. **Warm minimalism** — cream, gold, and earth palette with intentional Islamic ornaments. Clean but never cold.
5. **Adapt to the reader** — 3 UX modes, configurable fonts, light/dark/high-contrast. The app reshapes around you.

---

## Color Palette

| Color         | Hex       | Usage                                    |
|---------------|-----------|------------------------------------------|
| Cream         | `#FFF9ED` | Light background                         |
| Gold          | `#D4A843` | Primary accent                           |
| Forest Green  | `#1B4332` | Deep accent (Kaaba/Prophet's dome inspired) |
| Sand          | `#D4B896` | Secondary text                           |
| Earth         | `#2D261C` | Headings                                 |
| Midnight      | `#1A1410` | Dark mode background                     |

---

## Tech Stack

| Technology              | Purpose                    |
|-------------------------|----------------------------|
| Expo SDK 55             | React Native framework     |
| React Native 0.76       | Mobile UI                  |
| TypeScript 5.9          | Type safety                |
| NativeWind 4            | Tailwind CSS for RN        |
| Zustand 5               | State management           |
| MMKV                    | Fast persistent storage    |
| expo-av                 | Audio recitation           |
| react-native-svg        | Islamic ornaments          |
| React Native Reanimated | Animations                 |
| TanStack Query          | Data fetching              |

---

## Quick Start

```bash
git clone https://github.com/varunmoka7/noor-mobile.git
cd noor-mobile && npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## Project Structure

```
app/           — Expo Router pages (tabs + reading view)
components/    — React Native components
├── ornaments/ — SVG Islamic ornaments (Crescent, Star, Flower)
└── ui/        — Shared primitives (ArabicText, GoldShimmer)
theme/         — Color tokens, typography, ThemeProvider
store/         — Zustand state management
hooks/         — Data fetching + audio player
assets/        — Fonts (Amiri, Inter) + Quran JSON data
types/         — TypeScript interfaces
```

---

## Contributing

Noor welcomes contributions from developers, designers, and anyone who cares about making the Quran more accessible. Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

---

## License

MIT

---

## Acknowledgments

- [Al-Quran Cloud API](https://alquran.cloud/api) — Quran text and audio data
- [Amiri](https://www.amirifont.org) — Arabic calligraphy typeface by Khaled Hosny
- [Inter](https://rsms.me/inter/) — UI typeface by Rasmus Andersson
