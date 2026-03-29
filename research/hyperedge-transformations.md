# N-ary Hyperedge Transformations — Template Examples

Generated: 2026-03-29 | Researcher: Zhongli (Claude Peer elfjskmb)

---

## Hyperedge Types Taxonomy

- `relational_fact` — discrete theological/factual claim
- `narrative_arc` — multi-event story spanning significant passages
- `legal_ruling` — jurisprudential directive with spiritual framing
- Future: `theological_concept`, `eschatological_event`, `parable`, `dua_pattern`

## Role Vocabulary

Controlled vocabulary for graph queries: `commander`, `subject`, `antagonist`, `messenger`, `theme`, `instrument_of_*`, `granter`, `recipient`, `tester`, `tested_subject`, `warner`, `rejectors`, `protagonist`, `legislator`, `prohibited_practice`, `virtuous_contrast`

## Entity ID Prefixes

`prophet_`, `group_`, `entity_`, `concept_`, `object_`, `event_`, `force_`, `angel_`, `figure_`

---

## Transformation 1: Adam's Creation & Angelic Prostration

**Type:** `relational_fact` | **Weight:** 0.97

```json
{
  "id": "he_angelic_prostration_to_adam",
  "type": "relational_fact",
  "label": "Allah commands angels to prostrate to Adam; all obey except Iblis who refuses out of arrogance",
  "members": [
    { "id": "entity_allah", "role": "commander" },
    { "id": "prophet_adam", "role": "honored_subject" },
    { "id": "group_angels", "role": "obedient_agents" },
    { "id": "iblis", "role": "refuser" }
  ],
  "grounding_ayahs": [
    { "surah": 2, "ayah_range": [34, 34] },
    { "surah": 7, "ayah_range": [11, 12] },
    { "surah": 15, "ayah_range": [28, 31] },
    { "surah": 17, "ayah_range": [61, 62] },
    { "surah": 18, "ayah_range": [50, 50] },
    { "surah": 20, "ayah_range": [116, 116] },
    { "surah": 38, "ayah_range": [71, 76] }
  ],
  "weight": 0.97
}
```

## Transformation 2: Musa & Fir'awn — Prophetic Confrontation

**Type:** `narrative_arc` | **Weight:** 0.96

```json
{
  "id": "he_musa_firawn_confrontation",
  "type": "narrative_arc",
  "label": "Allah sends Musa (with Harun) to confront Fir'awn's tyranny and demand liberation of Bani Isra'il",
  "members": [
    { "id": "entity_allah", "role": "sender" },
    { "id": "prophet_musa", "role": "primary_messenger" },
    { "id": "prophet_harun", "role": "supporting_messenger" },
    { "id": "firawn", "role": "antagonist" },
    { "id": "group_bani_israil", "role": "oppressed_community" }
  ],
  "grounding_ayahs": [
    { "surah": 7, "ayah_range": [103, 137] },
    { "surah": 10, "ayah_range": [75, 82] },
    { "surah": 20, "ayah_range": [9, 56] },
    { "surah": 26, "ayah_range": [10, 68] },
    { "surah": 28, "ayah_range": [31, 42] },
    { "surah": 79, "ayah_range": [15, 26] }
  ],
  "weight": 0.96
}
```

## Transformation 3: Ibrahim's Trial of Sacrificing His Son

**Type:** `relational_fact` | **Weight:** 0.94

```json
{
  "id": "he_ibrahim_sacrifice_trial",
  "type": "relational_fact",
  "label": "Allah tests Ibrahim with the command to sacrifice his son; both submit, and Allah ransoms the son with a great sacrifice",
  "members": [
    { "id": "entity_allah", "role": "tester" },
    { "id": "prophet_ibrahim", "role": "tested_subject" },
    { "id": "prophet_ismail", "role": "willing_offering" },
    { "id": "concept_tawakkul", "role": "theme" },
    { "id": "concept_submission", "role": "theme" }
  ],
  "grounding_ayahs": [
    { "surah": 37, "ayah_range": [100, 111] },
    { "surah": 2, "ayah_range": [124, 124] }
  ],
  "weight": 0.94
}
```

## Transformation 4: The Flood of Nuh

**Type:** `narrative_arc` | **Weight:** 0.95

```json
{
  "id": "he_nuh_flood_narrative",
  "type": "narrative_arc",
  "label": "Nuh warns his people for centuries; they reject him; Allah commands the Ark and sends the Flood as divine punishment, saving only the believers",
  "members": [
    { "id": "entity_allah", "role": "judge" },
    { "id": "prophet_nuh", "role": "warner" },
    { "id": "group_people_of_nuh", "role": "rejectors" },
    { "id": "object_ark", "role": "instrument_of_salvation" },
    { "id": "event_flood", "role": "instrument_of_punishment" }
  ],
  "grounding_ayahs": [
    { "surah": 7, "ayah_range": [59, 64] },
    { "surah": 11, "ayah_range": [25, 49] },
    { "surah": 23, "ayah_range": [23, 30] },
    { "surah": 26, "ayah_range": [105, 122] },
    { "surah": 29, "ayah_range": [14, 15] },
    { "surah": 54, "ayah_range": [9, 16] },
    { "surah": 71, "ayah_range": [1, 28] }
  ],
  "weight": 0.95
}
```

