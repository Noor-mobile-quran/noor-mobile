# Research Report: Quran.com API & Tanzil.net Data Sources
Generated: 2026-03-25

## Summary
The Quran.com ecosystem provides two API layers: the legacy `api.quran.com/api/v4` (free, no auth, widely used) and the newer Quran Foundation API at `api-docs.quran.foundation` (OAuth2 required). Both offer chapters, verses, translations, tafsir, audio, word-by-word data, and search. Tanzil.net provides downloadable XML/text files with full Quran text and rich structural metadata. Topic/theme tagging per ayah is NOT natively available in the Quran.com API — external resources like corpus.quran.com or qul.tarteel.ai are needed for that.

---

## 1. API Base URLs & Documentation

### Legacy API (v4) — Still Functional
- **Base URL:** `https://api.quran.com/api/v4`
- **Auth:** None required (free, open access)
- **Rate Limits:** No documented rate limits
- **Status:** Still operational but transitioning to the Foundation API

### Quran Foundation API (newer)
- **Documentation:** https://api-docs.quran.foundation/
- **Quick Start:** https://api-docs.quran.foundation/docs/quickstart/
- **Auth:** OAuth2 Client Credentials flow (requires `x-auth-token` and `x-client-id` headers)
- **Token validity:** 1 hour (3600 seconds)
- **Scope:** `content` for content APIs

### Alternative Free APIs (no auth, no rate limits)
- **alquran.cloud:** https://alquran.cloud/api
- **quranapi.pages.dev:** https://quranapi.pages.dev/

---

## 2. Available Endpoints (Legacy v4 Base: `https://api.quran.com/api/v4`)

### Chapters / Surahs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chapters` | GET | List all 114 chapters with metadata |
| `/chapters/{id}` | GET | Single chapter info |
| `/chapters/{id}/info` | GET | Extended chapter info (description, etc.) |

**Response fields:** `id`, `revelation_place`, `revelation_order`, `bismillah_pre`, `name_simple`, `name_complex`, `name_arabic`, `verses_count`, `pages`, `translated_name`

### Verses / Ayahs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/verses/by_chapter/{chapter_number}` | GET | All verses in a chapter |
| `/verses/by_page/{page_number}` | GET | Verses by Mushaf page |
| `/verses/by_juz/{juz_number}` | GET | Verses by Juz |
| `/verses/by_hizb/{hizb_number}` | GET | Verses by Hizb |
| `/verses/by_key/{verse_key}` | GET | Specific verse (e.g., `2:255`) |

**Query Parameters:**
- `translations` — comma-separated translation IDs (get IDs from `/resources/translations`)
- `language` — ISO language code (default: `en`)
- `words` — boolean, include word-by-word data
- `word_fields` — fields for each word (e.g., `text_uthmani,translation`)
- `fields` — verse fields to include
- `page` — pagination page number
- `per_page` — results per page

**Verse response fields:** `id`, `verse_number`, `verse_key`, `hizb_number`, `rub_el_hizb_number`, `ruku_number`, `manzil_number`, `sajdah_number`, `text_uthmani`, `text_imlaei`, `juz_number`, `page_number`, `words[]`, `translations[]`

### Translations
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/resources/translations` | GET | List all available translations with IDs |
| `/quran/translations/{translation_id}` | GET | Full translation text |

**Notable translation IDs:**
- English (Sahih International): commonly used default
- Check `/resources/translations` for full list with language codes

### Tafsir (Exegesis)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/resources/tafsirs` | GET | List all available tafsirs |
| `/tafsirs/{tafsir_id}/by_ayah/{verse_key}` | GET | Tafsir for a specific verse |

**Key Tafsir IDs:**
| ID | Name | Language | Slug |
|----|------|----------|------|
| 169 | Tafsir Ibn Kathir (abridged) | English | `en-tafisr-ibn-kathir` |
| 14 | Tafsir Ibn Kathir | Arabic | `ar-tafsir-ibn-kathir` |
| 15 | Tafsir al-Tabari | Arabic | `ar-tafsir-al-tabari` |
| 16 | Tafsir Muyassar | Arabic | `ar-tafsir-muyassar` |

**Answer to "Can we get Tafsir Ibn Kathir per ayah?":** YES. Use `/tafsirs/169/by_ayah/2:255` for English Ibn Kathir on Ayat al-Kursi.

