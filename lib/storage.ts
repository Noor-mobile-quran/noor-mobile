import { Platform } from "react-native";
import type { Bookmark, UserProgress, UserSettings } from "../types";

const STORAGE_VERSION = 1;

const KEYS = {
  settings: "noor-settings",
  progress: "noor-progress",
  bookmarks: "noor-bookmarks",
} as const;

const DEFAULT_SETTINGS: UserSettings = {
  theme: "light",
  uxMode: "serene",
  translationLang: "en",
  reciterId: "mishary",
  fontSize: "md",
};

const DEFAULT_PROGRESS: UserProgress = {
  lastReadSurah: null,
  lastReadAyah: null,
  dailyGoal: 5,
  completedSurahs: [],
};

const VALID_THEMES = new Set([
  "light",
  "dark",
  "high-contrast",
  "parchment",
  "moonlight",
  "forest",
  "oled",
]);
const VALID_UX_MODES = new Set(["serene", "immersive", "study"]);
const VALID_FONT_SIZES = new Set(["sm", "md", "lg", "xl"]);

// MMKV is not available on web — use localStorage as fallback
interface KVStore {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
}

interface VersionedPayload<T> {
  version: number;
  data: T;
}

function createStore(): KVStore {
  if (Platform.OS === "web") {
    return {
      getString: (key: string) => localStorage.getItem(key) ?? undefined,
      set: (key: string, value: string) => localStorage.setItem(key, value),
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { MMKV } = require("react-native-mmkv");
  return new MMKV({ id: "noor-storage" });
}

const store = createStore();

function getJSON<T>(key: string): T | null {
  const raw = store.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setJSON<T>(key: string, value: T): void {
  store.set(key, JSON.stringify(value));
}

function setVersionedJSON<T>(key: string, value: T): void {
  setJSON<VersionedPayload<T>>(key, {
    version: STORAGE_VERSION,
    data: value,
  });
}

function unwrapVersioned(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;

  const maybeVersioned = value as Partial<VersionedPayload<unknown>>;
  if (
    typeof maybeVersioned.version !== "number" ||
    !("data" in maybeVersioned)
  ) {
    return value;
  }

  if (maybeVersioned.version > STORAGE_VERSION) {
    console.warn("Stored Noor data is from a newer unsupported version.");
    return null;
  }

  return maybeVersioned.data;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeSettings(value: unknown): UserSettings | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as Partial<UserSettings>;
  return {
    theme:
      typeof raw.theme === "string" && VALID_THEMES.has(raw.theme)
        ? raw.theme
        : DEFAULT_SETTINGS.theme,
    uxMode:
      typeof raw.uxMode === "string" && VALID_UX_MODES.has(raw.uxMode)
        ? raw.uxMode
        : DEFAULT_SETTINGS.uxMode,
    translationLang:
      typeof raw.translationLang === "string"
        ? raw.translationLang
        : DEFAULT_SETTINGS.translationLang,
    reciterId:
      typeof raw.reciterId === "string"
        ? raw.reciterId
        : DEFAULT_SETTINGS.reciterId,
    fontSize:
      typeof raw.fontSize === "string" && VALID_FONT_SIZES.has(raw.fontSize)
        ? raw.fontSize
        : DEFAULT_SETTINGS.fontSize,
  };
}

function normalizeProgress(value: unknown): UserProgress | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as Partial<UserProgress>;
  const completedSurahs = Array.isArray(raw.completedSurahs)
    ? raw.completedSurahs.filter(
        (n): n is number => typeof n === "number" && Number.isFinite(n),
      )
    : DEFAULT_PROGRESS.completedSurahs;

  return {
    lastReadSurah: numberOrNull(raw.lastReadSurah),
    lastReadAyah: numberOrNull(raw.lastReadAyah),
    dailyGoal:
      typeof raw.dailyGoal === "number" && Number.isFinite(raw.dailyGoal)
        ? raw.dailyGoal
        : DEFAULT_PROGRESS.dailyGoal,
    completedSurahs: [...new Set(completedSurahs)].sort((a, b) => a - b),
  };
}

function normalizeBookmarks(value: unknown): Bookmark[] {
  if (!Array.isArray(value)) return [];

  return value.filter((bookmark): bookmark is Bookmark => {
    if (!bookmark || typeof bookmark !== "object") return false;
    const raw = bookmark as Partial<Bookmark>;
    return (
      typeof raw.surah === "number" &&
      Number.isFinite(raw.surah) &&
      typeof raw.ayah === "number" &&
      Number.isFinite(raw.ayah) &&
      typeof raw.timestamp === "number" &&
      Number.isFinite(raw.timestamp) &&
      (raw.note === undefined || typeof raw.note === "string")
    );
  });
}

export const storage = {
  getSettings: () => {
    const settings = normalizeSettings(
      unwrapVersioned(getJSON<unknown>(KEYS.settings)),
    );
    if (settings) {
      setVersionedJSON(KEYS.settings, settings);
    }
    return settings;
  },
  setSettings: (s: UserSettings) => setVersionedJSON(KEYS.settings, s),

  getProgress: () => {
    const progress = normalizeProgress(
      unwrapVersioned(getJSON<unknown>(KEYS.progress)),
    );
    if (progress) {
      setVersionedJSON(KEYS.progress, progress);
    }
    return progress;
  },
  setProgress: (p: UserProgress) => setVersionedJSON(KEYS.progress, p),

  getBookmarks: () =>
    normalizeBookmarks(unwrapVersioned(getJSON<unknown>(KEYS.bookmarks))),
  setBookmarks: (b: Bookmark[]) => setVersionedJSON(KEYS.bookmarks, b),

  addBookmark: (b: Bookmark) => {
    const existing = storage.getBookmarks();
    const filtered = existing.filter(
      (x) => !(x.surah === b.surah && x.ayah === b.ayah),
    );
    storage.setBookmarks([...filtered, b]);
  },

  removeBookmark: (surah: number, ayah: number) => {
    const existing = storage.getBookmarks();
    storage.setBookmarks(
      existing.filter((x) => !(x.surah === surah && x.ayah === ayah)),
    );
  },
};
