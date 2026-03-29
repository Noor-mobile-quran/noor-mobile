# On-Device Vector Search Implementation — Noor App

Generated: 2026-03-29 | Researcher: Raiden Shogun (Claude Peer hcjkk7oe)

---

## Critical Finding: sqlite-vec NOT available in SDK 52

sqlite-vec requires Expo SDK 54+. Three paths forward:

| Path | Effort | Risk |
|------|--------|------|
| Upgrade to SDK 54 | Medium | Cleanest. Avoid SDK 55 (iOS bug). |
| op-sqlite on SDK 52 | Medium | Works but loses managed workflow. |
| **Pure JS cosine similarity** | **Low** | **<10ms for 6,236 vectors. No extension needed.** |

**Decision: Pure JS for prototype (SDK 52), sqlite-vec for production (SDK 54).**

---

## Embedding Model Selection

| Model | Size (ONNX INT8) | Dims | Arabic? | Mobile? |
|-------|-------------------|------|---------|---------|
| multilingual-e5-large | ~280 MB | 1024 | Yes | No — too large |
| multilingual-e5-base | ~70 MB | 768 | Yes | Possible |
| **multilingual-e5-small** | **~113 MB** | **384** | **Yes** | **Sweet spot** |
| all-MiniLM-L6-v2 | ~22 MB | 384 | No | English only |

**Decision: `intfloat/multilingual-e5-small` (384 dims)** — Arabic+English, 10MB storage.

---

## Key Insight: Pre-compute Everything

The Quran has exactly 6,236 ayahs. They never change. **Pre-compute all embeddings offline and ship with the app.** No ML model needed on-device for the corpus.

Only the user's search query needs runtime embedding (via API call for v1).

---

## Storage Size

**At 384 dims (multilingual-e5-small):**
- Ayah embeddings: ~10 MB (float32) or ~4 MB (int8)
- Hyperedge embeddings (~500): ~0.8 MB
- **Total: ~11 MB** — negligible for mobile

---

## Code: Pure JS Vector Search (SDK 52)

```typescript
// lib/vectorSearch.ts
interface SearchResult {
  ayahId: number;
  surahNum: number;
  ayahNum: number;
  textPreview: string;
  similarity: number;
}

let embeddingCache: Map<number, Float32Array> | null = null;

async function loadEmbeddings(db: SQLiteDatabase): Promise<Map<number, Float32Array>> {
  if (embeddingCache) return embeddingCache;
  const rows = await db.getAllAsync<{
    ayah_id: number; embedding: ArrayBuffer;
  }>('SELECT ayah_id, embedding FROM vec_ayahs');
  embeddingCache = new Map();
  for (const row of rows) {
    embeddingCache.set(row.ayah_id, new Float32Array(row.embedding));
  }
  return embeddingCache;
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function semanticSearch(
  db: SQLiteDatabase,
  queryEmbedding: Float32Array,
  topK: number = 10
): Promise<SearchResult[]> {
  const embeddings = await loadEmbeddings(db);
  const scores: { ayahId: number; similarity: number }[] = [];
  embeddings.forEach((emb, ayahId) => {
    scores.push({ ayahId, similarity: cosineSimilarity(queryEmbedding, emb) });
  });
  scores.sort((a, b) => b.similarity - a.similarity);
  return scores.slice(0, topK);
}
```

## Code: sqlite-vec (SDK 54+)

```typescript
export async function initVectorDB(): Promise<SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('noor-vectors.db');
  const ext = SQLite.bundledExtensions['sqlite-vec'];
  await db.loadExtensionAsync(ext.libPath, ext.entryPoint);
  return db;
}

export async function searchAyahs(db: SQLiteDatabase, queryEmbedding: number[], topK = 10) {
  return db.getAllAsync(
    `SELECT ayah_id, surah_num, ayah_num, text_preview, distance
     FROM vec_ayahs WHERE embedding MATCH ? AND k = ? ORDER BY distance`,
    [JSON.stringify(queryEmbedding), topK]
  );
}
```

## Hook: useSemanticSearch

```typescript
export function useSemanticSearch(db: SQLiteDatabase) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    try {
      // Embed query via API
      const response = await fetch('https://your-api.com/embed', {
        method: 'POST',
        body: JSON.stringify({ text: query, model: 'multilingual-e5-small' }),
      });
      const { embedding } = await response.json();
      const hits = await semanticSearch(db, new Float32Array(embedding), 10);
      setResults(hits);
    } finally {
      setLoading(false);
    }
  }, [db]);

  return { results, loading, search };
}
```

---

## Architecture Summary

| Component | Decision | Why |
|-----------|----------|-----|
| Embedding model | multilingual-e5-small (384 dims) | Arabic+English, 10MB storage |
| Corpus embeddings | Pre-computed at build time | Corpus is immutable |
| Storage | SQLite + float32 BLOBs (~10 MB) | Cross-platform, ships with expo-asset |
| Vector search v1 | Pure JS cosine similarity | <10ms, no extensions, SDK 52 |
| Vector search v2 | sqlite-vec via SDK 54 | Scale path for 50K+ vectors |
| Query embedding v1 | API call | Zero app size impact |
| Query embedding v2 | onnxruntime-react-native | Offline, but iOS bugs exist |

**Total app size impact: ~10 MB.**
