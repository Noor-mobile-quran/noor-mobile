import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../theme/ThemeProvider";
import { ArabicText } from "../ui/ArabicText";
import surahMap from "../../assets/data/surahRequireMap";
import surahIndex from "../../assets/data/surah-index.json";
import hyperedgesData from "../../assets/knowledge/hyperedges.json";
import type { Surah } from "../../types";
import { fonts } from "../../theme/typography";

interface StoryModeProps {
  narrativeId: string;
  onClose: () => void;
  onAyahPress?: (surah: number, ayah: number) => void;
}

interface ParsedRange {
  surah: number;
  ayahStart: number;
  ayahEnd: number;
  raw: string;
}

function BackArrow({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" accessible={false}>
      <Path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function parseRange(ref: string): ParsedRange | null {
  const match = ref.match(/^(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;
  const surah = parseInt(match[1], 10);
  const ayahStart = parseInt(match[2], 10);
  const ayahEnd = match[3] ? parseInt(match[3], 10) : ayahStart;
  return { surah, ayahStart, ayahEnd, raw: ref };
}

function getSurahName(surahNum: number): string {
  const meta = (
    surahIndex as Array<{ number: number; name_english: string }>
  ).find((s) => s.number === surahNum);
  return meta?.name_english ?? `Surah ${surahNum}`;
}

function getAyahs(surahNum: number, start: number, end: number) {
  const surah = surahMap[surahNum] as Surah | undefined;
  if (!surah) return [];
  return surah.ayahs.filter(
    (a) => a.number_in_surah >= start && a.number_in_surah <= end,
  );
}

export function StoryMode({
  narrativeId,
  onClose,
  onAyahPress,
}: StoryModeProps) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const narrative = useMemo(
    () =>
      (hyperedgesData as any).hyperedges.find(
        (h: any) => h.id === narrativeId && h.type === "narrative_arc",
      ),
    [narrativeId],
  );

  const scenes = useMemo(() => {
    if (!narrative) return [];
    return (narrative.grounding_ayahs as string[])
      .map(parseRange)
      .filter((r): r is ParsedRange => r !== null);
  }, [narrative]);

  if (!narrative || scenes.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <BackArrow color={colors.textPrimary} />
          </Pressable>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Narrative not found
          </Text>
        </View>
      </View>
    );
  }

  const label = narrative.label as string;
  const progress = (currentIndex + 1) / scenes.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Pressable
          onPress={onClose}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <BackArrow color={colors.textPrimary} />
        </Pressable>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {label}
        </Text>
        <Text style={[styles.counter, { color: colors.textSecondary }]}>
          {currentIndex + 1}/{scenes.length}
        </Text>
      </View>

      <View style={[styles.timelineTrack, { backgroundColor: colors.accent }]}>
        <View
          style={[
            styles.timelineFill,
            { backgroundColor: colors.textGold, width: `${progress * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          const height = e.nativeEvent.layoutMeasurement.height;
          const contentHeight = e.nativeEvent.contentSize.height;
          if (contentHeight > 0) {
            const ratio = offsetY / (contentHeight - height);
            const idx = Math.min(
              Math.round(ratio * (scenes.length - 1)),
              scenes.length - 1,
            );
            setCurrentIndex(Math.max(0, idx));
          }
        }}
      >
        {scenes.map((scene, idx) => {
          const ayahs = getAyahs(scene.surah, scene.ayahStart, scene.ayahEnd);
          const surahName = getSurahName(scene.surah);
          const showDivider = idx > 0 && scenes[idx - 1].surah !== scene.surah;
          const rangeLabel =
            scene.ayahStart === scene.ayahEnd
              ? `${scene.ayahStart}`
              : `${scene.ayahStart}-${scene.ayahEnd}`;

          return (
            <View key={`${scene.surah}-${scene.ayahStart}-${idx}`}>
              {showDivider && (
                <View style={styles.dividerRow}>
                  <View
                    style={[
                      styles.dividerLine,
                      { backgroundColor: colors.textSecondary },
                    ]}
                  />
                  <Text
                    style={[
                      styles.dividerText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Surah {surahName} ({scene.surah})
                  </Text>
                  <View
                    style={[
                      styles.dividerLine,
                      { backgroundColor: colors.textSecondary },
                    ]}
                  />
                </View>
              )}

              <Pressable
                onPress={() => onAyahPress?.(scene.surah, scene.ayahStart)}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderLeftColor: colors.accent,
                  },
                ]}
                accessibilityLabel={`${surahName}, ayahs ${rangeLabel}`}
                accessibilityRole="button"
              >
                {ayahs.map((ayah) => (
                  <View key={ayah.number_in_surah} style={styles.ayahBlock}>
                    <ArabicText style={{ color: colors.textPrimary }}>
                      {ayah.text_arabic}
                    </ArabicText>
                    <Text
                      style={[
                        styles.translation,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {ayah.text_translation}
                    </Text>
                  </View>
                ))}
                <Text
                  style={[styles.reference, { color: colors.textSecondary }]}
                >
                  {surahName} - {scene.surah}:{rangeLabel}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontFamily: fonts.latin.semiBold,
    fontSize: 16,
    marginLeft: 4,
  },
  counter: {
    fontFamily: fonts.latin.medium,
    fontSize: 14,
    marginLeft: 8,
  },
  timelineTrack: {
    height: 4,
    marginHorizontal: 16,
    borderRadius: 2,
    overflow: "hidden",
  },
  timelineFill: {
    height: 4,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderLeftWidth: 3,
    borderRadius: 8,
    padding: 16,
  },
  ayahBlock: {
    marginBottom: 12,
  },
  translation: {
    fontFamily: fonts.latin.regular,
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  reference: {
    fontFamily: fonts.latin.medium,
    fontSize: 12,
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  dividerText: {
    fontFamily: fonts.latin.medium,
    fontSize: 12,
  },
});
