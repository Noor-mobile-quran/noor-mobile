import { View, Text, ScrollView, Pressable } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeProvider";
import { Crescent, StarOrnament, FlowerOrnament, OrnamentalDivider } from "../../components/ornaments";
import { ArabicText } from "../../components/ui/ArabicText";
import IslamicGreeting from "../../components/IslamicGreeting";
import ReadingLog from "../../components/ReadingLog";
import DailyAyah from "../../components/DailyAyah";
import ContinueReading from "../../components/ContinueReading";
import QuickDua from "../../components/QuickDua";
import KnowledgeDiscovery from "../../components/KnowledgeDiscovery";
import NarrativeOfDay from "../../components/NarrativeOfDay";

function getApproxHijriDate(): string {
  // Kuwaiti algorithm for tabular Islamic calendar
  const today = new Date();
  const jd = Math.floor((1461 * (today.getFullYear() + 4800 + Math.floor((today.getMonth() + 1 - 14) / 12))) / 4)
    + Math.floor((367 * (today.getMonth() + 1 - 2 - 12 * Math.floor((today.getMonth() + 1 - 14) / 12))) / 12)
    - Math.floor((3 * Math.floor((today.getFullYear() + 4900 + Math.floor((today.getMonth() + 1 - 14) / 12)) / 100)) / 4)
    + today.getDate() - 32075;

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719)
    + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hijriMonth = Math.floor((24 * l3) / 709);
  const hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  const months = [
    "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
    "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhul Qi'dah", "Dhul Hijjah",
  ];
  return `${hijriDay} ${months[Math.min(11, Math.max(0, hijriMonth - 1))]} ${hijriYear} AH`;
}

export default function HomePage() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const hijriDate = getApproxHijriDate();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section — compact */}
      <LinearGradient
        colors={isDark ? [colors.surface, colors.bg] : ["#4A3F30", colors.textPrimary]}
        className="px-6 pb-6 items-center overflow-hidden rounded-b-3xl"
        style={{ paddingTop: insets.top + 12 }}
      >
        {/* Decorative crescent */}
        <View className="absolute top-4 right-6">
          <Crescent size={56} color={colors.accent} opacity={0.15} />
        </View>

        {/* Mosque silhouette decoration */}
        <View className="absolute bottom-0 left-0 right-0 h-12 opacity-5 flex-row justify-center items-end gap-8">
          <View className="w-1 h-10 rounded-t-full" style={{ backgroundColor: "#FFF9ED" }} />
          <View className="w-16 h-6 rounded-t-full" style={{ backgroundColor: "#FFF9ED" }} />
          <View className="w-1 h-8 rounded-t-full" style={{ backgroundColor: "#FFF9ED" }} />
          <View className="w-12 h-8 rounded-t-full" style={{ backgroundColor: "#FFF9ED" }} />
          <View className="w-1 h-10 rounded-t-full" style={{ backgroundColor: "#FFF9ED" }} />
        </View>

        <ArabicText
          variant="display"
          bold
          style={{ color: colors.textGold, textAlign: "center", fontSize: 36, lineHeight: 48 }}
        >
          {"\u0646\u0648\u0631"}
        </ArabicText>

        <Text
          style={{
            color: "#FFF9ED",
            fontFamily: "Inter-SemiBold",
            fontSize: 20,
            marginTop: 2,
          }}
        >
          Noor
        </Text>

        {/* 1. Islamic Greeting — compact single row with Hijri date */}
        <View className="mt-3">
          <IslamicGreeting hijriDate={hijriDate} />
        </View>

        {/* Ornamental line */}
        <View className="flex-row items-center justify-center gap-3 mt-4">
          <View className="h-px w-12" style={{ backgroundColor: "rgba(212, 168, 67, 0.3)" }} />
          <StarOrnament size={12} color={colors.accent} opacity={0.5} />
          <View className="h-px w-12" style={{ backgroundColor: "rgba(212, 168, 67, 0.3)" }} />
        </View>
      </LinearGradient>

      {/* Content — reordered */}
      <View className="px-4 mt-6 gap-5">
        {/* 2. Continue Reading — HERO position with gold accent border */}
        <View
          style={{
            borderWidth: 1.5,
            borderColor: `${colors.accent}40`,
            borderRadius: 20,
            padding: 2,
          }}
        >
          <ContinueReading />
        </View>

        {/* 3. Divider */}
        <OrnamentalDivider />

        {/* 4. Daily Ayah */}
        <DailyAyah />

        {/* 5. Divider */}
        <OrnamentalDivider />

        {/* 6. Knowledge Discovery — contextual entity card */}
        <KnowledgeDiscovery />

        {/* 7. Story of the Day — rotating narrative arc */}
        <NarrativeOfDay />

        {/* 8. Divider */}
        <OrnamentalDivider />

        {/* 8. Quick Dua — compact */}
        <QuickDua />

        {/* Browse All Surahs button */}
        <Link href="/surahs" asChild>
          <Pressable
            className="p-4 rounded-xl items-center"
            style={{
              backgroundColor: colors.accent,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
              }}
            >
              Browse All Surahs
            </Text>
          </Pressable>
        </Link>

        {/* 7. Streak Counter — BOTTOM, subtle reflection */}
        <ReadingLog />

        {/* Footer decoration */}
        <View className="items-center py-4">
          <View className="flex-row items-center gap-2">
            <StarOrnament size={10} color={colors.textSecondary} opacity={0.4} />
            <ArabicText
              decorative
              style={{
                color: colors.textSecondary,
                opacity: 0.4,
                fontSize: 14,
                lineHeight: 20,
                textAlign: "center",
              }}
            >
              {"\u0628\u0633\u0645 \u0627\u0644\u0644\u0647"}
            </ArabicText>
            <StarOrnament size={10} color={colors.textSecondary} opacity={0.4} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
