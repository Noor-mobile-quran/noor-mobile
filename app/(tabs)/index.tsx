import { View, Text, ScrollView, Pressable } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeProvider";
import { Crescent, StarOrnament, FlowerOrnament, OrnamentalDivider } from "../../components/ornaments";
import { ArabicText } from "../../components/ui/ArabicText";
import IslamicGreeting from "../../components/IslamicGreeting";
import StreakCounter from "../../components/StreakCounter";
import DailyAyah from "../../components/DailyAyah";
import ContinueReading from "../../components/ContinueReading";
import QuickDua from "../../components/QuickDua";

function getApproxHijriDate(): string {
  const gregorian = new Date();
  const epochDiff = 227015;
  const daysSinceGregorianEpoch = Math.floor(gregorian.getTime() / 86400000) + 719528;
  const hijriDays = daysSinceGregorianEpoch - epochDiff;
  const hijriYear = Math.floor((30 * hijriDays + 10646) / 10631);
  const monthDays = hijriDays - Math.floor((10631 * hijriYear - 10617) / 30);
  const hijriMonth = Math.min(12, Math.ceil((monthDays + 0.5) * 30 / 325.62));
  const hijriDay = monthDays - Math.floor((325.62 * (hijriMonth - 1)) / 30) + 1;
  const months = [
    "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
    "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhul Qi'dah", "Dhul Hijjah",
  ];
  return `${Math.max(1, Math.round(hijriDay))} ${months[Math.min(11, Math.max(0, hijriMonth - 1))]} ${hijriYear} AH`;
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
        colors={isDark ? ["#2D261C", "#1A1410"] : ["#4A3F30", "#2D261C"]}
        className="px-6 pb-6 items-center overflow-hidden rounded-b-3xl"
        style={{ paddingTop: insets.top + 12 }}
      >
        {/* Decorative crescent */}
        <View className="absolute top-4 right-6">
          <Crescent size={56} color={colors.gold} opacity={0.15} />
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
          style={{ color: colors.gold, textAlign: "center", fontSize: 36, lineHeight: 48 }}
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
          <StarOrnament size={12} color={colors.gold} opacity={0.5} />
          <View className="h-px w-12" style={{ backgroundColor: "rgba(212, 168, 67, 0.3)" }} />
        </View>
      </LinearGradient>

      {/* Content — reordered */}
      <View className="px-4 mt-6 gap-5">
        {/* 2. Continue Reading — HERO position with gold accent border */}
        <View
          style={{
            borderWidth: 1.5,
            borderColor: `${colors.gold}40`,
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

        {/* 6. Quick Dua — compact */}
        <QuickDua />

        {/* Browse All Surahs button */}
        <Link href="/surahs" asChild>
          <Pressable
            className="p-4 rounded-xl items-center"
            style={{
              backgroundColor: colors.gold,
              shadowColor: colors.gold,
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
        <StreakCounter />

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
