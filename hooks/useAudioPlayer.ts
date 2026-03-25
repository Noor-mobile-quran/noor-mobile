import { useRef, useCallback } from "react";
import { Platform } from "react-native";
import { Audio } from "expo-av";
import { useAppStore } from "../store/useAppStore";
import { RECITERS } from "../data/reciters";

export function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const setAudioPlaying = useAppStore((s) => s.setAudioPlaying);

  const play = useCallback(async (ayahNumber: number) => {
    const reciterId = useAppStore.getState().settings.reciterId;
    const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];
    const url = `${reciter.audioBaseUrl}/${ayahNumber}.mp3`;

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    // setAudioModeAsync options are native-only; skip on web to prevent crash
    if (Platform.OS !== "web") {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );
    soundRef.current = sound;
    setAudioPlaying(true, ayahNumber);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setAudioPlaying(false);
      }
    });
  }, [setAudioPlaying]);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setAudioPlaying(false);
  }, [setAudioPlaying]);

  const pause = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
    }
  }, []);

  const resume = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
    }
  }, []);

  return { play, stop, pause, resume };
}
