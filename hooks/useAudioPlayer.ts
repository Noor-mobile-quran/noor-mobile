import { useRef, useCallback } from "react";
import { Audio } from "expo-av";
import { useAppStore } from "../store/useAppStore";

export function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const setAudioPlaying = useAppStore((s) => s.setAudioPlaying);

  const play = useCallback(async (url: string, ayahNumber: number) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

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
