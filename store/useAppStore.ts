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
  readingReflectionVisible: boolean;
  completionGuideShown: boolean;
  explorerGuideShown: boolean;

  setUXMode: (mode: UXMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (size: UserSettings["fontSize"]) => void;
  setTranslationLang: (lang: string) => void;
  setReciter: (reciterId: string) => void;
  updateProgress: (p: Partial<UserProgress>) => void;
  recordReading: (surah: number, ayah: number) => void;
  markSurahComplete: (surah: number) => void;
  unmarkSurahComplete: (surah: number) => void;
  setAudioPlaying: (playing: boolean, ayah?: number | null) => void;
  stopAudio: () => void;
  toggleReadingReflectionVisible: () => void;
  setCompletionGuideShown: (shown: boolean) => void;
  dismissExplorerGuide: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: storage.getSettings() ?? DEFAULT_SETTINGS,
  progress: storage.getProgress() ?? DEFAULT_PROGRESS,
  audioPlaying: false,
  currentAudioAyah: null,
  readingReflectionVisible: true,
  completionGuideShown: false,
  explorerGuideShown: false,

  setUXMode: (mode) => {
    set((s) => {
      const settings = { ...s.settings, uxMode: mode };
      try {
        storage.setSettings(settings);
      } catch (e) {
        console.warn("Storage write failed:", e);
      }
      return { settings };
    });
  },

  setTheme: (theme) => {
    set((s) => {
      const settings = { ...s.settings, theme };
      try {
        storage.setSettings(settings);
      } catch (e) {
        console.warn("Storage write failed:", e);
      }
      return { settings };
    });
  },

  setFontSize: (fontSize) => {
    set((s) => {
      const settings = { ...s.settings, fontSize };
      try {
        storage.setSettings(settings);
      } catch (e) {
        console.warn("Storage write failed:", e);
      }
      return { settings };
    });
  },

  setTranslationLang: (translationLang) => {
    set((s) => {
      const settings = { ...s.settings, translationLang };
      try {
        storage.setSettings(settings);
      } catch (e) {
        console.warn("Storage write failed:", e);
      }
      return { settings };
    });
  },

  setReciter: (reciterId) => {
    set((s) => {
      const settings = { ...s.settings, reciterId };
      try {
        storage.setSettings(settings);
      } catch (e) {
        console.warn("Storage write failed:", e);
      }
      return { settings };
    });
  },

  updateProgress: (partial) => {
    set((s) => {
      const progress = { ...s.progress, ...partial };
      try {
        storage.setProgress(progress);
      } catch (e) {
        console.warn("Storage write failed:", e);
      }
      return { progress };
    });
  },

  recordReading: (surah, ayah) => {
    const { progress } = get();

    const updated: UserProgress = {
      ...progress,
      lastReadSurah: surah,
      lastReadAyah: ayah,
    };
    try {
      storage.setProgress(updated);
    } catch (e) {
      console.warn("Storage write failed:", e);
    }
    set({ progress: updated });
  },

  markSurahComplete: (surah) => {
    set((s) => {
      if (s.progress.completedSurahs.includes(surah)) {
        return s;
      }
      const progress = {
        ...s.progress,
        completedSurahs: [...s.progress.completedSurahs, surah].sort(
          (a, b) => a - b,
        ),
      };
      try {
        storage.setProgress(progress);
      } catch (e) {
        console.warn("Storage write failed:", e);
      }
      return { progress };
    });
  },

  unmarkSurahComplete: (surah) => {
    set((s) => {
      const progress = {
        ...s.progress,
        completedSurahs: s.progress.completedSurahs.filter((n) => n !== surah),
      };
      try {
        storage.setProgress(progress);
      } catch (e) {
        console.warn("Storage write failed:", e);
      }
      return { progress };
    });
  },

  setAudioPlaying: (playing, ayah = null) => {
    // When stopping, keep currentAudioAyah so auto-advance knows which ayah just finished
    if (playing) {
      set({ audioPlaying: true, currentAudioAyah: ayah });
    } else {
      set({ audioPlaying: false });
    }
  },

  stopAudio: () => {
    set({ audioPlaying: false, currentAudioAyah: null });
  },

  toggleReadingReflectionVisible: () => {
    set((s) => ({ readingReflectionVisible: !s.readingReflectionVisible }));
  },

  setCompletionGuideShown: (shown) => {
    set({ completionGuideShown: shown });
  },

  dismissExplorerGuide: () => {
    set({ explorerGuideShown: true });
  },
}));
