# UX/UI Design Research — Noor App

Generated: 2026-03-29 | Researcher: Hu Tao (Claude Peer hk3gd6l6)

---

## 1. Islamic Design Patterns in Modern Apps

### Geometric Patterns — Ambient Texture, Not Foreground
- Best apps treat patterns as 5-10% opacity background texture
- Quran.com: Nearly zero ornament in reading. Geometric identity in splash/onboarding only
- Pillars App: ZERO geometric ornament. Relies on spacing, typography, color
- **What works:** Subtle SVG tessellations (8-point star) at 5% opacity. Thin geometric bands (32-48px) as dividers
- **What's dead:** Full-bleed geometric backgrounds, 3D/embossed patterns, skeuomorphic metallic effects

### Calligraphy — "One Loud Voice in a Quiet Room"
- Hard line between decorative calligraphy vs. readable Arabic content
- Calligraphic fonts ONLY for Quranic verses and sacred text, never for UI labels/buttons

**Font Pairing:**
| Context | Arabic Font | Latin Font | Size |
|---------|------------|------------|------|
| Quranic verse | KFGQPC Uthman Taha Naskh | — | 22-28px |
| Surah headers | Surah Header Font (color font) | — | 32-40px |
| UI body | Noto Sans Arabic | Inter / SF Pro | 16-18px |
| Calligraphic hero | Digital Khatt or Amiri | — | 48-72px |

