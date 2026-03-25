import { useQuery } from "@tanstack/react-query";
import type { SurahMeta, Surah } from "../types";
import surahMap from "../assets/data/surahRequireMap";

const surahIndex: SurahMeta[] = require("../assets/data/surah-index.json");

export function useSurahList() {
  return useQuery<SurahMeta[]>({
    queryKey: ["surah-list"],
    queryFn: () => surahIndex,
    staleTime: Infinity,
  });
}

export function useSurah(id: number) {
  return useQuery<Surah>({
    queryKey: ["surah", id],
    queryFn: () => {
      const surah = surahMap[id];
      if (!surah) throw new Error(`Surah ${id} not found`);
      return surah;
    },
    enabled: id > 0 && id <= 114,
    staleTime: Infinity,
  });
}
