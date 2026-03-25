import { View, Text } from "react-native";
import { ArabicText } from "./ui/ArabicText";
import { useTheme } from "../theme/ThemeProvider";
import { useI18n } from "../hooks/useI18n";

export default function IslamicGreeting() {
  const { colors } = useTheme();
  const { t, isUrdu } = useI18n();
  const hour = new Date().getHours();

  let greetingArabic: string;
  let greetingKey: string;

  if (hour >= 4 && hour < 12) {
    greetingArabic = "صباح الخير";
    greetingKey = "goodMorning";
  } else if (hour >= 12 && hour < 17) {
    greetingArabic = "مساء النور";
    greetingKey = "goodAfternoon";
  } else if (hour >= 17 && hour < 21) {
    greetingArabic = "مساء الخير";
    greetingKey = "goodEvening";
  } else {
    greetingArabic = "تصبح على خير";
    greetingKey = "goodNight";
  }

  const greetingLabel = t(greetingKey);

  return (
    <View className="items-center">
      <ArabicText
        variant="body"
        style={{ color: colors.gold, textAlign: "center", fontSize: 18, lineHeight: 28 }}
      >
        {greetingArabic}
      </ArabicText>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: isUrdu ? "Amiri_400Regular" : "Inter-Regular",
          fontSize: 12,
          marginTop: 2,
          ...(isUrdu && { writingDirection: "rtl" as const, textAlign: "right" as const }),
        }}
        {...(isUrdu && { accessibilityLanguage: "ur" })}
      >
        {greetingLabel}
      </Text>
    </View>
  );
}