### Anti-Patterns
| Anti-Pattern | Fix |
|-------------|-----|
| Neon green (#00FF00) | Deep emerald (#15803D-#166534) |
| Full-screen mosque photo backgrounds | Line-art silhouette or nothing |
| Multiple ornamental borders per card | One subtle moment per screen |
| Calligraphic font on buttons | System font for UI |
| "Leather book" texture | Clean surfaces with warm tint |
| Gold text on white (~2.5:1 contrast) | Gold for decorative only |

---

## 2. Reading App UX Best Practices

### Typography Controls — "Aa" Pattern
- Universal "Aa" button → bottom sheet with live preview
- All changes apply instantly — no "apply" button
- Kindle: 14-step slider. Apple Books: increment/decrement only. Kobo: power-user paradise

### Dark Mode — Critical Numbers
| App | Dark BG | Text Color |
|-----|---------|-----------|
| Kindle | #000000 | #C8C8C8 |
| Apple Books | #000000 | #B0B0B0 |
| Google Play | #1F1F1F | #E0E0E0 |
| Kobo | #121212 | #CCCCCC |

**CRITICAL:** Dark mode text is NEVER pure white (#FFFFFF). Always #B0B0B0 to #E0E0E0. Pure white causes halation.

**Sepia is king:** 40-50% of users prefer sepia (#F4ECD8 bg, #453726 text) over white or dark.

### Distraction-Free Reading
- Default: ZERO chrome. Content IS the interface
- Tap center: Toolbars fade in (200ms). Tap again: fade out (300ms)
- Tap zones: Right = next, Left = previous, Center = toggle UI
- Progress: 2-3px bar at bottom
- Toolbars overlay content (with dim), never push content down

### Audio Integration
- Kindle Whispersync = gold standard (position sync, karaoke highlighting)
- MVP: ayah-level timestamp mapping. Word-level is expensive and fragile
- Speed: 0.5x to 3x, 0.1x increments
- Sleep timer with "End of surah" as most-used option

---

## 3. The Three UX Modes

### Golden Rule
"Three modes are three LENSES on the same content at the same position. Never lose the user's place during a mode switch."

### Mode Switching
- Segmented pill control (not tabs, not gestures, not settings)
- 300ms cross-fade, NOT a page navigation

### Mode Atmospheres

**Serene** (Reading):
- Warm cream #FFF9ED, generous margins, large Arabic text
- Minimal chrome — text + subtle progress indicator
- Like a quiet library at golden hour

**Immersive** (Listening):
- Dark #1A1410, auto-advancing audio recitation
- Current ayah highlighted karaoke-style
- Like nighttime prayer — contemplative, cinematic

**Study** (Learning):
- Denser layout with translation alongside Arabic
- Progressive disclosure: interlinear → expanded tafsir → bottom sheet commentary
- Note-taking, cross-references, word-by-word analysis
- Like a scholar's desk — organized, layered

### Reference Apps
- YouVersion Bible: Has Reader/Audio/Study modes — closest parallel
- Logos Bible: Excellent study mode with split-pane
- Headspace: Great mode-switching patterns

---

## 4. Onboarding for Sacred Apps

### Core Insight
"The best sacred app onboarding treats the first launch as a THRESHOLD, not a funnel."

### What Works
- Hallow: Opens with calm dark screen + ambient sound. Intention-based options
- Headspace: One question → ONE recommended session. First session IS the onboarding
- Calm: Ambient sound from first screen. Almost no questions

### Anti-Patterns
| Pattern | Why It Fails |
|---------|-------------|
| Streaks | Turns worship into obligation |
| Points/XP | Reduces sacred engagement to score |
| Leaderboards | Competitive spirituality is problematic |
| "Begin your journey to become a better Muslim" | Presumptuous |
| Premature notification requests | Ask AFTER first meaningful interaction |
| Subscription push on first launch | Funnel, not welcome |

### Proposed 3-Screen Onboarding

**Screen 1 — Welcome:** "Noor" + "A companion for your time with the Quran." Single button: "Begin"
**Screen 2 — Language:** Arabic only / Arabic+English / English+Arabic (reveals language level without asking)
**Screen 3 — Starting Point:** Al-Fatiha / curated short surah / surah index
**Screen 4 — There is no Screen 4. The user is now reading.**

Total: 3 screens, under 30 seconds, zero accounts, zero permissions.

### Tone Guidelines
- DO: "Welcome to Noor."
- DO: "You were reading Surah Al-Baqarah, ayah 142."
- DON'T: "Your ultimate Quran experience!"
- DON'T: "You missed yesterday!"

---

## 5. Color Palette Validation

### Your Palette: 80% Ready

**Three excellent colors:**
- Cream #FFF9ED — Beautiful warm base
- Forest #1B4332 — 10.56:1 contrast on cream (AAA!)
- Dark bg #1A1410 — Warm chocolate-dark, outperforms defaults

**One critical fix: Gold #D4A843**
- On cream: only ~2.8:1 contrast — FAILS WCAG for text
- Solution: Split gold into TWO tokens:
  - `--gold-ornament`: #D4A843 (decorative only)
  - `--text-gold`: #8B6914 (4.85:1 on cream — passes AA for text)

### Complete Design Token System

**Text Colors:**
| Token | Light Mode | Contrast | Dark Mode | Contrast |
|-------|-----------|----------|-----------|----------|
| --text-primary | #1B4332 | 10.56:1 AAA | #FFF9ED | 17.39:1 AAA |
| --text-secondary | #6B5C4D | 6.14:1 AA | #A89880 | 6.49:1 AA |
| --text-gold | #8B6914 | 4.85:1 AA | #D4A843 | 8.23:1 AAA |

**Surface Colors:**
| Token | Light | Dark |
|-------|-------|------|
| --surface-base | #FFF9ED | #1A1410 |
| --surface-raised | #FFFFFF | #241E17 |
| --surface-elevated | #FFFFFF | #2E261E |
| --surface-overlay | #FFFFFF | #382F26 |

**Semantic Colors (warm-shifted):**
| Token | Light | Dark |
|-------|-------|------|
| --color-error | #B5432A (terracotta) | #D4745A |
| --color-success | #276749 (forest) | #7DB87A |
| --color-warning | #8B6914 (gold) | #E9B44C |
| --color-info | #1B4332 (forest) | #93B5C6 |

**UI Chrome:**
| Token | Light | Dark |
|-------|-------|------|
| --border-subtle | #E8DFD0 | #2E261E |
| --border-default | #DDD4C4 | #382F26 |
| --gold-ornament | #D4A843 | #D4A843 |
| --focus-ring | #1B4332 | #D4A843 |

---

## Design Principles Summary

1. **Typography IS your Islamic identity** — beautiful Quranic rendering does more than any pattern
2. **Restraint is reverence** — most respected apps have the LEAST decoration
3. **First launch is a threshold, not a funnel**
4. **Three modes, one position** — never lose the user's place
5. **Habit through beauty, not pressure** — no streaks, no guilt
6. **Dark mode is not optional** — primary mode for night prayer. Design first or in parallel
7. **One ornamental moment per screen**
8. **Split your gold** — #D4A843 for decoration, #8B6914 for text on light backgrounds
