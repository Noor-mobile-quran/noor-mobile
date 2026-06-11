import { useCallback } from "react";
import { Platform } from "react-native";
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
  const stopAudio = useAppStore((s) => s.stopAudio);

  const play = useCallback(
    async ({ globalAyah, displayAyah, audioUrl }: PlayAyahRequest) => {
      const reciterId = useAppStore.getState().settings.reciterId;
      const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];
      const url =
        reciter.id === "mishary" && audioUrl
          ? audioUrl
          : `${reciter.audioBaseUrl}/${globalAyah}.mp3`;

      try {
        await ensureAudioMode();

        if (sharedPlayer) {
          sharedPlayer.remove();
        }

        const player = createAudioPlayer(url);
        sharedPlayer = player;

        (player as PlayerWithStatusListener).addListener(
          "playbackStatusUpdate",
          (status) => {
            if (
              status.didJustFinish ||
              (!status.playing &&
                status.duration > 0 &&
                status.currentTime >= status.duration - 0.5)
            ) {
              setAudioPlaying(false);
            }
          },
        );

        if (Platform.OS !== "web") {
          player.setActiveForLockScreen(true, {
            title: `Ayah ${displayAyah}`,
            artist: reciter.name_english,
          });
        }

        player.play();
        setAudioPlaying(true, displayAyah);
      } catch (error) {
        console.warn("Audio playback failed:", error);
        stopAudio();
      }
    },
    [setAudioPlaying, stopAudio],
  );

  const stop = useCallback(() => {
    if (sharedPlayer) {
      sharedPlayer.remove();
      sharedPlayer = null;
    }
    stopAudio();
  }, [stopAudio]);

  const pause = useCallback(() => {
    if (sharedPlayer) {
      sharedPlayer.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (sharedPlayer) {
      sharedPlayer.play();
    }
  }, []);

  return { play, stop, pause, resume };
}
