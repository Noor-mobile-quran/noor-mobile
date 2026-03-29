import { create } from "zustand";
import type { UXMode, ThemeMode, UserProgress, UserSettings } from "../types";
import { storage } from "../lib/storage";

const DEFAULT_SETTINGS: UserSettings = {
  theme: "light",
  uxMode: "serene",
  translationLang: "en",
  reciterId: "mishary",
  fontSize: "md",
};

const DEFAULT_PROGRESS: UserProgress = {
  currentStreak: 0,
  longestStreak: 0,
  lastReadDate: null,
  lastReadSurah: null,
  lastReadAyah: null,
  dailyGoal: 5,
  completedSurahs: [],
};

interface AppState {
  settings: UserSettings;
  progress: UserProgress;
  audioPlaying: boolean;
  currentAudioAyah: number | null;
  streakVisible: boolean;
  completionGuideShown: boolean;
  explorerGuideShown: boolean;

  setUXMode: (mode: UXMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (size: UserSettings["fontSize"]) => void;
  setTranslationLang: (lang: string) => void;
  setReciter: (reciterId: string) => void;
  updateProgress: (p: Partial<UserProgress>) => void;
  recordReading: (surah: number, ayah: number) => void;
  setAudioPlaying: (playing: boolean, ayah?: number | null) => void;
  toggleStreakVisible: () => void;
  setCompletionGuideShown: (shown: boolean) => void;
  dismissExplorerGuide: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: storage.getSettings() ?? DEFAULT_SETTINGS,
  progress: storage.getProgress() ?? DEFAULT_PROGRESS,
  audioPlaying: false,
  currentAudioAyah: null,
  streakVisible: true,
  completionGuideShown: false,
  explorerGuideShown: false,

  setUXMode: (mode) => {
    set((s) => {
      const settings = { ...s.settings, uxMode: mode };
      try { storage.setSettings(settings); } catch (e) { console.warn("Storage write failed:", e); }
      return { settings };
    });
  },

  setTheme: (theme) => {
    set((s) => {
      const settings = { ...s.settings, theme };
      try { storage.setSettings(settings); } catch (e) { console.warn("Storage write failed:", e); }
      return { settings };
    });
  },

  setFontSize: (fontSize) => {
    set((s) => {
      const settings = { ...s.settings, fontSize };
      try { storage.setSettings(settings); } catch (e) { console.warn("Storage write failed:", e); }
      return { settings };
    });
  },

  setTranslationLang: (translationLang) => {
    set((s) => {
      const settings = { ...s.settings, translationLang };
      try { storage.setSettings(settings); } catch (e) { console.warn("Storage write failed:", e); }
      return { settings };
    });
  },

  setReciter: (reciterId) => {
    set((s) => {
      const settings = { ...s.settings, reciterId };
      try { storage.setSettings(settings); } catch (e) { console.warn("Storage write failed:", e); }
      return { settings };
    });
  },

  updateProgress: (partial) => {
    set((s) => {
      const progress = { ...s.progress, ...partial };
      try { storage.setProgress(progress); } catch (e) { console.warn("Storage write failed:", e); }
      return { progress };
    });
  },

  recordReading: (surah, ayah) => {
    const { progress } = get();
    const today = new Date().toLocaleDateString("en-CA");

    if (progress.lastReadDate === today) {
      const updated = { ...progress, lastReadSurah: surah, lastReadAyah: ayah };
      try { storage.setProgress(updated); } catch (e) { console.warn("Storage write failed:", e); }
      set({ progress: updated });
      return;
    }

    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");
    const isConsecutive = progress.lastReadDate === yesterday;
    const newStreak = isConsecutive ? progress.currentStreak + 1 : 1;

    const updated: UserProgress = {
      ...progress,
      lastReadDate: today,
      lastReadSurah: surah,
      lastReadAyah: ayah,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
    };
    try { storage.setProgress(updated); } catch (e) { console.warn("Storage write failed:", e); }
    set({ progress: updated });
  },

  setAudioPlaying: (playing, ayah = null) => {
    set({ audioPlaying: playing, currentAudioAyah: ayah });
  },

  toggleStreakVisible: () => {
    set((s) => ({ streakVisible: !s.streakVisible }));
  },

  setCompletionGuideShown: (shown) => {
    set({ completionGuideShown: shown });
  },

  dismissExplorerGuide: () => {
    set({ explorerGuideShown: true });
  },
}));
