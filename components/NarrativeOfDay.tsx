import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";

const narrativesData = require("../assets/knowledge/narratives.json");

function BookIcon({ size = 16, color = "#D4A843" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19.5A2.5 2.5 0 016.5 17H20"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ArrowRightIcon({ size = 14, color = "#D4A843" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14M12 5l7 7-7 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function NarrativeOfDay() {
  const { colors } = useTheme();
  const router = useRouter();

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const narratives = narrativesData.narratives as Array<{
    id: string;
    title_english: string;
    title_arabic: string;
    title_urdu: string;
    description: string;
    surah_sequence: Array<{ surah: number; ayah_range: number[]; summary: string }>;
  }>;
  const narrative = narratives[dayOfYear % narratives.length];

  if (!narrative) return null;

  const descriptionPreview =
    narrative.description.length > 80
      ? narrative.description.slice(0, 80).trimEnd() + "..."
      : narrative.description;

  const surahCount = narrative.surah_sequence.length;

  return (
    <Pressable
      onPress={() => router.push("/journey")}
      accessibilityRole="button"
      accessibilityLabel={`Story Arc: ${narrative.title_english}. Spans ${surahCount} surahs. Tap to explore.`}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderLeftColor: colors.accent,
        },
      ]}
    >
      {/* Label row */}
      <View style={styles.labelRow}>
        <BookIcon size={14} color={colors.accent} />
        <Text style={[styles.label, { color: colors.textGold }]}>Story Arc</Text>
      </View>

      {/* Title: English + Arabic */}
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {narrative.title_english}
      </Text>
      <Text
        style={[styles.titleArabic, { color: colors.textSecondary }]}
        accessibilityLanguage="ar"
      >
        {narrative.title_arabic}
      </Text>

      {/* Description preview */}
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {descriptionPreview}
      </Text>

      {/* Footer: badge + arrow */}
      <View style={styles.footer}>
        <View style={[styles.badge, { backgroundColor: `${colors.accent}20` }]}>
          <Text style={[styles.badgeText, { color: colors.textGold }]}>
            Spans {surahCount} surah{surahCount !== 1 ? "s" : ""}
          </Text>
        </View>
        <ArrowRightIcon size={14} color={colors.accent} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderLeftWidth: 2,
    padding: 16,
    minHeight: 44,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontFamily: "Inter-Medium",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    marginBottom: 2,
  },
  titleArabic: {
    fontFamily: "Amiri-Regular",
    fontSize: 18,
    writingDirection: "rtl",
    marginBottom: 8,
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },
});
