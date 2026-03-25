import { View, Text, StyleSheet } from "react-native";
import { ArabicText } from "./ui/ArabicText";
import { useTheme } from "../theme/ThemeProvider";
import { useI18n } from "../hooks/useI18n";

interface Props {
  hijriDate?: string;
}

export default function IslamicGreeting({ hijriDate }: Props) {
  const { colors } = useTheme();
  const { t, isUrdu } = useI18n();
  const hour = new Date().getHours();

  let greetingArabic: string;
  let greetingKey: string;

  if (hour >= 4 && hour < 12) {
    greetingArabic = "\u0635\u0628\u0627\u062D \u0627\u0644\u062E\u064A\u0631";
    greetingKey = "goodMorning";
  } else if (hour >= 12 && hour < 17) {
    greetingArabic = "\u0645\u0633\u0627\u0621 \u0627\u0644\u0646\u0648\u0631";
    greetingKey = "goodAfternoon";
  } else if (hour >= 17 && hour < 21) {
    greetingArabic = "\u0645\u0633\u0627\u0621 \u0627\u0644\u062E\u064A\u0631";
    greetingKey = "goodEvening";
  } else {
    greetingArabic = "\u062A\u0635\u0628\u062D \u0639\u0644\u0649 \u062E\u064A\u0631";
    greetingKey = "goodNight";
  }

  const greetingLabel = t(greetingKey);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ArabicText
          variant="body"
          style={{ fontSize: 16, lineHeight: 24, color: colors.gold }}
        >
          {greetingArabic}
        </ArabicText>
        <Text
          style={[
            styles.label,
            {
              color: "rgba(255, 249, 237, 0.7)",
              fontFamily: isUrdu ? "Amiri-Regular" : "Inter-Regular",
              ...(isUrdu && { writingDirection: "rtl" as const }),
            },
          ]}
          {...(isUrdu ? { accessibilityLanguage: "ur" } : {})}
        >
          {greetingLabel}
        </Text>
      </View>
      {hijriDate && (
        <Text style={styles.hijri}>
          {hijriDate}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  arabic: {
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontSize: 13,
  },
  hijri: {
    color: "rgba(255, 232, 184, 0.5)",
    fontFamily: "Inter-Regular",
    fontSize: 11,
  },
});
