import { useEffect, useState } from "react";
import { AccessibilityInfo, View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, Rect } from "react-native-svg";
import { ArabicText } from "./ui/ArabicText";
import { StarOrnament } from "./ornaments";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";
import ShareButton from "./ShareButton";
import type { Ayah } from "../types";
import type { UXMode } from "../types";

interface Props {
  ayah: Ayah;
  isPlaying: boolean;
  onPlay: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
  uxMode?: UXMode;
  translationLang?: string;
  surahName?: string;
  surahNameArabic?: string;
}

function PlayIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8 5v14l11-7z" fill={color} />
    </Svg>
  );
}

function PauseIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={6} y={4} width={4} height={16} rx={1} fill={color} />
      <Rect x={14} y={4} width={4} height={16} rx={1} fill={color} />
    </Svg>
  );
}

function BookmarkIcon({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5 3h14a1 1 0 011 1v17.2a.8.8 0 01-1.2.7L12 18l-6.8 3.9A.8.8 0 014 21.2V4a1 1 0 011-1z"
        fill={filled ? color : "none"}
        stroke={filled ? undefined : color}
        strokeWidth={filled ? undefined : 2}
      />
    </Svg>
  );
}

export default function AyahCard({
  ayah,
  isPlaying,
  onPlay,
  onBookmark,
  isBookmarked,
  uxMode = "serene",
  translationLang,
  surahName,
  surahNameArabic,
}: Props) {
  const { colors } = useTheme();
  const [showControls, setShowControls] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const enterOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const enterTranslateY = useSharedValue(reduceMotion ? 0 : 10);

  useEffect(() => {
    const checkMotion = async () => {
      try {
        const enabled = await AccessibilityInfo.isReduceMotionEnabled();
        setReduceMotion(enabled);
        if (enabled) {
          enterOpacity.value = 1;
          enterTranslateY.value = 0;
        } else {
          enterOpacity.value = withTiming(1, {
            duration: 200,
            easing: Easing.out(Easing.cubic),
          });
          enterTranslateY.value = withTiming(0, {
            duration: 200,
            easing: Easing.out(Easing.cubic),
          });
        }
      } catch {
        setReduceMotion(false);
        enterOpacity.value = withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
        enterTranslateY.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
      }
    };
    checkMotion();

    let sub: any;
    try {
      sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    } catch {}
    return () => { try { sub?.remove(); } catch {} };
  }, [enterOpacity, enterTranslateY]);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: enterOpacity.value,
    transform: [{ translateY: enterTranslateY.value }],
  }));

  const isImmersive = uxMode === "immersive";
  const controlsVisible = isImmersive || showControls;
  const controlButtonSize = isImmersive ? 56 : 44;

  return (
    <Animated.View style={enterStyle}>
    <Pressable
      onPress={() => {
        if (!isImmersive) setShowControls((prev) => !prev);
      }}
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
          isImmersive && {
            borderLeftWidth: 2,
            borderLeftColor: colors.accent,
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

          {/* Controls */}
          {controlsVisible && (
            <View style={styles.controls}>
              <TouchableOpacity
                onPress={onPlay}
                accessibilityLabel={isPlaying ? `Pause recitation for ayah ${ayah.number_in_surah}` : `Play recitation for ayah ${ayah.number_in_surah}`}
                accessibilityRole="button"
                accessibilityHint="Double tap to toggle audio playback"
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: `${colors.accent}15`,
                    width: controlButtonSize,
                    height: controlButtonSize,
                  },
                ]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {isPlaying ? (
                  <PauseIcon size={18} color={colors.accent} />
                ) : (
                  <PlayIcon size={18} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onBookmark}
                accessibilityLabel={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                accessibilityRole="button"
                accessibilityHint="Double tap to toggle bookmark"
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: `${colors.accent}15`,
                    width: controlButtonSize,
                    height: controlButtonSize,
                  },
                ]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <BookmarkIcon
                  size={18}
                  color={isBookmarked ? colors.accent : colors.textSecondary}
                  filled={isBookmarked}
                />
              </TouchableOpacity>
              {surahName && (
                <ShareButton
                  ayah={ayah}
                  surahName={surahName}
                  surahNameArabic={surahNameArabic ?? ""}
                  translationLang={translationLang}
                />
              )}
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
              fontFamily:
                translationLang === "ur" ? "Amiri_400Regular" : fonts.latin.regular,
              ...(translationLang === "ur" && {
                writingDirection: "rtl" as const,
                textAlign: "right" as const,
              }),
            },
          ]}
          {...(translationLang === "ur" && { accessibilityLanguage: "ur" })}
        >
          {translationLang === "ur" && ayah.text_translation_ur
            ? ayah.text_translation_ur
            : ayah.text_translation}
        </Text>
      </View>
    </Pressable>
    </Animated.View>
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
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  translation: {
    fontSize: 14,
    lineHeight: 22,
  },
});
