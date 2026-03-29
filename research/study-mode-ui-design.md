# Study Mode UI — HyperGraph Knowledge Panel Design

Generated: 2026-03-29 | Researcher: Hu Tao (Claude Peer hk3gd6l6)

---

## 1. Ayah Tap → Knowledge Panel

### 3-Stage Bottom Sheet (Mobile) / Side Panel (Tablet)

| Stage | Height | Content | Trigger |
|-------|--------|---------|---------|
| **Peek** | 25-28% | Ayah ref, 3-5 entity chips, one-line summary | Ayah tap |
| **Half** | 50-52% | Full entity list, cross-refs with text, narrative arc banner | Drag up |
| **Full** | 85-92% | Constellation graph OR full list, deep scholarly content | Drag to full |

**Why bottom sheet:** Inline expansion disrupts sacred text formatting. Full-screen modal breaks reading context. Bottom sheet preserves spatial awareness.

**Tablet:** Side panel at 40% width instead.

**Interaction details:**
- 250ms snap animation, ease-out
- Reading text dims to 60% at Stage 2+
- Ayah stays highlighted while sheet is open
- Swipe down or tap reading area to dismiss

---

## 2. Entity Chips — Color-Coded by Type

| Entity Type | Color | Background | Shape | Icon |
|------------|-------|------------|-------|------|
| **Prophet** | #8B6914 (Gold) | #FFF3D6 | Circle | Crescent/Star |
| **Theme** | #1B4332 (Forest) | #E8F0EB | Rounded Rect | Leaf/Branch |
| **Place** | #7C4A2D (Terracotta) | #FFF0E6 | Diamond | Map Pin |
| **Concept** | #4A3728 (Umber) | #F5EDE6 | Hexagon | Geometric |
| **Narrative** | #6B5B3E (Bronze) | #F7F2E8 | Pill | Thread/Chain |

All pass WCAG AA on cream. Double encoding (shape + color) for colorblind users.

**Chip spec:** min 44px touch target, 13px/500 label, 8px gaps, max 5-6 visible with `+N more` overflow.

**Chip tap:** Shared-element transition — chip animates to become header of theme exploration view.

---

## 3. Cross-Surah Links — Narrative Threads

### Thread Marker (Reading View — Left Margin)
- 2px vertical line, Bronze at 50%
- Continuous for consecutive ayahs in same arc
- Ends with 4px dot + "continues in 28:7" for surah jumps

### Narrative Arc Banner (Bottom Sheet)
```
>> Story of Ibrahim continues in:
Al-Anbiya 21:51-73  ·  As-Saffat 37:83-113
                                    View arc >
```
Left border: 3px solid gold-deco

### Cross-Reference Hierarchy (by relevance)
1. Direct narrative continuations (shown first)
2. Thematic parallels (cards with shared theme chip)
3. Linguistic connections (collapsible, advanced)
4. Scholarly cross-references (deep layer)

**Critical rule:** Show ACTUAL TEXT of cross-references, not just the address.

### Relationship Strength
| Type | Pattern | Weight | Opacity |
|------|---------|--------|---------|
| Direct mention | Solid | 2px | 1.0 |
| Thematic | Dashed | 1.5px | 0.6 |
| Linguistic | Dotted | 1px | 0.35 |

---

## 4. Theme Exploration

**Flow:** Ayah tap → chip tap → theme exploration view

### Layout
- Header: theme name (Arabic + English), close button
- Filters: Makki/Madani, Prophets, Context (as removable chips)
- Results: grouped by surah, ~50 chars text preview each
- Sort: canonical (default), relevance, thematic similarity

### Constellation Graph
Dark inset background (#1A1410) — "sacred observatory" feeling.

- Central node: 6px + 16px radial glow, cream
- Ring 1: 80px radius, 32px nodes, 3-6 items
- Ring 2: 130px radius, 24px nodes at 70%, 0-6 items
- Max 12 visible nodes → list view beyond that
- Ambient stars: 40-60 tiny 1px dots at 5-12% opacity
- Edge pulse: 30%→50%→30%, 4s cycle (respects reduced-motion)

**Graph vs List:** Graph for 3-12 connections with mixed types. List for 12+ or single type. Default to list, remember preference.

---

## 5. Progressive Disclosure

| Level | User | Content | Sheet Stage |
|-------|------|---------|-------------|
| Glance | Casual | 3-5 chips, summary, "continues in..." | Peek (25%) |
| Study | Student | Full entities, cross-refs, arc banner | Half (50%) |
| Research | Scholar | Graph, root analysis, tafsir, export | Full (90%) |

### Accordion Sections (Half-Sheet)
- Related Themes (expanded default)
- Cross-References (collapsed, count badge)
- Narrative Arc (collapsed)
- Arabic Root Analysis (scholar-only)

### Full-Sheet Tabs
- "Connections" — list/card view
- "Explore" — constellation graph

### Study Depth Setting
App settings: Casual / Student / Scholar — controls default expansion.

---

## 6. Depth Indicators

### Margin Depth Dots (Reading View)
- 1-3 connections: 6px dot, gold at 40%
- 4-8 connections: 8px dot, gold at 60%
- 9+ connections: 10px dot, gold at 80%
- 44x44px invisible touch target

### Inline Entity Highlights (Opt-in)
- Translation text only, never Arabic
- 2px underline, entity type color at 40%
- DEFAULT: OFF

### Surah-Level Depth Badge
- Pill: "47 links", forest at 8% bg

---

## 7. Story Mode — Following the Golden Thread

### Header
- Back button, title ("Story of Yusuf"), progress ("3/14")
- Timeline bar: 4px gold, dots at each ayah position

### Reading Cards
- Full-width cards with 3px gold left border
- Arabic text + translation + context note
- Surah dividers between surah changes

---

## 8. Component Architecture

```
StudyMode/
  BottomSheet/
    DragHandle
    AyahHeader
    EntityChipRow → EntityChip
    NarrativeArcBanner
    AccordionSections/
      ThemesSection
      CrossReferencesSection
      NarrativeArcSection
      ArabicRootSection
    ExplorationTabs/
      ConnectionsTab
      ExploreTab (constellation)
  SidePanel/ (tablet)
  StoryMode/
    StoryHeader + TimelineBar
    StoryReadingCard[]
    SurahDivider
```

**Tech:** SVG via D3.js or Visx. NOT WebGL (overkill, battery drain, accessibility issues).

---

## Design Principles

1. Reading experience is sacred — visualization is peripheral until requested
2. Every indicator whispers; nothing shouts
3. Constellation metaphor: "Noor" = light, stars = constellations of meaning
4. Progressive disclosure = progressive respect
5. The golden thread connects everything — make it visible without unraveling the fabric
