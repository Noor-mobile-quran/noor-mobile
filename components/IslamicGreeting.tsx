import { View, Text } from "react-native";
import { ArabicText } from "./ui/ArabicText";
import { useTheme } from "../theme/ThemeProvider";

export default function IslamicGreeting() {
  const { colors } = useTheme();
  const hour = new Date().getHours();

  let greeting: { arabic: string; english: string };

  if (hour >= 4 && hour < 12) {
    greeting = { arabic: "صباح الخير", english: "Good Morning" };
  } else if (hour >= 12 && hour < 17) {
    greeting = { arabic: "مساء النور", english: "Good Afternoon" };
  } else if (hour >= 17 && hour < 21) {
    greeting = { arabic: "مساء الخير", english: "Good Evening" };
  } else {
    greeting = { arabic: "تصبح على خير", english: "Good Night" };
  }

  return (
    <View className="items-center">
      <ArabicText
        variant="body"
        style={{ color: colors.gold, textAlign: "center", fontSize: 18, lineHeight: 28 }}
      >
        {greeting.arabic}
      </ArabicText>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: "Inter-Regular",
          fontSize: 12,
          marginTop: 2,
        }}
      >
        {greeting.english}
      </Text>
    </View>
  );
}
