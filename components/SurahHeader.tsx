import { View, Text, StyleSheet } from "react-native";
import { ArabicText } from "./ui/ArabicText";
import { StarOrnament, OrnamentalDivider, Crescent } from "./ornaments";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";
import type { SurahMeta } from "../types";

interface Props {
  surah: SurahMeta;
}

export default function SurahHeader({ surah }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Ornamental top */}
      <OrnamentalDivider width="compact" />

      {/* Surah number badge */}
      <View style={[styles.numberBadge, { borderColor: `${colors.accent}40` }]}>
        <Text
          style={[
            styles.numberText,
            { color: colors.textGold, fontFamily: fonts.latin.semiBold },
          ]}
        >
          {surah.number}
        </Text>
      </View>

      {/* Arabic name */}
      <ArabicText
        variant="display"
        style={{
          color: colors.textGold,
          textAlign: "center",
          marginVertical: 8,
        }}
      >
        {surah.name_arabic}
      </ArabicText>

      {/* English name */}
      <Text
        style={[
          styles.englishName,
          { color: colors.textPrimary, fontFamily: fonts.latin.semiBold },
        ]}
      >
        {surah.name_english}
      </Text>

      {/* Metadata */}
      <Text
        style={[
          styles.metadata,
          { color: colors.textSecondary, fontFamily: fonts.latin.regular },
        ]}
      >
        {surah.name_translation} · {surah.ayah_count} Ayahs ·{" "}
        {surah.revelation_type === "meccan" ? "Meccan" : "Medinan"}
      </Text>

      {/* Triple star ornament */}
      <View style={styles.tripleStars}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <View style={styles.starRow}>
          <StarOrnament size={8} color={colors.accent} opacity={0.3} />
          <StarOrnament size={10} color={colors.accent} opacity={0.4} />
          <StarOrnament size={8} color={colors.accent} opacity={0.3} />
        </View>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>

      {/* Bismillah (not for Surah 9) */}
      {surah.number !== 9 && (
        <View style={styles.bismillahContainer}>
          <ArabicText
            variant="heading"
            style={{ color: colors.textGold, textAlign: "center" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </ArabicText>
          <Text
            style={[
              styles.bismillahTranslation,
              { color: colors.textSecondary, fontFamily: fonts.latin.regular },
            ]}
          >
            In the name of Allah, the Most Gracious, the Most Merciful
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 4,
  },
  numberBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  numberText: {
    fontSize: 16,
  },
  englishName: {
    fontSize: 20,
    marginTop: 4,
  },
  metadata: {
    fontSize: 13,
    marginTop: 4,
  },
  tripleStars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
    width: "100%",
    paddingHorizontal: 40,
  },
  line: {
    flex: 1,
    height: 1,
  },
  starRow: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  bismillahContainer: {
    marginTop: 8,
    alignItems: "center",
    gap: 8,
  },
  bismillahTranslation: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
