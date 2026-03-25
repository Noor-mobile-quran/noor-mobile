import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  AccessibilityInfo,
  Platform,
  Animated,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../theme/ThemeProvider";
import { useAppStore } from "../../store/useAppStore";
import { useSurahList } from "../../hooks/useQuranData";

const COLUMNS_MOBILE = 8;
const COLUMNS_DESKTOP = 11;

export function SurahCompletionTracker() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: surahs } = useSurahList();
  const completedSurahs = useAppStore((s) => s.progress.completedSurahs);
  const lastReadSurah = useAppStore((s) => s.progress.lastReadSurah);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    try {
      if (Platform.OS === "web") return;
      const subscription = AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        (value) => setReduceMotion(value)
      );
      AccessibilityInfo.isReduceMotionEnabled()
        .then((value) => setReduceMotion(value))
        .catch(() => {});
      return () => subscription?.remove();
    } catch {
      // Web fallback — reduce motion stays true
    }
  }, []);

  const completedCount = completedSurahs.length;
  const total = 114;
  const progressRatio = completedCount / total;

  const { width } = useWindowDimensions();
  const columns = width < 600 ? COLUMNS_MOBILE : COLUMNS_DESKTOP;
  const circleSize = Math.min(36, Math.floor((width - 64) / columns) - 8);

  if (!surahs) return null;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.container, { backgroundColor: colors.surface }]}>
      <Text
        style={[styles.header, { color: colors.textPrimary }]}
        accessibilityRole="header"
      >
        Quran Completion
      </Text>
      <Text style={[styles.fraction, { color: colors.textSecondary }]}>
        {completedCount} / {total} Surahs
      </Text>

      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.gold,
              width: `${Math.round(progressRatio * 100)}%`,
            },
          ]}
        />
      </View>

      <View style={styles.grid}>
        {surahs.slice(0, 114).map((surah) => {
          const isCompleted = completedSurahs.includes(surah.number);
          const isCurrent = surah.number === lastReadSurah;

          return (
            <SurahCircle
              key={surah.number}
              surah={surah.number}
              nameEnglish={surah.name_english}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              reduceMotion={reduceMotion}
              colors={colors}
              size={circleSize}
              columnWidth={`${100 / columns}%`}
              onPress={() => router.push(`/surah/${surah.number}`)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

function SurahCircle({
  surah,
  nameEnglish,
  isCompleted,
  isCurrent,
  reduceMotion,
  colors,
  size,
  columnWidth,
  onPress,
}: {
  surah: number;
  nameEnglish: string;
  isCompleted: boolean;
  isCurrent: boolean;
  reduceMotion: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
  size: number;
  columnWidth: string;
  onPress: () => void;
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCurrent && !reduceMotion) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCurrent, reduceMotion, pulseAnim]);

  const borderColor = isCurrent
    ? reduceMotion
      ? colors.gold
      : pulseAnim.interpolate({
          inputRange: [0.4, 1],
          outputRange: ["rgba(212,168,67,0.4)", colors.gold],
        })
    : colors.border;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Surah ${surah}, ${nameEnglish}${
        isCompleted ? ", completed" : isCurrent ? ", current" : ""
      }`}
      style={[styles.circleWrapper, { width: columnWidth as unknown as number }]}
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isCompleted ? colors.gold : "transparent",
            borderColor: borderColor,
            borderWidth: isCurrent ? 2.5 : 1.5,
          },
        ]}
      >
        <Text
          style={{
            fontSize: Math.max(9, size * 0.35),
            textAlign: "center",
            color: isCompleted ? colors.bg : colors.textSecondary,
            fontFamily: "Inter-Medium",
          }}
        >
          {surah}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    marginBottom: 2,
  },
  fraction: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  circleWrapper: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
