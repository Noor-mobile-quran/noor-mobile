import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { ArabicText } from "./ui/ArabicText";
import { useTheme } from "../theme/ThemeProvider";
import type { SurahMeta } from "../types";

interface Props {
  surah: SurahMeta;
}

export default function SurahCard({ surah }: Props) {
  const { colors } = useTheme();

  return (
    <Link href={`/surah/${surah.number}`} asChild>
      <Pressable
        className="flex-row items-center gap-4 p-4 rounded-xl"
        style={{
          backgroundColor: colors.surface,
          borderRightWidth: 2,
          borderRightColor: colors.border,
        }}
        accessibilityRole="button"
        accessibilityLabel={`Surah ${surah.number}, ${surah.name_english}, ${surah.name_translation}, ${surah.ayah_count} ayahs, ${surah.revelation_type === "meccan" ? "Meccan" : "Medinan"}`}
      >
        {/* Number badge */}
        <View
          className="w-10 h-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${colors.gold}18` }}
        >
          <Text
            style={{
              color: colors.gold,
              fontFamily: "Inter-SemiBold",
              fontSize: 14,
            }}
          >
            {surah.number}
          </Text>
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              style={{
                color: colors.textPrimary,
                fontFamily: "Inter-SemiBold",
                fontSize: 15,
              }}
              numberOfLines={1}
            >
              {surah.name_english}
            </Text>
            <ArabicText
              style={{
                color: colors.textPrimary,
                fontSize: 20,
                lineHeight: 30,
                textAlign: "right",
              }}
            >
              {surah.name_arabic}
            </ArabicText>
          </View>
          <View className="flex-row items-center gap-2 mt-1">
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: "Inter-Regular",
                fontSize: 12,
              }}
            >
              {surah.name_translation}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>·</Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: "Inter-Regular",
                fontSize: 12,
              }}
            >
              {surah.ayah_count} ayahs
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>·</Text>
            <View
              className="px-2 py-0.5 rounded-full"
              style={{
                backgroundColor:
                  surah.revelation_type === "meccan"
                    ? `${colors.forest}18`
                    : `${colors.gold}18`,
              }}
            >
              <Text
                style={{
                  color:
                    surah.revelation_type === "meccan"
                      ? colors.forest
                      : colors.gold,
                  fontFamily: "Inter-Medium",
                  fontSize: 11,
                }}
              >
                {surah.revelation_type === "meccan" ? "Meccan" : "Medinan"}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
