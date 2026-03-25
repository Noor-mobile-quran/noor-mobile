import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArabicText } from "./ui/ArabicText";
import { StarOrnament } from "./ornaments";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";
import type { Ayah } from "../types";

interface Props {
  ayah: Ayah;
  isPlaying: boolean;
  onPlay: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
}

export default function AyahCard({
  ayah,
  isPlaying,
  onPlay,
  onBookmark,
  isBookmarked,
}: Props) {
  const { colors } = useTheme();
  const [showControls, setShowControls] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setShowControls((prev) => !prev)}
      accessibilityRole="button"
      accessibilityLabel={`Ayah ${ayah.number_in_surah}. Tap for controls.`}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: isPlaying
              ? `${colors.accent}15`
              : colors.surface,
            borderColor: isPlaying ? `${colors.accent}40` : "transparent",
            borderWidth: isPlaying ? 1 : 0,
          },
        ]}
      >
        {/* Ayah number badge */}
        <View style={styles.header}>
          <View
            style={[
              styles.ayahBadge,
              { borderColor: `${colors.accent}40` },
            ]}
          >
            <StarOrnament size={8} color={colors.accent} opacity={0.3} />
            <Text
              style={[
                styles.ayahNumber,
                {
                  color: colors.accent,
                  fontFamily: fonts.latin.semiBold,
                },
              ]}
            >
              {ayah.number_in_surah}
            </Text>
          </View>

          {/* Controls — visible on tap (Serene mode: hidden until tap) */}
          {showControls && (
            <View style={styles.controls}>
              <TouchableOpacity
                onPress={onPlay}
                accessibilityLabel={isPlaying ? "Pause recitation" : "Play recitation"}
                accessibilityRole="button"
                style={[
                  styles.controlButton,
                  { backgroundColor: `${colors.accent}15` },
                ]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[styles.controlIcon, { color: isPlaying ? colors.accent : colors.textSecondary }]}>
                  {isPlaying ? "\u23F8" : "\u25B6"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onBookmark}
                accessibilityLabel={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                accessibilityRole="button"
                style={[
                  styles.controlButton,
                  { backgroundColor: `${colors.accent}15` },
                ]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text
                  style={[
                    styles.controlIcon,
                    { color: isBookmarked ? colors.gold : colors.textSecondary },
                  ]}
                >
                  {isBookmarked ? "\u2605" : "\u2606"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Arabic text */}
        <ArabicText
          style={{ color: colors.textPrimary, marginBottom: 16 }}
        >
          {ayah.text_arabic}
        </ArabicText>

        {/* Translation */}
        <Text
          style={[
            styles.translation,
            {
              color: colors.textSecondary,
              fontFamily: fonts.latin.regular,
            },
          ]}
        >
          {ayah.text_translation}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  ayahBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ayahNumber: {
    fontSize: 13,
  },
  controls: {
    flexDirection: "row",
    gap: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  controlIcon: {
    fontSize: 18,
  },
  translation: {
    fontSize: 14,
    lineHeight: 22,
  },
});
