import { View, Text, StyleSheet } from "react-native";
import { surahContexts } from "../data/surah-context";
import { StarOrnament } from "./ornaments";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";

interface Props {
  surahNumber: number;
}

export default function SurahContextCard({ surahNumber }: Props) {
  const { colors } = useTheme();
  const ctx = surahContexts[surahNumber];
  if (!ctx) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      accessibilityLabel="Surah revelation context"
      accessibilityRole="summary"
    >
      {/* Header */}
      <View style={styles.header}>
        <StarOrnament size={14} color={colors.accent} opacity={0.6} />
        <Text
          style={[
            styles.headerText,
            { color: colors.textGold, fontFamily: fonts.latin.semiBold },
          ]}
        >
          Revelation Context
        </Text>
      </View>

      {/* Theme quote */}
      <Text
        style={[
          styles.theme,
          { color: colors.textSecondary, fontFamily: fonts.latin.regular },
        ]}
      >
        &ldquo;{ctx.theme}&rdquo;
      </Text>

      {/* Tags */}
      <View style={styles.tags} accessibilityRole="list">
        <View
          style={[styles.tag, { backgroundColor: `${colors.forest}15` }]}
          accessibilityRole="text"
        >
          <Text
            style={[
              styles.tagText,
              { color: colors.forest, fontFamily: fonts.latin.medium },
            ]}
          >
            {ctx.period}
          </Text>
        </View>
        <View
          style={[styles.tag, { backgroundColor: `${colors.accent}15` }]}
          accessibilityRole="text"
        >
          <Text
            style={[
              styles.tagText,
              { color: colors.textGold, fontFamily: fonts.latin.medium },
            ]}
          >
            {ctx.rukus} {ctx.rukus === 1 ? "Ruku" : "Rukus"}
          </Text>
        </View>
        {ctx.sajdah != null && (
          <View
            style={[
              styles.tag,
              { backgroundColor: `${colors.textSecondary}15` },
            ]}
            accessibilityRole="text"
          >
            <Text
              style={[
                styles.tagText,
                { color: colors.textSecondary, fontFamily: fonts.latin.medium },
              ]}
            >
              Sajdah: Ayah {ctx.sajdah}
            </Text>
          </View>
        )}
      </View>

      {/* Alternative names */}
      {ctx.names.length > 0 && (
        <Text
          style={[
            styles.names,
            { color: colors.textSecondary, fontFamily: fonts.latin.regular },
          ]}
        >
          Also known as: {ctx.names.join(" · ")}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  theme: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
  },
  names: {
    fontSize: 12,
    opacity: 0.7,
  },
});
