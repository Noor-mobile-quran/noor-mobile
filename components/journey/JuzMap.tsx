import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../../theme/ThemeProvider";
import { useAppStore } from "../../store/useAppStore";
import { useSurahList } from "../../hooks/useQuranData";
import { getAllSurahs } from "../../assets/data/surahRequireMap";
import type { Surah, SurahMeta } from "../../types";
import { fonts } from "../../theme/typography";

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

function buildJuzData(surahs: Surah[], completedSurahs: number[]): JuzData[] {
  const completedSet = new Set(completedSurahs);
  const groups = new Map<
    number,
    {
      firstSurah: Surah;
      surahs: Map<number, Surah>;
      completedAyahs: number;
      totalAyahs: number;
    }
  >();

  for (const surah of surahs) {
    for (const ayah of surah.ayahs) {
      const existing = groups.get(ayah.juz);
      if (existing) {
        existing.surahs.set(surah.number, surah);
        existing.totalAyahs += 1;
        if (completedSet.has(surah.number)) {
          existing.completedAyahs += 1;
        }
      } else {
        groups.set(ayah.juz, {
          firstSurah: surah,
          surahs: new Map([[surah.number, surah]]),
          completedAyahs: completedSet.has(surah.number) ? 1 : 0,
          totalAyahs: 1,
        });
      }
    }
  }

  return Array.from({ length: TOTAL_JUZ }, (_, index) => {
    const juz = index + 1;
    const group = groups.get(juz);
    const firstSurah = group?.firstSurah ?? surahs[0];
    const totalCount = group?.totalAyahs ?? 0;
    const completedCount = group?.completedAyahs ?? 0;
    const completionPercent =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      juz,
      surahs: group ? [...group.surahs.values()] : [],
      firstSurah,
      completedCount,
      totalCount,
      completionPercent,
    };
  });
}

export function JuzMap() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: surahs } = useSurahList();
  const completedSurahs = useAppStore((s) => s.progress.completedSurahs);

  const juzData = useMemo(() => {
    if (!surahs) return [];
    return buildJuzData(getAllSurahs(), completedSurahs);
  }, [surahs, completedSurahs]);

  if (!surahs) return null;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.surface },
      ]}
    >
      <Text
        style={[styles.header, { color: colors.textPrimary }]}
        accessibilityRole="header"
      >
        Juz Overview
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        The Quran is divided into 30 Juz (parts). Read 1 Juz per day to complete
        in a month.
      </Text>

      <View style={styles.grid}>
        {juzData.map((item) => (
          <JuzCard
            key={item.juz}
            data={item}
            colors={colors}
            onPress={() => router.push(`/surah/${item.firstSurah.number}`)}
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
  const { juz, firstSurah, completedCount, totalCount, completionPercent } =
    data;
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
    completionPercent === 100 ? colors.accent : colors.surfaceElevated;

  const textColor = completionPercent === 100 ? colors.bg : colors.textPrimary;

  const secondaryTextColor =
    completionPercent === 100 ? colors.bg : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Juz ${juz}, ${firstSurah.name_english}, ${completedCount} of ${totalCount} ayahs represented by completed surahs`}
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
                  completionPercent === 100 ? colors.bg : colors.textPrimary,
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
    fontFamily: fonts.latin.semiBold,
    fontSize: 18,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: fonts.latin.regular,
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
    fontFamily: fonts.latin.bold,
    fontSize: 14,
  },
  cardInfo: {
    flex: 1,
  },
  surahArabic: {
    fontFamily: fonts.arabic.regular,
    fontSize: 14,
    textAlign: "right",
    writingDirection: "rtl",
  },
  surahEnglish: {
    fontFamily: fonts.latin.medium,
    fontSize: 13,
    marginTop: 1,
  },
  percentText: {
    fontFamily: fonts.latin.regular,
    fontSize: 11,
    marginTop: 2,
  },
});
