import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";
import { useSemanticSearch, type SearchResult } from "../hooks/useSemanticSearch";
import surahIndex from "../assets/data/surah-index.json";

interface SemanticSearchProps {
  onResultPress?: (surah: number, ayah: number) => void;
}

const RECENT_KEY = "noor-recent-searches";
const MAX_RECENT = 5;
const DEBOUNCE_MS = 500;

const PLACEHOLDER_EXAMPLES = [
  "patience",
  "forgiveness",
  "gratitude",
  "mercy",
];

function SearchIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" accessible={false}>
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={2} fill="none" />
      <Path
        d="M16.5 16.5L21 21"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CloseIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" accessible={false}>
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function getRecentSearches(): string[] {
  try {
    const { Platform } = require("react-native");
    if (Platform.OS === "web") {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const { MMKV } = require("react-native-mmkv");
    const store = new MMKV({ id: "noor-storage" });
    const raw = store.getString(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  try {
    const existing = getRecentSearches();
    const filtered = existing.filter((s) => s !== query);
    const updated = [query, ...filtered].slice(0, MAX_RECENT);
    const json = JSON.stringify(updated);
    const { Platform } = require("react-native");
    if (Platform.OS === "web") {
      localStorage.setItem(RECENT_KEY, json);
      return;
    }
    const { MMKV } = require("react-native-mmkv");
    const store = new MMKV({ id: "noor-storage" });
    store.set(RECENT_KEY, json);
  } catch {
    // Storage unavailable
  }
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "\u2026" : text;
}

type SurahMeta = { number: number; name_arabic: string; name_english: string };
const surahMeta = surahIndex as SurahMeta[];

function getSurahMeta(surahNum: number): SurahMeta | undefined {
  return surahMeta.find((s) => s.number === surahNum);
}

function RelevanceBar({ score, color }: { score: number; color: string }) {
  const pct = Math.max(0, Math.min(1, score)) * 100;
  return (
    <View style={styles.relevanceRow}>
      <View style={[styles.relevanceTrack, { backgroundColor: `${color}33` }]}>
        <View
          style={[styles.relevanceFill, { backgroundColor: color, width: `${pct}%` }]}
        />
      </View>
      <Text style={[styles.relevanceScore, { color }]}>{score.toFixed(2)}</Text>
    </View>
  );
}

export function SemanticSearch({ onResultPress }: SemanticSearchProps) {
  const { colors } = useTheme();
  const { search, results, isLoading, error } = useSemanticSearch();

  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTextChange = useCallback(
    (text: string) => {
      setQuery(text);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (text.trim().length < 2) return;
      debounceRef.current = setTimeout(() => {
        search(text.trim());
        saveRecentSearch(text.trim());
        setRecentSearches(getRecentSearches());
      }, DEBOUNCE_MS);
    },
    [search]
  );

  const handleRecentPress = useCallback(
    (term: string) => {
      setQuery(term);
      search(term);
    },
    [search]
  );

  const clearQuery = useCallback(() => {
    setQuery("");
  }, []);

  const placeholder = `What does the Quran say about ${PLACEHOLDER_EXAMPLES[placeholderIdx]}...`;
  const showRecent = query.length === 0 && recentSearches.length > 0;
  const showResults = !isLoading && !error && results && results.length > 0;
  const showEmpty = !isLoading && !error && results && results.length === 0 && query.length >= 2;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.inputRow,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <SearchIcon color={colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.textPrimary }]}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Semantic search input"
          accessibilityRole="search"
        />
        {query.length > 0 && (
          <Pressable
            onPress={clearQuery}
            style={styles.clearButton}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <CloseIcon color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      {showRecent && (
        <View style={styles.recentRow}>
          <Text style={[styles.recentLabel, { color: colors.textSecondary }]}>
            Recent:
          </Text>
          {recentSearches.map((term) => (
            <Pressable
              key={term}
              onPress={() => handleRecentPress(term)}
              style={[
                styles.recentChip,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              accessibilityLabel={`Search for ${term}`}
              accessibilityRole="button"
            >
              <Text
                style={[styles.recentChipText, { color: colors.textPrimary }]}
              >
                {term}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {isLoading && (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.stateText, { color: colors.textSecondary }]}>
            Searching...
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.stateContainer}>
          <Text style={[styles.stateText, { color: colors.textSecondary }]}>
            Semantic search requires internet. Try keyword search instead.
          </Text>
        </View>
      )}

      {showEmpty && (
        <View style={styles.stateContainer}>
          <Text style={[styles.stateText, { color: colors.textSecondary }]}>
            No matching ayahs found. Try a different question.
          </Text>
        </View>
      )}

      {showResults && (
        <ScrollView
          style={styles.resultsList}
          contentContainerStyle={styles.resultsContent}
        >
          {results.map((result) => {
            const meta = getSurahMeta(result.surah);
            return (
              <Pressable
                key={`${result.surah}-${result.ayah}`}
                style={[
                  styles.resultCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => onResultPress?.(result.surah, result.ayah)}
                accessibilityLabel={`${meta?.name_english ?? `Surah ${result.surah}`}, Ayah ${result.ayah}`}
                accessibilityRole="button"
              >
                <View style={styles.resultHeader}>
                  {meta?.name_arabic && (
                    <Text
                      style={[styles.surahArabic, { color: colors.textPrimary }]}
                      accessibilityLanguage="ar"
                    >
                      {meta.name_arabic}
                    </Text>
                  )}
                  <Text
                    style={[styles.surahEnglish, { color: colors.textPrimary }]}
                  >
                    {meta?.name_english ?? `Surah ${result.surah}`}
                  </Text>
                  <Text
                    style={[styles.ayahRef, { color: colors.textSecondary }]}
                  >
                    {result.surah}:{result.ayah}
                  </Text>
                </View>
                {result.textPreview.length > 0 && (
                  <Text
                    style={[styles.translation, { color: colors.textSecondary }]}
                    numberOfLines={2}
                  >
                    {truncate(result.textPreview, 80)}
                  </Text>
                )}
                <RelevanceBar score={result.score} color={colors.textGold} />
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 15,
    paddingVertical: 12,
    minHeight: 44,
  },
  clearButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  recentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  recentLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
  },
  recentChip: {
    paddingHorizontal: 12,
    minHeight: 32,
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
  },
  recentChipText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 8,
  },
  stateText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  resultsList: {
    flex: 1,
    marginTop: 12,
  },
  resultsContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 24,
  },
  resultCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 8,
  },
  surahArabic: {
    fontFamily: "Amiri-Bold",
    fontSize: 15,
  },
  surahEnglish: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
  },
  ayahRef: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
  },
  translation: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  relevanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  relevanceTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  relevanceFill: {
    height: 4,
    borderRadius: 2,
  },
  relevanceScore: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    width: 32,
    textAlign: "right",
  },
});
