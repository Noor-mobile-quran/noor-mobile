import { useCallback, useRef, useState } from "react";
import surahIndex from "../assets/data/surah-index.json";

const EMBEDDING_DIM = 384;
const EMBEDDING_API_URL = "https://api.example.com/embed"; // placeholder
const SIMILARITY_THRESHOLD = 0.3;
const MAX_RESULTS = 10;
const TOTAL_SURAHS = 114;

export interface SearchResult {
  surah: number;
  ayah: number;
  score: number;
  textPreview: string;
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dot / denom;
}

function generateMockEmbeddings(): Map<string, Float32Array> {
  console.warn("Using mock embeddings \u2014 real embeddings not yet generated");
  const cache = new Map<string, Float32Array>();
  const surahs = surahIndex as Array<{ number: number; ayah_count: number }>;
  for (const s of surahs) {
    for (let a = 1; a <= s.ayah_count; a++) {
      const vec = new Float32Array(EMBEDDING_DIM);
      for (let d = 0; d < EMBEDDING_DIM; d++) {
        vec[d] = (Math.random() - 0.5) * 2;
      }
      // Normalize for realistic cosine similarity distribution
      let norm = 0;
      for (let d = 0; d < EMBEDDING_DIM; d++) norm += vec[d] * vec[d];
      norm = Math.sqrt(norm);
      if (norm > 0) {
        for (let d = 0; d < EMBEDDING_DIM; d++) vec[d] /= norm;
      }
      cache.set(`${s.number}:${a}`, vec);
    }
  }
  return cache;
}

let embeddingCache: Map<string, Float32Array> | null = null;

async function loadEmbeddings(): Promise<Map<string, Float32Array>> {
  if (embeddingCache) return embeddingCache;

  // TODO: Load from assets/embeddings/ayah_vectors.db via expo-sqlite
  // For now, use mock embeddings since the DB doesn't exist yet
  embeddingCache = generateMockEmbeddings();
  return embeddingCache;
}

async function fetchQueryEmbedding(query: string): Promise<Float32Array> {
  const response = await fetch(EMBEDDING_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: query, model: "multilingual-e5-small" }),
  });

  if (!response.ok) {
    throw new Error(`Embedding API returned ${response.status}`);
  }

  const data = (await response.json()) as { embedding: number[] };
  return new Float32Array(data.embedding);
}

function searchEmbeddings(
  queryVec: Float32Array,
  cache: Map<string, Float32Array>,
): SearchResult[] {
  const start = performance.now();
  const scored: Array<{ key: string; score: number }> = [];

  for (const [key, vec] of cache) {
    const score = cosineSimilarity(queryVec, vec);
    if (score >= SIMILARITY_THRESHOLD) {
      scored.push({ key, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, MAX_RESULTS);

  const elapsed = performance.now() - start;
  console.log(`Semantic search: ${elapsed.toFixed(2)}ms over ${cache.size} vectors`);

  return top.map(({ key, score }) => {
    const [surahStr, ayahStr] = key.split(":");
    return {
      surah: parseInt(surahStr, 10),
      ayah: parseInt(ayahStr, 10),
      score,
      textPreview: "", // populated by caller with actual translation text
    };
  });
}

export function useSemanticSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, Float32Array> | null>(null);

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Load embeddings on first call
      if (!cacheRef.current) {
        cacheRef.current = await loadEmbeddings();
      }

      const queryVec = await fetchQueryEmbedding(trimmed);
      const matches = searchEmbeddings(queryVec, cacheRef.current);
      setResults(matches);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Search failed";
      setError(message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { search, results, isLoading, error, clearResults };
}