### Word-by-Word Analysis
When fetching verses with `?words=true`, each verse includes a `words[]` array where each word contains:
- `text_uthmani` — Arabic text (Uthmani script)
- `text_imlaei` — Arabic text (Imla'ei script)
- `translation` — Word translation object
- `transliteration` — Romanized text
- `position` — Word position in verse
- `char_type_name` — "word" or "end" (verse end marker)

### Audio / Recitations
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/resources/recitations` | GET | List available reciters |
| `/chapter_recitations/{reciter_id}` | GET | All chapter audio files for a reciter |
| `/chapter_recitations/{reciter_id}/{chapter_number}` | GET | Single chapter audio |
| `/recitations/{recitation_id}/by_ayah/{verse_key}` | GET | Verse-level audio |

**Response includes:** `audio_url`, `file_size`, `format` (mp3), and segment timestamps for word-level playback.

### Search
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/search` | GET | Full-text search across verses and translations |

**Parameters:**
- `q` (alias: `query`) — search string, max 250 UTF-8 chars, HTML stripped
- `size` (alias: `s`, `per_page`) — results per page (max 50, default 10)
- `page` — page number
- `language` (alias: `locale`) — ISO language code to boost translations in that language

---

## 3. Topics / Themes Per Verse

**The Quran.com API does NOT provide topic or theme tags per ayah.**

For topic/entity tagging, use these external resources:

| Resource | URL | What it provides |
|----------|-----|------------------|
| Quranic Arabic Corpus | https://corpus.quran.com/ | Morphological annotation, syntactic treebank, semantic ontology |
| Quranic Ontology | https://corpus.quran.com/ontology.jsp | Named entity tags linked to ontology concepts, based on hadith and tafsir |
| Quranic Universal Library | https://qul.tarteel.ai/ | Core themes/topics per ayah, semantic relations between concepts |
| Semantic Quran API | https://github.com/hasankhan/semantic-quran-api | REST API for semantic Quran data |

---

## 4. Bulk Download vs Per-Verse Requests

- The v4 API is **paginated** — `/verses/by_chapter/{id}` returns paginated results (use `per_page` and `page` params)
- There is **no single bulk-download endpoint** for the entire Quran via the API
- **Practical approach:** Loop through chapters 1-114, fetch all verses per chapter with translations. A scraper exists: https://github.com/SyahmiRafsan/quran-api-scraper
- **For offline/bulk data:** Use Tanzil.net downloads instead (see below)

---

## 5. Tanzil.net Data Downloads

**URL:** https://tanzil.net/download/

### Available Text Formats
| Format | Description |
|--------|-------------|
| XML | Structured `<quran><sura><aya>` hierarchy |
| Text (plain) | Simple text with verse markers |
| SQL | Database-ready format |

### Script Variants Available
- **Simple** — Standard Arabic script
- **Simple (Enhanced)** — With additional diacritics
- **Simple (Minimal)** — Minimal diacritics
- **Simple (Clean)** — No diacritics
- **Uthmani** — Traditional Uthmani Mushaf script
- **Uthmani (Minimal)** — Uthmani with minimal marks

### Metadata File: `quran-data.xml`
**URL:** https://tanzil.net/docs/quran_metadata

Contains structural metadata:

| Element | Attributes | Description |
|---------|------------|-------------|
| `<suras>` | `index`, `ayas` (count), `start`, `name`, `tname` (transliteration), `ename` (English), `type` (Meccan/Medinan), `order` (revelation order), `rukus` | Chapter metadata |
| `<juzs>` | `index`, `sura`, `aya` | 30 Juz boundaries |
| `<hizbs>` | `index`, `sura`, `aya` | 60 Hizb boundaries |
| `<quarters>` | `index`, `sura`, `aya` | 240 Hizb quarter boundaries |
| `<manzils>` | `index`, `sura`, `aya` | 7 Manzil boundaries |
| `<rukus>` | `index`, `sura`, `aya` | 556 Ruku boundaries |
| `<pages>` | `index`, `sura`, `aya` | 604 Medina Mushaf page boundaries |
| `<sajdas>` | `index`, `sura`, `aya`, `type` (obligatory/recommended) | 14 prostration points |

### Also Available (JS format)
- `quran-data.js` — Compressed JavaScript version of the same metadata

### Latest Release
- Version 1.1 (February 2021)
- License: Free for use in websites/apps with attribution to Tanzil Project and link to tanzil.net

---

## 6. JSON Response Structure Examples

### GET `/chapters` (truncated)
```json
{
  "chapters": [
    {
      "id": 1,
      "revelation_place": "makkah",
      "revelation_order": 5,
      "bismillah_pre": false,
      "name_simple": "Al-Fatihah",
      "name_complex": "Al-Fātiĥah",
      "name_arabic": "الفاتحة",
      "verses_count": 7,
      "pages": [1, 1],
      "translated_name": {
        "language_name": "english",
        "name": "The Opener"
      }
    }
  ]
}
```

### GET `/verses/by_key/2:255?words=true&translations=131`
```json
{
  "verse": {
    "id": 262,
    "verse_number": 255,
    "verse_key": "2:255",
    "hizb_number": 5,
    "rub_el_hizb_number": 17,
    "ruku_number": 35,
    "manzil_number": 1,
    "juz_number": 3,
    "page_number": 42,
    "text_uthmani": "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ...",
    "words": [
      {
        "position": 1,
        "text_uthmani": "ٱللَّهُ",
        "translation": { "text": "Allah", "language_name": "english" },
        "transliteration": { "text": "allahu" },
        "char_type_name": "word"
      }
    ],
    "translations": [
      {
        "id": 131,
        "resource_id": 131,
        "text": "Allah - there is no deity except Him..."
      }
    ]
  }
}
```

---

## 7. Recommendations for Your Use Case

### Best Strategy for Content Automation
1. **Use the legacy v4 API** (`api.quran.com/api/v4`) — it is free, requires no auth, and has no rate limits
2. **For bulk data:** Download from Tanzil.net (XML format) for the base Arabic text and metadata
3. **For translations + tafsir:** Use the v4 API per-chapter with pagination
4. **For topic tagging:** The API does not provide this. Use corpus.quran.com ontology data or qul.tarteel.ai
5. **For word-by-word:** Use `?words=true` on any verse endpoint
6. **For Ibn Kathir tafsir:** Use ID 169 (English) or 14 (Arabic) with `/tafsirs/{id}/by_ayah/{verse_key}`

### Key Gotchas
- The Foundation API (newer) requires OAuth2 — more complex setup
- The v4 API has no documented deprecation date but is being migrated
- Search is limited to 250 chars and 50 results per page
- Word-by-word data significantly increases response size
- Tafsir text can be very long per verse — plan for storage accordingly

---

## Sources
1. [Quran Foundation API Documentation Portal](https://api-docs.quran.foundation/) — Official docs for the newer API
2. [Quick Start Guide](https://api-docs.quran.foundation/docs/quickstart/) — OAuth2 setup and first requests
3. [Content APIs v4.0.0](https://api-docs.quran.foundation/docs/category/content-apis-4.0.0/) — Full v4 endpoint catalog
4. [Verses by Chapter endpoint](https://api-docs.quran.foundation/docs/content_apis_versioned/4.0.0/verses-by-chapter-number/) — Verse fetching docs
5. [Tafsir endpoint](https://api-docs.quran.foundation/docs/content_apis_versioned/tafsir/) — Tafsir retrieval docs
6. [Search endpoint](https://api-docs.quran.foundation/docs/content_apis_versioned/search/) — Search API docs
7. [Tanzil.net Downloads](https://tanzil.net/download/) — Bulk Quran text downloads
8. [Tanzil Quran Metadata](https://tanzil.net/docs/quran_metadata) — XML metadata structure docs
9. [Quranic Arabic Corpus](https://corpus.quran.com/) — Morphological and semantic annotations
10. [Quranic Ontology](https://corpus.quran.com/ontology.jsp) — Named entity / concept tagging
11. [Quranic Universal Library](https://qul.tarteel.ai/) — Themes and topics per ayah
12. [alquran.cloud API](https://alquran.cloud/api) — Alternative free Quran API
13. [quranapi.pages.dev](https://quranapi.pages.dev/) — Another free alternative API
14. [Quran API Scraper](https://github.com/SyahmiRafsan/quran-api-scraper) — Node.js scraper for bulk v4 data
15. [Quran.com Developers](https://quran.com/developers) — Developer portal
