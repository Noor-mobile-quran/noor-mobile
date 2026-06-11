import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useTheme } from "../../theme/ThemeProvider";
import { useAppStore } from "../../store/useAppStore";
import { useSurahList } from "../../hooks/useQuranData";
import type { SurahMeta } from "../../types";
import { fonts } from "../../theme/typography";

const COLUMNS_MOBILE = 8;
const COLUMNS_DESKTOP = 11;

/* ── Help icon SVG ── */
function HelpIcon({
  size = 16,
  color = "#6B5B45",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"
        fill={color}
      />
      <Path
        d="M12 16a1 1 0 100-2 1 1 0 000 2zm1-4.5V12h-2v-.5a3 3 0 113-3h-2a1 1 0 00-1 1v.5"
        fill={color}
      />
    </Svg>
  );
}

/* ── Tiny crescent SVG for "last read" indicator ── */
function CrescentIndicator({
  size = 10,
  color = "#D4A843",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill={color} />
    </Svg>
  );
}

/* ── Build a set of surah numbers that start a new Juz ── */
function getJuzBoundaries(surahs: SurahMeta[]): Map<number, number> {
  const boundaries = new Map<number, number>();
  let lastJuz = 0;
  for (const surah of surahs) {
    if (surah.juz_start !== lastJuz) {
      boundaries.set(surah.number, surah.juz_start);
      lastJuz = surah.juz_start;
    }
  }
  return boundaries;
}

export function SurahCompletionTracker() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: surahs } = useSurahList();
  const completedSurahs = useAppStore((s) => s.progress.completedSurahs);
  const lastReadSurah = useAppStore((s) => s.progress.lastReadSurah);
  const completionGuideShown = useAppStore((s) => s.completionGuideShown);
  const setCompletionGuideShown = useAppStore((s) => s.setCompletionGuideShown);
  const [showGuide, setShowGuide] = useState(!completionGuideShown);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);

  // Mark guide as shown on first render
  useEffect(() => {
    if (!completionGuideShown) {
      setCompletionGuideShown(true);
    }
  }, [completionGuideShown, setCompletionGuideShown]);

  useEffect(() => {
    try {
      if (Platform.OS === "web") return;
      const subscription = AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        (value) => setReduceMotion(value),
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
  const percentComplete = Math.round(progressRatio * 100);

  const { width } = useWindowDimensions();
  const columns = width < 600 ? COLUMNS_MOBILE : COLUMNS_DESKTOP;
  const circleSize = Math.min(36, Math.floor((width - 64) / columns) - 8);

  const juzBoundaries = useMemo(() => {
    if (!surahs) return new Map<number, number>();
    return getJuzBoundaries(surahs.slice(0, 114));
  }, [surahs]);

  const handleSurahPress = useCallback(
    (surah: SurahMeta) => {
      setSelectedSurah((prev) => {
        if (prev?.number === surah.number) {
          // Second tap navigates.
          router.push(`/surah/${surah.number}`);
          return null;
        }
        return surah;
      });
    },
    [router],
  );

  const handleSurahLongPress = useCallback(
    (surah: SurahMeta) => {
      router.push(`/surah/${surah.number}`);
    },
    [router],
  );

  // Auto-dismiss tooltip after 3s
  useEffect(() => {
    if (!selectedSurah) return;
    const timer = setTimeout(() => setSelectedSurah(null), 3000);
    return () => clearTimeout(timer);
  }, [selectedSurah]);

  if (!surahs) return null;

  // Build grid rows with Juz markers interspersed
  const surahList = surahs.slice(0, 114);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.surface },
      ]}
    >
      <View style={styles.headerRow}>
        <Text
          style={[styles.header, { color: colors.textPrimary }]}
          accessibilityRole="header"
        >
          Quran Completion
        </Text>
        <Pressable
          onPress={() => setShowGuide((v) => !v)}
          accessibilityLabel={showGuide ? "Hide guide" : "Show guide"}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.helpButton}
        >
          <HelpIcon size={16} color={colors.textSecondary} />
        </Pressable>
      </View>
      <Text style={[styles.fraction, { color: colors.textSecondary }]}>
        {completedCount} / {total} Surahs
      </Text>

      {/* Progress bar */}
      <View
        style={[styles.progressBar, { backgroundColor: colors.border }]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 114, now: completedCount }}
        accessibilityLabel={`Quran completion: ${completedCount} of 114 surahs`}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.accent,
              width: `${Math.round(progressRatio * 100)}%`,
            },
          ]}
        />
      </View>

      {/* Stats row */}
      <View style={[styles.statsRow, { borderColor: colors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.textGold }]}>
            {completedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Completed
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: colors.border }]}
        />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.textGold }]}>
            {total - completedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Remaining
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: colors.border }]}
        />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.textGold }]}>
            {percentComplete}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Complete
          </Text>
        </View>
      </View>

      {/* Guide text — shows on first visit or when "?" is tapped */}
      {showGuide && (
        <Text style={[styles.guideText, { color: colors.textSecondary }]}>
          Each circle is a surah. Tap to see its name, tap again to read. Gold =
          completed. Your goal: fill all 114.
        </Text>
      )}

      {/* Selected surah tooltip */}
      {selectedSurah && (
        <Pressable
          onPress={() => {
            router.push(`/surah/${selectedSurah.number}`);
            setSelectedSurah(null);
          }}
          style={[
            styles.tooltip,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.accent,
            },
          ]}
          accessibilityLiveRegion="polite"
        >
          <Text style={[styles.tooltipArabic, { color: colors.textGold }]}>
            {selectedSurah.name_arabic}
          </Text>
          <Text style={[styles.tooltipName, { color: colors.textPrimary }]}>
            {selectedSurah.name_english}
          </Text>
          <Text style={[styles.tooltipMeta, { color: colors.textSecondary }]}>
            Surah {selectedSurah.number}, {selectedSurah.ayah_count} ayahs,{" "}
            {selectedSurah.revelation_type === "meccan" ? "Meccan" : "Medinan"},
            tap to read
          </Text>
        </Pressable>
      )}

      {/* Dense surah grid with Juz boundary markers */}
      <View style={styles.grid}>
        {surahList.map((surah) => {
          const isCompleted = completedSurahs.includes(surah.number);
          const isCurrent = surah.number === lastReadSurah;
          const juzStart = juzBoundaries.get(surah.number);

          return (
            <React.Fragment key={surah.number}>
              {/* Juz boundary marker — full-width row */}
              {juzStart !== undefined && (
                <View style={[styles.juzMarker, { width: "100%" }]}>
                  <View
                    style={[styles.juzLine, { backgroundColor: colors.border }]}
                  />
                  <Text
                    style={[styles.juzLabel, { color: colors.textSecondary }]}
                  >
                    Juz {juzStart}
                  </Text>
                  <View
                    style={[styles.juzLine, { backgroundColor: colors.border }]}
                  />
                </View>
              )}
              <SurahCircle
                surah={surah}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                isSelected={selectedSurah?.number === surah.number}
                reduceMotion={reduceMotion}
                colors={colors}
                size={circleSize}
                columnWidth={`${100 / columns}%`}
                onPress={() => handleSurahPress(surah)}
                onLongPress={() => handleSurahLongPress(surah)}
              />
            </React.Fragment>
          );
        })}
      </View>
    </ScrollView>
  );
}

