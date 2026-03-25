import { useState, useMemo } from "react";
import surahMap from "../assets/data/surahRequireMap";
import type { Surah } from "../types";

// Pre-load all surahs from the static require map (bundled JSON, not API calls)
const allSurahs: Surah[] = Array.from({ length: 114 }, (_, i) => surahMap[i + 1]);

export interface SearchResult {
  surah: number;
  surahName: string;
  surahNameArabic: string;
  ayah: number;
  textArabic: string;
  textTranslation: string;
  textTranslationUr?: string;
  matchContext: string;
}

export function useQuranSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (query.length < 3) return [];
    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    for (const surah of allSurahs) {
      for (const ayah of surah.ayahs) {
        const matchEn = ayah.text_translation?.toLowerCase().includes(q);
        const matchUr = ayah.text_translation_ur?.includes(query); // Urdu is case-sensitive
        const matchAr = ayah.text_arabic?.includes(query);

        if (matchEn || matchUr || matchAr) {
          matches.push({
            surah: surah.number,
            surahName: surah.name_english,
            surahNameArabic: surah.name_arabic,
            ayah: ayah.number_in_surah,
            textArabic: ayah.text_arabic,
            textTranslation: ayah.text_translation,
            textTranslationUr: ayah.text_translation_ur,
            matchContext: matchEn
              ? ayah.text_translation
              : matchUr
                ? ayah.text_translation_ur!
                : ayah.text_arabic,
          });
        }
      }
      if (matches.length >= 50) break; // Cap results
    }
    return matches;
  }, [query]);

  return { query, setQuery, results, hasResults: results.length > 0 };
}
