import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { useAppStore } from "../store/useAppStore";
import { useSurahList } from "../hooks/useQuranData";
import { useTheme } from "../theme/ThemeProvider";

export default function ContinueReading() {
  const { lastReadSurah, lastReadAyah } = useAppStore((s) => s.progress);
  const { data: surahs } = useSurahList();
  const { colors } = useTheme();

  if (!lastReadSurah || !surahs) return null;
  const surah = surahs.find((s) => s.number === lastReadSurah);
  if (!surah) return null;

  return (
    <Link href={`/surah/${lastReadSurah}`} asChild>
      <Pressable
        className="p-5 rounded-xl"
        style={{ backgroundColor: colors.surface }}
        accessibilityRole="button"
        accessibilityLabel={`Continue reading ${surah.name_english}, Ayah ${lastReadAyah}`}
      >
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: "Inter-Regular",
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Continue Reading
        </Text>
        <Text
          style={{
            color: colors.textPrimary,
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            marginTop: 4,
          }}
        >
          {surah.name_english}
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: "Inter-Regular",
            fontSize: 14,
          }}
        >
          Ayah {lastReadAyah}
        </Text>
      </Pressable>
    </Link>
  );
}