function SurahCircle({
  surah,
  isCompleted,
  isCurrent,
  isSelected,
  reduceMotion,
  colors,
  size,
  columnWidth,
  onPress,
  onLongPress,
}: {
  surah: SurahMeta;
  isCompleted: boolean;
  isCurrent: boolean;
  isSelected: boolean;
  reduceMotion: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
  size: number;
  columnWidth: string;
  onPress: () => void;
  onLongPress: () => void;
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
        ]),
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCurrent, reduceMotion, pulseAnim]);

  const borderColor = isCurrent
    ? reduceMotion
      ? colors.accent
      : pulseAnim.interpolate({
          inputRange: [0.4, 1],
          outputRange: ["rgba(212,168,67,0.4)", colors.accent],
        })
    : isSelected
      ? colors.accent
      : colors.border;

  // 3-state color: completed = solid gold, current = faint gold, unread = transparent
  const bgColor = isCompleted
    ? colors.accent
    : isCurrent
      ? `${colors.accent}33`
      : "transparent";

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={`Surah ${surah.number}, ${surah.name_english}${
        isCompleted ? ", completed" : isCurrent ? ", current" : ""
      }`}
      style={[
        styles.circleWrapper,
        { width: columnWidth as unknown as number },
      ]}
    >
      {/* Crescent indicator above current surah */}
      {isCurrent && (
        <View style={styles.currentIndicator}>
          <CrescentIndicator
            size={Math.max(8, size * 0.3)}
            color={colors.accent}
          />
        </View>
      )}
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: isCurrent ? 2.5 : isSelected ? 2 : 1.5,
          },
        ]}
      >
        <Text
          style={{
            fontSize: Math.max(9, size * 0.35),
            textAlign: "center",
            color: isCompleted ? colors.bg : colors.textSecondary,
            fontFamily: fonts.latin.medium,
          }}
        >
          {surah.number}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontFamily: fonts.latin.semiBold,
    fontSize: 18,
    marginBottom: 2,
  },
  helpButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  guideText: {
    fontFamily: fonts.latin.regular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  fraction: {
    fontFamily: fonts.latin.regular,
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontFamily: fonts.latin.semiBold,
    fontSize: 16,
  },
  statLabel: {
    fontFamily: fonts.latin.regular,
    fontSize: 11,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  tooltip: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: "center",
  },
  tooltipArabic: {
    fontFamily: fonts.arabic.regular,
    fontSize: 20,
    marginBottom: 2,
  },
  tooltipName: {
    fontFamily: fonts.latin.semiBold,
    fontSize: 14,
  },
  tooltipMeta: {
    fontFamily: fonts.latin.regular,
    fontSize: 12,
    marginTop: 2,
  },
  juzMarker: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  juzLine: {
    flex: 1,
    height: 1,
  },
  juzLabel: {
    fontFamily: fonts.latin.medium,
    fontSize: 10,
    paddingHorizontal: 6,
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
  currentIndicator: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
  },
});
