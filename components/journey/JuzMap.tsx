import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../../theme/ThemeProvider";
import { useAppStore } from "../../store/useAppStore";
import { useSurahList } from "../../hooks/useQuranData";
import type { SurahMeta } from "../../types";

const TOTAL_JUZ = 30;
const RING_SIZE = 44;
const RING_STROKE = 4;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface JuzData {
  juz: number;
  surahs: SurahMeta[];
  firstSurah: SurahMeta;
  completedCount: number;
  totalCount: number;
  completionPercent: number;
}

function buildJuzData(
  surahs: SurahMeta[],
  completedSurahs: number[]
): JuzData[] {
  const juzMap = new Map<number, SurahMeta[]>();

  for (const surah of surahs) {
    const juz = surah.juz_start;
    if (!juzMap.has(juz)) juzMap.set(juz, []);
    juzMap.get(juz)!.push(surah);
  }

  // Surahs belong to the juz they start in. For surahs spanning multiple juz,
  // juz_start indicates the primary juz.
  // Build 30 juz entries — a juz with no direct juz_start surahs inherits
  // surahs from the preceding juz that spans into it.
  const result: JuzData[] = [];
  const completedSet = new Set(completedSurahs);

  for (let j = 1; j <= TOTAL_JUZ; j++) {
    const juzSurahs = juzMap.get(j) ?? [];
    if (juzSurahs.length === 0) {
      // Juz with no direct starts — find the surah spanning from previous juz
      const prev = result[result.length - 1];
      if (prev) {
        const lastSurah = prev.surahs[prev.surahs.length - 1];
        result.push({
          juz: j,
          surahs: [lastSurah],
          firstSurah: lastSurah,
          completedCount: completedSet.has(lastSurah.number) ? 1 : 0,
          totalCount: 1,
          completionPercent: completedSet.has(lastSurah.number) ? 100 : 0,
        });
      }
      continue;
    }

    const completed = juzSurahs.filter((s) =>
      completedSet.has(s.number)
    ).length;
    const percent =
      juzSurahs.length > 0 ? Math.round((completed / juzSurahs.length) * 100) : 0;

    result.push({
      juz: j,
      surahs: juzSurahs,
      firstSurah: juzSurahs[0],
      completedCount: completed,
      totalCount: juzSurahs.length,
      completionPercent: percent,
    });
  }

  return result;
}

export function JuzMap() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: surahs } = useSurahList();
  const completedSurahs = useAppStore((s) => s.progress.completedSurahs);

  const juzData = useMemo(() => {
    if (!surahs) return [];
    return buildJuzData(surahs, completedSurahs);
  }, [surahs, completedSurahs]);

  if (!surahs) return null;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.container, { backgroundColor: colors.surface }]}>
      <Text
        style={[styles.header, { color: colors.textPrimary }]}
        accessibilityRole="header"
      >
        Juz Overview
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        The Quran is divided into 30 Juz (parts). Read 1 Juz per day to complete in a month.
      </Text>

      <View style={styles.grid}>
        {juzData.map((item) => (
          <JuzCard
            key={item.juz}
            data={item}
            colors={colors}
            onPress={() =>
              router.push(`/surah/${item.firstSurah.number}`)
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}

function JuzCard({
  data,
  colors,
  onPress,
}: {
  data: JuzData;
  colors: ReturnType<typeof useTheme>["colors"];
  onPress: () => void;
}) {
  const { juz, firstSurah, completionPercent } = data;
  const strokeDashoffset =
    RING_CIRCUMFERENCE - (completionPercent / 100) * RING_CIRCUMFERENCE;

  const ringTrackColor = colors.border;
  const ringFillColor =
    completionPercent === 100
      ? colors.accent
      : completionPercent > 0
        ? colors.accent
        : "transparent";

  const cardBg =
    completionPercent === 100
      ? colors.accent
      : colors.surfaceElevated;

  const textColor =
    completionPercent === 100 ? colors.bg : colors.textPrimary;

  const secondaryTextColor =
    completionPercent === 100 ? colors.bg : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Juz ${juz}, ${firstSurah.name_english}, ${completionPercent}% complete`}
      style={[styles.card, { backgroundColor: cardBg }]}
    >
      <View style={styles.cardRow}>
        <View style={styles.ringContainer}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={ringTrackColor}
              strokeWidth={RING_STROKE}
              fill="none"
            />
            {completionPercent > 0 && (
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                stroke={ringFillColor}
                strokeWidth={RING_STROKE}
                fill="none"
                strokeDasharray={`${RING_CIRCUMFERENCE}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation={-90}
                origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
              />
            )}
          </Svg>
          <Text
            style={[
              styles.juzNumber,
              {
                color:
                  completionPercent === 100
                    ? colors.bg
                    : colors.textPrimary,
              },
            ]}
          >
            {juz}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Text
            style={[styles.surahArabic, { color: secondaryTextColor }]}
            accessibilityLanguage="ar"
          >
            {firstSurah.name_arabic}
          </Text>
          <Text style={[styles.surahEnglish, { color: textColor }]}>
            {firstSurah.name_english}
          </Text>
          <Text style={[styles.percentText, { color: secondaryTextColor }]}>
            {completionPercent}%
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    width: "48%",
    flexGrow: 1,
    minHeight: 44,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  juzNumber: {
    position: "absolute",
    fontFamily: "Inter-Bold",
    fontSize: 14,
  },
  cardInfo: {
    flex: 1,
  },
  surahArabic: {
    fontFamily: "Amiri-Regular",
    fontSize: 14,
    textAlign: "right",
    writingDirection: "rtl",
  },
  surahEnglish: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    marginTop: 1,
  },
  percentText: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    marginTop: 2,
  },
});