## Transformation 5: Maryam & the Miraculous Birth of Isa

**Type:** `relational_fact` | **Weight:** 0.95

```json
{
  "id": "he_maryam_miraculous_birth_isa",
  "type": "relational_fact",
  "label": "Allah decrees the miraculous virgin birth of Isa through Maryam, announced by Jibril, as a sign for humanity",
  "members": [
    { "id": "entity_allah", "role": "decreer" },
    { "id": "maryam", "role": "chosen_mother" },
    { "id": "prophet_isa", "role": "miraculous_child" },
    { "id": "angel_jibril", "role": "announcer" },
    { "id": "concept_miracle", "role": "theme" }
  ],
  "grounding_ayahs": [
    { "surah": 3, "ayah_range": [42, 49] },
    { "surah": 19, "ayah_range": [16, 34] },
    { "surah": 21, "ayah_range": [91, 91] },
    { "surah": 66, "ayah_range": [12, 12] }
  ],
  "weight": 0.95
}
```

## Transformation 6: Yusuf — Betrayal & Divine Vindication

**Type:** `narrative_arc` | **Weight:** 0.96

```json
{
  "id": "he_yusuf_betrayal_vindication_arc",
  "type": "narrative_arc",
  "label": "Yusuf's brothers betray him out of jealousy; through slavery, prison, and patience, Allah elevates him to authority in Egypt and reunites the family through forgiveness",
  "members": [
    { "id": "entity_allah", "role": "planner" },
    { "id": "prophet_yusuf", "role": "protagonist" },
    { "id": "group_brothers_of_yusuf", "role": "antagonists_turned_penitent" },
    { "id": "prophet_yaqub", "role": "grieving_father" },
    { "id": "concept_sabr", "role": "theme" },
    { "id": "concept_forgiveness", "role": "theme" }
  ],
  "grounding_ayahs": [
    { "surah": 12, "ayah_range": [4, 101] }
  ],
  "weight": 0.96
}
```

## Transformation 7: Sulayman — Supernatural Dominion

**Type:** `relational_fact` | **Weight:** 0.93

```json
{
  "id": "he_sulayman_supernatural_dominion",
  "type": "relational_fact",
  "label": "Allah grants Sulayman unprecedented dominion over jinn, wind, and the speech of animals as divine gifts",
  "members": [
    { "id": "entity_allah", "role": "granter" },
    { "id": "prophet_sulayman", "role": "recipient_king" },
    { "id": "group_jinn", "role": "subjected_beings" },
    { "id": "force_wind", "role": "subjected_element" },
    { "id": "group_animals", "role": "communicative_subjects" }
  ],
  "grounding_ayahs": [
    { "surah": 21, "ayah_range": [81, 82] },
    { "surah": 27, "ayah_range": [15, 44] },
    { "surah": 34, "ayah_range": [12, 14] },
    { "surah": 38, "ayah_range": [36, 40] }
  ],
  "weight": 0.93
}
```

## Transformation 8: Riba (Usury) — Prohibition & Spiritual Consequence

**Type:** `legal_ruling` | **Weight:** 0.91

```json
{
  "id": "he_riba_prohibition_framework",
  "type": "legal_ruling",
  "label": "Allah categorically prohibits riba, contrasting it with sadaqah/zakat; riba destroys wealth while charity multiplies it",
  "members": [
    { "id": "entity_allah", "role": "legislator" },
    { "id": "concept_riba", "role": "prohibited_practice" },
    { "id": "concept_sadaqah", "role": "virtuous_contrast" },
    { "id": "concept_zakat", "role": "virtuous_contrast" },
    { "id": "concept_barakah", "role": "spiritual_consequence" }
  ],
  "grounding_ayahs": [
    { "surah": 2, "ayah_range": [275, 281] },
    { "surah": 3, "ayah_range": [130, 130] },
    { "surah": 4, "ayah_range": [161, 161] },
    { "surah": 30, "ayah_range": [39, 39] }
  ],
  "weight": 0.91
}
```

---

## Key Principles for Full Dataset Conversion

1. **The old structure recorded what appears where. The new structure records what is true, and where the evidence lies.**
2. Per-ayah entries describing the same relational fact across surahs collapse into one hyperedge with multiple grounding ranges
3. Ayah ranges should be generous enough to capture full context
4. Weight reflects: frequency of cross-surah attestation, centrality to theology, scholarly consensus
5. Roles should be drawn from a controlled vocabulary to enable graph queries
6. Entity ID prefixes must be formalized before full conversion
