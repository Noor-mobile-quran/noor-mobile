import { act } from "@testing-library/react-native";
import { useAppStore } from "../store/useAppStore";
import { storage } from "../lib/storage";

const mmkvMock = jest.requireMock("react-native-mmkv");

function resetStore() {
  useAppStore.setState({
    settings: {
      theme: "light",
      uxMode: "serene",
      translationLang: "en",
      reciterId: "mishary",
      fontSize: "md",
    },
    progress: {
      lastReadSurah: null,
      lastReadAyah: null,
      dailyGoal: 5,
      completedSurahs: [],
    },
    audioPlaying: false,
    currentAudioAyah: null,
    audioBuffering: false,
    audioError: null,
    audioRetryAttempt: 0,
    readingReflectionVisible: true,
    completionGuideShown: false,
    explorerGuideShown: false,
  });
}

describe("useAppStore", () => {
  beforeEach(() => {
    mmkvMock.__resetMMKV();
    resetStore();
  });

  it("persists settings changes through store actions", async () => {
    await act(async () => {
      useAppStore.getState().setUXMode("study");
      useAppStore.getState().setTheme("forest");
      useAppStore.getState().setFontSize("xl");
      useAppStore.getState().setTranslationLang("ur");
      useAppStore.getState().setReciter("sudais");
    });

    expect(useAppStore.getState().settings).toMatchObject({
      uxMode: "study",
      theme: "forest",
      fontSize: "xl",
      translationLang: "ur",
      reciterId: "sudais",
    });
    expect(storage.getSettings()).toMatchObject({
      uxMode: "study",
      theme: "forest",
      fontSize: "xl",
      translationLang: "ur",
      reciterId: "sudais",
    });
  });

  it("updates progress, records visible position, and manages completion", async () => {
    await act(async () => {
      useAppStore.getState().updateProgress({ dailyGoal: 10 });
      useAppStore.getState().recordReading(36, 12);
      useAppStore.getState().markSurahComplete(36);
      useAppStore.getState().markSurahComplete(2);
      useAppStore.getState().markSurahComplete(2);
      useAppStore.getState().unmarkSurahComplete(36);
    });

    expect(useAppStore.getState().progress).toMatchObject({
      lastReadSurah: 36,
      lastReadAyah: 12,
      dailyGoal: 10,
      completedSurahs: [2],
    });
    expect(storage.getProgress()?.completedSurahs).toEqual([2]);
  });

  it("manages playback, buffering, retry, and error state", async () => {
    await act(async () => {
      useAppStore.getState().setAudioPlaying(true, 4);
      useAppStore.getState().setAudioBuffering(true);
      useAppStore.getState().setAudioRetryAttempt(2);
      useAppStore.getState().setAudioError("Network failed");
      useAppStore.getState().setAudioPlaying(false);
    });

    expect(useAppStore.getState()).toMatchObject({
      audioPlaying: false,
      currentAudioAyah: 4,
      audioBuffering: false,
      audioError: "Network failed",
      audioRetryAttempt: 2,
    });

    await act(async () => {
      useAppStore.getState().stopAudio();
    });

    expect(useAppStore.getState()).toMatchObject({
      audioPlaying: false,
      currentAudioAyah: null,
      audioBuffering: false,
      audioError: null,
      audioRetryAttempt: 0,
    });
  });

  it("toggles local guide and reflection UI flags", async () => {
    await act(async () => {
      useAppStore.getState().toggleReadingReflectionVisible();
      useAppStore.getState().setCompletionGuideShown(true);
      useAppStore.getState().dismissExplorerGuide();
    });

    expect(useAppStore.getState()).toMatchObject({
      readingReflectionVisible: false,
      completionGuideShown: true,
      explorerGuideShown: true,
    });
  });
});
