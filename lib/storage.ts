import { Platform } from "react-native";
import type { Bookmark, UserProgress, UserSettings } from "../types";

const KEYS = {
  settings: "noor-settings",
  progress: "noor-progress",
  bookmarks: "noor-bookmarks",
} as const;

// MMKV is not available on web — use localStorage as fallback
interface KVStore {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
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

export const storage = {
  getSettings: () => getJSON<UserSettings>(KEYS.settings),
  setSettings: (s: UserSettings) => setJSON(KEYS.settings, s),

  getProgress: () => getJSON<UserProgress>(KEYS.progress),
  setProgress: (p: UserProgress) => setJSON(KEYS.progress, p),

  getBookmarks: () => getJSON<Bookmark[]>(KEYS.bookmarks) ?? [],
  setBookmarks: (b: Bookmark[]) => setJSON(KEYS.bookmarks, b),

  addBookmark: (b: Bookmark) => {
    const existing = storage.getBookmarks();
    const filtered = existing.filter(
      (x) => !(x.surah === b.surah && x.ayah === b.ayah)
    );
    storage.setBookmarks([...filtered, b]);
  },

  removeBookmark: (surah: number, ayah: number) => {
    const existing = storage.getBookmarks();
    storage.setBookmarks(
      existing.filter((x) => !(x.surah === surah && x.ayah === ayah))
    );
  },
};
