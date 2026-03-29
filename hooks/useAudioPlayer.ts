import { useRef, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
} from "expo-audio";
import { useAppStore } from "../store/useAppStore";
import { RECITERS } from "../data/reciters";

let audioModeConfigured = false;

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
  const playerRef = useRef<AudioPlayer | null>(null);
  const setAudioPlaying = useAppStore((s) => s.setAudioPlaying);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
        playerRef.current = null;
      }
    };
  }, []);

  const play = useCallback(
    async (ayahNumber: number) => {
      const reciterId = useAppStore.getState().settings.reciterId;
      const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];
      const url = `${reciter.audioBaseUrl}/${ayahNumber}.mp3`;

      try {
        await ensureAudioMode();

        if (playerRef.current) {
          playerRef.current.remove();
        }

        const player = createAudioPlayer(url);
        playerRef.current = player;

        player.addListener("playbackStatusUpdate", (status) => {
          if (status.playing === false && status.currentTime >= status.duration && status.duration > 0) {
            setAudioPlaying(false);
          }
        });

        if (Platform.OS !== "web") {
          player.setActiveForLockScreen(true, {
            title: `Ayah ${ayahNumber}`,
            artist: reciter.name_english,
          });
        }

        player.play();
        setAudioPlaying(true, ayahNumber);
      } catch (error) {
        console.warn("Audio playback failed:", error);
        setAudioPlaying(false);
      }
    },
    [setAudioPlaying]
  );

  const stop = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.remove();
      playerRef.current = null;
    }
    setAudioPlaying(false);
  }, [setAudioPlaying]);

  const pause = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  }, []);

  return { play, stop, pause, resume };
}
