# HyperGraphRAG Evolution Research — Noor App

Generated: 2026-03-29 | Researcher: Nahida (Claude Peer a888py1o)

---

## Current State

222 entities, hand-linked themes, narrative arcs, and per-ayah hyperedges. Beautiful foundational work but static — a "pressed flower collection." The HyperGraphRAG paper (NeurIPS 2025, arXiv:2503.21322) envisions something alive.

---

## 1. Adding a Real RAG Pipeline for Semantic Q&A

**Hybrid architecture recommended:**

**Phase 1 — Lightweight Semantic Search (No LLM needed):**
- Pre-compute embeddings for every ayah (Arabic + English translation concatenated)
- Store in on-device vector store — **sqlite-vec** or **Vectra** (JSON-based)
- Query flow: `user question → embed → top-k ayah retrieval → display with knowledge graph context`
- Handles 70% of exploratory queries without any LLM

**Phase 2 — LLM-Augmented Answering:**
- Retrieved ayahs + hyperedge context as grounding
- Lightweight API: Claude Haiku or Gemini Flash
- Prompt: "Given these Quranic verses and their thematic connections, answer the user's question. Cite specific ayah references. Do not add information beyond what the verses contain."

---

## 2. Restructuring Hyperedges: Per-Ayah → Truly N-ary

**Current (per-ayah):**
```json
{ "surah": 2, "ayah": 30, "entities": ["prophet_adam", "angel_jibril"], "themes": ["theme_khilafah"] }
```

**Proposed n-ary structure:**
```json
{
  "id": "he_adam_creation_mandate",
  "type": "relational_fact",
  "label": "Allah appoints Adam as khalifah despite angelic objection",
  "members": [
    { "id": "prophet_adam", "role": "subject" },
    { "id": "attr_al_alim", "role": "divine_attribute" },
    { "id": "group_angels", "role": "objector" },
    { "id": "concept_khilafah", "role": "concept" }
  ],
  "grounding_ayahs": [
    { "surah": 2, "ayah_range": [30, 34] },
    { "surah": 38, "ayah_range": [71, 76] },
    { "surah": 15, "ayah_range": [28, 31] }
  ],
  "semantic_embedding": null,
  "weight": 0.92
}
```

**Key changes:**
- Roles within hyperedges — not just co-occurrence but *how* they relate
- Cross-surah grounding — narratives.json merges into hyperedges
- Typed hyperedges: `relational_fact`, `thematic_cluster`, `narrative_arc`, `ruling_chain`
- Embedding field for dual-search

---

## 3. Embedding Models for Arabic + English Religious Text

**Recommended: `intfloat/multilingual-e5-large`**
- 560M params, Arabic native, instruction-tuned
- Cross-lingual retrieval (English query → Arabic passage)
- Quantizable to ONNX INT8 (~140MB)

**Runner-up: `BAAI/bge-m3`**
- Multi-granularity (dense + sparse + colbert), state-of-the-art multilingual

**On-device: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`**
- 118M params, ~46MB quantized, decent Arabic

**Important:** Fine-tune on ~500 Quranic (question, relevant_ayah) pairs. Quranic Arabic vocabulary is specialized.

---

## 4. On-Device vs. Cloud for LLM

**Tiered approach:**

| Tier | Where | What | When |
|------|-------|------|------|
| 0 | On-device | Vector search + graph traversal | Always (offline) |
| 1 | On-device | Small model (Phi-3-mini 3.8B, ~2GB) | Optional download |
| 2 | Cloud | Claude Haiku for deep Q&A | Opt-in "Ask AI Scholar" |

Respects sacred content privacy and quality expectations.

---

## 5. Thematic Clustering — Auto-Discovery

1. **Embed all 6,236 ayahs** with multilingual model
2. **HDBSCAN clustering** (min_cluster_size=5, cosine metric) — finds variable-density clusters
3. **LLM-label clusters** — generate thematic labels, merge with existing themes.json (>60% overlap)
4. **Community detection** — Louvain algorithm on hypergraph finds entity communities
5. **Temporal patterns** — Makki vs. Madani theme evolution

---

## 6. Migration Roadmap

### Phase 1: Enrich (2 weeks)
- Expand entities 222 → 500+ via NER
- Restructure hyperedges to n-ary with roles
- Merge narratives.json into hyperedges as `narrative_arc` type

### Phase 2: Embed (1 week)
- Generate embeddings for all ayahs and hyperedges
- Store in sqlite-vec (ships with Expo SQLite)
- Build dual-search: entity VDB + hyperedge VDB

### Phase 3: Retrieve (1 week)
- Full retrieval pipeline: query → embed → dual vector search → hypergraph traversal → ranked context
- BM25 sparse search as fallback for Arabic keyword matching

### Phase 4: Generate (1 week)
- LLM integration (cloud API first, on-device later)
- Prompt engineering with retrieved context + knowledge graph structure
- Citation grounding: every sentence must reference specific ayahs

### Phase 5: Discover (ongoing)
- Thematic clustering feeds discoveries back into hyperedges
- Community detection for entity groupings
- User interaction data refines relevance rankings

---

> "The technology should serve the journey of discovery, not replace it. The hypergraph shows how everything in the Quran is interconnected — it's a tool for tadabbur (deep reflection)."
