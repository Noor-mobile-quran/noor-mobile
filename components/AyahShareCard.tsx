import { View, Text, StyleSheet } from "react-native";
import { StarOrnament } from "./ornaments";
import { fonts } from "../theme/typography";
import type { Ayah } from "../types";

interface Props {
  ayah: Ayah;
  surahName: string;
  surahNameArabic: string;
  translationLang?: string;
}

export function AyahShareCard({
  ayah,
  surahName,
  surahNameArabic,
  translationLang,
}: Props) {
  const translation =
    translationLang === "ur" && ayah.text_translation_ur
      ? ayah.text_translation_ur
      : ayah.text_translation;

  const isUrdu = translationLang === "ur" && !!ayah.text_translation_ur;

  return (
    <View style={styles.card}>
      {/* Header bar with brand mark */}
      <View style={styles.header}>
        <Text style={styles.brandMark} accessibilityLanguage="ar">
          {"\u0646\u0648\u0631"}
        </Text>
      </View>

      {/* Arabic ayah text */}
      <View style={styles.arabicContainer}>
        <Text style={styles.arabicText} accessibilityLanguage="ar">
          {ayah.text_arabic}
        </Text>
      </View>

      {/* Ornamental divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <StarOrnament size={12} color="#D4A843" opacity={0.8} />
        <View style={styles.dividerLine} />
      </View>

      {/* Translation */}
      <Text
        style={[
          styles.translationText,
          isUrdu && {
            writingDirection: "rtl" as const,
            textAlign: "right" as const,
            fontFamily: fonts.arabic.regular,
          },
        ]}
        {...(isUrdu ? { accessibilityLanguage: "ur" } : {})}
      >
        {translation}
      </Text>

      {/* Footer */}
      <Text style={styles.footer}>
        Surah {surahName} : Ayah {ayah.number_in_surah}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1B4332",
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  brandMark: {
    fontFamily: fonts.arabic.bold,
    fontSize: 22,
    color: "#D4A843",
  },
  arabicContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  arabicText: {
    fontFamily: fonts.arabic.bold,
    fontSize: 24,
    color: "#D4A843",
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 44,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(212, 168, 67, 0.3)",
  },
  translationText: {
    fontFamily: fonts.latin.regular,
    fontSize: 15,
    color: "#FFF9ED",
    lineHeight: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    textAlign: "center",
  },
  footer: {
    fontFamily: fonts.latin.medium,
    fontSize: 11,
    color: "rgba(255, 249, 237, 0.5)",
    textAlign: "center",
    paddingBottom: 16,
    letterSpacing: 0.5,
  },
});
