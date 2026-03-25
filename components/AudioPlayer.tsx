import { useEffect, useRef } from "react";
import { View, Text, Pressable, AccessibilityInfo } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../theme/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useSurahList } from "../hooks/useQuranData";

export function AudioPlayer() {
  const { colors } = useTheme();
  const audioPlaying = useAppStore((s) => s.audioPlaying);
  const currentAyah = useAppStore((s) => s.currentAudioAyah);
  const uxMode = useAppStore((s) => s.settings.uxMode);
  const lastReadSurah = useAppStore((s) => s.progress.lastReadSurah);
  const { stop, pause, resume } = useAudioPlayer();
  const { data: surahList } = useSurahList();

  const isPausedRef = useRef(false);

  // Slide-up entrance animation
  const translateY = useSharedValue(100);
  // Progress shimmer
  const progressWidth = useSharedValue(0);

  const isImmersive = uxMode === "immersive";
  const barHeight = isImmersive ? 80 : 56;
  const iconSize = isImmersive ? 28 : 20;

  // Find surah name
  const surahMeta = surahList?.find((s) => s.number === lastReadSurah);
  const surahName = surahMeta?.name_arabic ?? "";
  const surahNameLatin = surahMeta?.name_english ?? "";

  useEffect(() => {
    translateY.value = withTiming(audioPlaying ? 0 : 100, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [audioPlaying, translateY]);

  // Animated progress bar (subtle repeating shimmer to indicate playback)
  useEffect(() => {
    if (audioPlaying && !isPausedRef.current) {
      progressWidth.value = 0;
      progressWidth.value = withRepeat(
        withTiming(1, { duration: 4000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [audioPlaying, progressWidth]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as unknown as number,
  }));

  if (!audioPlaying && translateY.value >= 100) {
    return null;
  }

  const handlePlayPause = async () => {
    if (isPausedRef.current) {
      isPausedRef.current = false;
      await resume();
    } else {
      isPausedRef.current = true;
      await pause();
    }
  };

  const handleStop = async () => {
    isPausedRef.current = false;
    await stop();
  };

  return (
    <Animated.View
      style={[
        slideStyle,
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          zIndex: 100,
        },
      ]}
      accessibilityRole="toolbar"
      accessibilityLabel="Audio player"
    >
      {/* Progress bar */}
      <Animated.View
        style={[
          progressStyle,
          {
            position: "absolute",
            top: 0,
            left: 0,
            height: 2,
            backgroundColor: colors.accent,
          },
        ]}
      />

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        {/* Surah + Ayah info */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Amiri-Regular",
              fontSize: isImmersive ? 18 : 14,
              color: colors.textPrimary,
              writingDirection: "rtl",
              textAlign: "right",
            }}
            numberOfLines={1}
            accessibilityLanguage="ar"
          >
            {surahName}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: isImmersive ? 13 : 11,
              color: colors.textSecondary,
            }}
            numberOfLines={1}
          >
            {surahNameLatin}
            {currentAyah ? ` · Ayah ${currentAyah}` : ""}
          </Text>
        </View>

        {/* Play/Pause */}
        <Pressable
          onPress={handlePlayPause}
          hitSlop={12}
          style={{
            width: isImmersive ? 48 : 44,
            height: isImmersive ? 48 : 44,
            borderRadius: isImmersive ? 24 : 22,
            backgroundColor: colors.accent,
            justifyContent: "center",
            alignItems: "center",
          }}
          accessibilityRole="button"
          accessibilityLabel={isPausedRef.current ? "Resume" : "Pause"}
        >
          <Text
            style={{
              fontSize: iconSize,
              color: colors.bg,
              fontWeight: "700",
            }}
          >
            {isPausedRef.current ? "▶" : "❚❚"}
          </Text>
        </Pressable>

        {/* Stop / Close */}
        <Pressable
          onPress={handleStop}
          hitSlop={12}
          style={{
            width: 44,
            height: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
          accessibilityRole="button"
          accessibilityLabel="Stop audio"
        >
          <Text
            style={{
              fontSize: iconSize,
              color: colors.textSecondary,
              fontWeight: "700",
            }}
          >
            ✕
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
