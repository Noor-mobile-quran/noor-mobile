import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSurah } from "../hooks/useQuranData";
import { ArabicText } from "./ui/ArabicText";
import { StarOrnament, OrnamentalDivider } from "./ornaments";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";

export default function DailyAyah() {
  const { colors } = useTheme();
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) /
      86400000,
  );
  const surahNum = (dayOfYear % 114) + 1;
  const { data: surah } = useSurah(surahNum);

  if (!surah) return null;
  const ayah = surah.ayahs[dayOfYear % surah.ayahs.length];

  return (
    <Link href={`/surah/${surahNum}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ayah of the Day from ${surah.name_english}, Ayah ${ayah.number_in_surah}. Tap to read.`}
      >
        <LinearGradient
          colors={["#1B4332", "#143226", "#0D1F18"]}
          className="rounded-2xl overflow-hidden p-8"
        >
          <View className="absolute top-3 left-4 opacity-5">
            <ArabicText
              variant="display"
              decorative
              style={{ color: "#FFF9ED", fontSize: 40, lineHeight: 50 }}
            >
              {"﷽"}
            </ArabicText>
          </View>

          <View className="flex-row items-center gap-1 mb-4">
            <StarOrnament size={10} color="#FFF9ED" opacity={0.6} />
            <Text
              style={{
                color: "rgba(255, 249, 237, 0.6)",
                fontFamily: fonts.latin.regular,
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {" Ayah of the Day "}
            </Text>
            <StarOrnament size={10} color="#FFF9ED" opacity={0.6} />
          </View>

          <ArabicText
            variant="heading"
            style={{ color: "#FFF9ED", textAlign: "right" }}
          >
            {ayah.text_arabic}
          </ArabicText>

          <View className="flex-row items-center gap-3 my-4">
            <View
              className="h-px flex-1"
              style={{ backgroundColor: "rgba(255,249,237,0.1)" }}
            />
            <StarOrnament size={10} color="#FFF9ED" opacity={0.2} />
            <View
              className="h-px flex-1"
              style={{ backgroundColor: "rgba(255,249,237,0.1)" }}
            />
          </View>

          <Text
            style={{
              color: "rgba(255, 249, 237, 0.8)",
              fontFamily: fonts.latin.regular,
              fontSize: 14,
              lineHeight: 22,
              fontStyle: "italic",
            }}
          >
            {ayah.text_translation}
          </Text>

          <Text
            style={{
              color: "rgba(255, 249, 237, 0.5)",
              fontFamily: fonts.latin.regular,
              fontSize: 12,
              marginTop: 16,
            }}
          >
            — {surah.name_english}, Ayah {ayah.number_in_surah}
          </Text>
        </LinearGradient>
      </Pressable>
    </Link>
  );
}
