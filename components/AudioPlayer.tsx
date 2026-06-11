import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  AccessibilityInfo,
  type DimensionValue,
} from "react-native";
import Svg, { Path, Rect, Line } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../theme/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import { useNoorAudioPlayer } from "../hooks/useAudioPlayer";
import { useSurahList } from "../hooks/useQuranData";
import { fonts } from "../theme/typography";

export function AudioPlayer() {
  const { colors } = useTheme();
  const audioPlaying = useAppStore((s) => s.audioPlaying);
  const currentAyah = useAppStore((s) => s.currentAudioAyah);
  const uxMode = useAppStore((s) => s.settings.uxMode);
  const lastReadSurah = useAppStore((s) => s.progress.lastReadSurah);
  const { stop, pause, resume } = useNoorAudioPlayer();
  const { data: surahList } = useSurahList();

  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const translateY = useSharedValue(100);
  const progressWidth = useSharedValue(0);

  const isImmersive = uxMode === "immersive";
  const barHeight = isImmersive ? 80 : 56;
  const iconSize = isImmersive ? 28 : 20;

  // Find surah name
  const surahMeta = surahList?.find((s) => s.number === lastReadSurah);
  const surahName = surahMeta?.name_arabic ?? "";
  const surahNameLatin = surahMeta?.name_english ?? "";

  useEffect(() => {
    try {
      AccessibilityInfo.isReduceMotionEnabled()
        .then(setReduceMotion)
        .catch(() => {});
      const sub = AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        setReduceMotion,
      );
      return () => sub?.remove();
    } catch {
      return undefined;
    }
  }, []);

  useEffect(() => {
    if (!audioPlaying) {
      setIsPaused(false);
    }
  }, [audioPlaying, currentAyah]);

  useEffect(() => {
    translateY.value = reduceMotion
      ? audioPlaying
        ? 0
        : 100
      : withTiming(audioPlaying ? 0 : 100, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
  }, [audioPlaying, reduceMotion, translateY]);

  useEffect(() => {
    cancelAnimation(progressWidth);

    if (audioPlaying && !isPaused) {
      progressWidth.value = 0;
      progressWidth.value = reduceMotion
        ? 1
        : withRepeat(
            withTiming(1, { duration: 4000, easing: Easing.linear }),
            -1,
            false,
          );
    } else {
      progressWidth.value = 0;
    }
  }, [audioPlaying, isPaused, progressWidth, reduceMotion]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as DimensionValue,
  }));

  if (!audioPlaying) {
    return null;
  }

  const handlePlayPause = async () => {
    if (isPaused) {
      setIsPaused(false);
      await resume();
    } else {
      setIsPaused(true);
      await pause();
    }
  };

  const handleStop = async () => {
    setIsPaused(false);
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
              fontFamily: fonts.arabic.regular,
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
              fontFamily: fonts.latin.regular,
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
          accessibilityLabel={isPaused ? "Resume" : "Pause"}
          accessibilityHint="Double tap to toggle audio playback"
        >
          {isPaused ? (
            <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
              <Path d="M8 5v14l11-7z" fill={colors.bg} />
            </Svg>
          ) : (
            <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
              <Rect x={6} y={4} width={4} height={16} rx={1} fill={colors.bg} />
              <Rect
                x={14}
                y={4}
                width={4}
                height={16}
                rx={1}
                fill={colors.bg}
              />
            </Svg>
          )}
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
          accessibilityHint="Double tap to stop and close audio player"
        >
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
            <Line
              x1={6}
              y1={6}
              x2={18}
              y2={18}
              stroke={colors.textSecondary}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <Line
              x1={18}
              y1={6}
              x2={6}
              y2={18}
              stroke={colors.textSecondary}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
      </View>
    </Animated.View>
  );
}
