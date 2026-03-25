export interface SurahMeta {
  number: number;
  name_arabic: string;
  name_english: string;
  name_translation: string;
  revelation_type: "meccan" | "medinan";
  ayah_count: number;
  juz_start: number;
}

export interface Ayah {
  number: number;
  number_in_surah: number;
  text_arabic: string;
  text_translation: string;
  juz: number;
  page: number;
  audio_url?: string;
}

export interface Surah extends SurahMeta {
  ayahs: Ayah[];
}

export interface Bookmark {
  surah: number;
  ayah: number;
  timestamp: number;
  note?: string;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  lastReadSurah: number | null;
  lastReadAyah: number | null;
  dailyGoal: number;
  completedSurahs: number[];
}

export type UXMode = "serene" | "immersive" | "study";
export type ThemeMode = "light" | "dark" | "high-contrast";

export interface UserSettings {
  theme: ThemeMode;
  uxMode: UXMode;
  translationLang: string;
  reciterId: string;
  fontSize: "sm" | "md" | "lg" | "xl";
}
