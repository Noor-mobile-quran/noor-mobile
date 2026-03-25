import { TouchableOpacity, Share, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";
import type { Ayah } from "../types";

interface Props {
  ayah: Ayah;
  surahName: string;
  surahNameArabic: string;
  translationLang?: string;
  size?: number;
}

function ShareIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M16 6l-4-4-4 4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M12 2v13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export default function ShareButton({
  ayah,
  surahName,
  translationLang,
  size = 18,
}: Props) {
  const { colors } = useTheme();

  const translation =
    translationLang === "ur" && ayah.text_translation_ur
      ? ayah.text_translation_ur
      : ayah.text_translation;

  const handleShare = async () => {
    const message = [
      ayah.text_arabic,
      "",
      translation,
      "",
      `— Surah ${surahName}, Ayah ${ayah.number_in_surah}`,
      "",
      "via Noor App",
    ].join("\n");

    try {
      await Share.share({ message });
    } catch {
      // User cancelled or share failed silently
    }
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      accessibilityLabel="Share this ayah"
      accessibilityRole="button"
      style={[
        styles.button,
        { backgroundColor: `${colors.accent}15` },
      ]}
    >
      <ShareIcon size={size} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
