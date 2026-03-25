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

  setUXMode: (mode: UXMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (size: UserSettings["fontSize"]) => void;
  updateProgress: (p: Partial<UserProgress>) => void;
  recordReading: (surah: number, ayah: number) => void;
  setAudioPlaying: (playing: boolean, ayah?: number | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: storage.getSettings() ?? DEFAULT_SETTINGS,
  progress: storage.getProgress() ?? DEFAULT_PROGRESS,
  audioPlaying: false,
  currentAudioAyah: null,

  setUXMode: (mode) => {
    set((s) => {
      const settings = { ...s.settings, uxMode: mode };
      storage.setSettings(settings);
      return { settings };
    });
  },

  setTheme: (theme) => {
    set((s) => {
      const settings = { ...s.settings, theme };
      storage.setSettings(settings);
      return { settings };
    });
  },

  setFontSize: (fontSize) => {
    set((s) => {
      const settings = { ...s.settings, fontSize };
      storage.setSettings(settings);
      return { settings };
    });
  },

  updateProgress: (partial) => {
    set((s) => {
      const progress = { ...s.progress, ...partial };
      storage.setProgress(progress);
      return { progress };
    });
  },

  recordReading: (surah, ayah) => {
    const { progress } = get();
    const today = new Date().toISOString().split("T")[0];

    if (progress.lastReadDate === today) {
      const updated = { ...progress, lastReadSurah: surah, lastReadAyah: ayah };
      storage.setProgress(updated);
      set({ progress: updated });
      return;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
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
    storage.setProgress(updated);
    set({ progress: updated });
  },

  setAudioPlaying: (playing, ayah = null) => {
    set({ audioPlaying: playing, currentAudioAyah: ayah });
  },
}));
