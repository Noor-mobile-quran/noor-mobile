import { renderHook, act } from "@testing-library/react-native";
import { createAudioPlayer } from "expo-audio";
import { useNoorAudioPlayer } from "../hooks/useAudioPlayer";
import { useAppStore } from "../store/useAppStore";

const audioModule = jest.requireMock("expo-audio");
const networkModule = jest.requireMock("expo-network");

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

describe("useNoorAudioPlayer", () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    audioModule.__audioMock.reset();
    networkModule.__setNetworkState({
      isConnected: true,
      isInternetReachable: true,
      type: "WIFI",
    });
    jest.clearAllMocks();
    resetStore();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("plays bundled Mishary audio and updates global playback state", async () => {
    const { result } = await renderHook(() => useNoorAudioPlayer());

    await act(async () => {
      await result.current.play({
        globalAyah: 8,
        displayAyah: 1,
        audioUrl: "https://example.com/bundled-8.mp3",
      });
    });

    expect(createAudioPlayer).toHaveBeenCalledWith(
      "https://example.com/bundled-8.mp3",
    );
    expect(useAppStore.getState()).toMatchObject({
      audioPlaying: true,
      currentAudioAyah: 1,
      audioBuffering: false,
      audioError: null,
      audioRetryAttempt: 0,
    });
  });

  it("removes the playback listener and player on stop", async () => {
    const { result } = await renderHook(() => useNoorAudioPlayer());

    await act(async () => {
      await result.current.play({ globalAyah: 1, displayAyah: 1 });
      result.current.stop();
    });

    const player = audioModule.__audioMock.players[0];
    const subscription = player.addListener.mock.results[0].value;

    expect(subscription.remove).toHaveBeenCalledTimes(1);
    expect(player.remove).toHaveBeenCalledTimes(1);
    expect(useAppStore.getState().audioPlaying).toBe(false);
  });

  it("does not create a player while offline and surfaces a friendly error", async () => {
    networkModule.__setNetworkState({
      isConnected: false,
      isInternetReachable: false,
      type: "NONE",
    });
    const { result } = await renderHook(() => useNoorAudioPlayer());

    await act(async () => {
      await result.current.play({ globalAyah: 1, displayAyah: 1 });
    });

    expect(createAudioPlayer).not.toHaveBeenCalled();
    expect(useAppStore.getState()).toMatchObject({
      audioPlaying: false,
      audioBuffering: false,
      audioRetryAttempt: 3,
    });
    expect(useAppStore.getState().audioError).toContain("offline");
  });

  it("retries failed player creation three times before storing the error", async () => {
    audioModule.__audioMock.setCreateError(new Error("CDN failed"));
    const { result } = await renderHook(() => useNoorAudioPlayer());

    await act(async () => {
      await result.current.play({ globalAyah: 1, displayAyah: 1 });
    });

    expect(createAudioPlayer).toHaveBeenCalledTimes(3);
    expect(useAppStore.getState()).toMatchObject({
      audioPlaying: false,
      audioBuffering: false,
      audioRetryAttempt: 3,
      audioError: "CDN failed",
    });
  });
});
