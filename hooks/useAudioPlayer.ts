import { useCallback } from "react";
import { Platform } from "react-native";
import * as Network from "expo-network";
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioStatus,
} from "expo-audio";
import { useAppStore } from "../store/useAppStore";
import { RECITERS } from "../data/reciters";

let audioModeConfigured = false;
let sharedPlayer: AudioPlayer | null = null;
let sharedSubscription: PlaybackSubscription | null = null;
const MAX_AUDIO_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [350, 900];

type PlaybackSubscription = { remove: () => void };
type PlayerWithStatusListener = AudioPlayer & {
  addListener: (
    eventName: "playbackStatusUpdate",
    listener: (status: AudioStatus) => void,
  ) => PlaybackSubscription;
};

export interface PlayAyahRequest {
  globalAyah: number;
  displayAyah: number;
  audioUrl?: string;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanupSharedPlayer() {
  sharedSubscription?.remove();
  sharedSubscription = null;

  if (sharedPlayer) {
    sharedPlayer.remove();
    sharedPlayer = null;
  }
}

function getAudioErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Audio could not be loaded. Check your connection and try again.";
}

async function isOffline() {
  try {
    const state = await Network.getNetworkStateAsync();
    return (
      state.type === Network.NetworkStateType.NONE ||
      state.isConnected === false ||
      state.isInternetReachable === false
    );
  } catch {
    return false;
  }
}

async function ensureAudioMode() {
  if (audioModeConfigured || Platform.OS === "web") return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
    audioModeConfigured = true;
  } catch (error) {
    console.warn("Audio mode configuration failed:", error);
  }
}

export function useNoorAudioPlayer() {
  const setAudioPlaying = useAppStore((s) => s.setAudioPlaying);
  const setAudioBuffering = useAppStore((s) => s.setAudioBuffering);
  const setAudioError = useAppStore((s) => s.setAudioError);
  const setAudioRetryAttempt = useAppStore((s) => s.setAudioRetryAttempt);
  const stopAudio = useAppStore((s) => s.stopAudio);

  const play = useCallback(
    async ({ globalAyah, displayAyah, audioUrl }: PlayAyahRequest) => {
      const reciterId = useAppStore.getState().settings.reciterId;
      const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];
      const url =
        reciter.id === "mishary" && audioUrl
          ? audioUrl
          : `${reciter.audioBaseUrl}/${globalAyah}.mp3`;

      setAudioError(null);
      setAudioRetryAttempt(0);
      setAudioBuffering(true);

      try {
        await ensureAudioMode();

        if (await isOffline()) {
          throw new Error("Audio is unavailable while offline.");
        }

        let lastError: unknown = null;

        for (let attempt = 1; attempt <= MAX_AUDIO_ATTEMPTS; attempt += 1) {
          try {
            setAudioRetryAttempt(attempt);
            cleanupSharedPlayer();

            const player = createAudioPlayer(url);
            sharedPlayer = player;

            sharedSubscription = (
              player as PlayerWithStatusListener
            ).addListener("playbackStatusUpdate", (status) => {
              if (status.isBuffering) {
                setAudioBuffering(true);
              } else if (status.isLoaded || status.playing) {
                setAudioBuffering(false);
              }

              if (
                status.didJustFinish ||
                (!status.playing &&
                  status.duration > 0 &&
                  status.currentTime >= status.duration - 0.5)
              ) {
                setAudioPlaying(false);
              }
            });

            if (Platform.OS !== "web") {
              player.setActiveForLockScreen(true, {
                title: `Ayah ${displayAyah}`,
                artist: reciter.name_english,
              });
            }

            player.play();
            setAudioPlaying(true, displayAyah);
            setAudioRetryAttempt(0);
            return;
          } catch (error) {
            lastError = error;
            cleanupSharedPlayer();
            if (attempt < MAX_AUDIO_ATTEMPTS) {
              await wait(RETRY_DELAYS_MS[attempt - 1] ?? 900);
            }
          }
        }

        throw lastError ?? new Error("Audio could not be loaded.");
      } catch (error) {
        console.warn("Audio playback failed:", error);
        stopAudio();
        setAudioError(getAudioErrorMessage(error));
        setAudioRetryAttempt(MAX_AUDIO_ATTEMPTS);
      } finally {
        setAudioBuffering(false);
      }
    },
    [
      setAudioBuffering,
      setAudioError,
      setAudioPlaying,
      setAudioRetryAttempt,
      stopAudio,
    ],
  );

  const stop = useCallback(() => {
    cleanupSharedPlayer();
    stopAudio();
  }, [stopAudio]);

  const pause = useCallback(() => {
    try {
      sharedPlayer?.pause();
    } catch (error) {
      console.warn("Audio pause failed:", error);
    }
  }, []);

  const resume = useCallback(() => {
    try {
      sharedPlayer?.play();
    } catch (error) {
      console.warn("Audio resume failed:", error);
      setAudioError(getAudioErrorMessage(error));
    }
  }, [setAudioError]);

  return { play, stop, pause, resume };
}
