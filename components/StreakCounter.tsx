import { View, Text } from "react-native";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../theme/ThemeProvider";
import { Crescent } from "./ornaments";

export default function StreakCounter() {
  const { currentStreak, longestStreak, dailyGoal } = useAppStore((s) => s.progress);
  const { colors } = useTheme();

  return (
    <View
      className="p-6 rounded-2xl items-center overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="absolute top-2 right-3">
        <Crescent size={40} color={colors.gold} opacity={0.1} />
      </View>

      <Text
        style={{
          fontSize: 48,
          fontFamily: "Inter-Bold",
          color: colors.gold,
        }}
      >
        {currentStreak}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter-Medium",
          color: colors.textSecondary,
          marginTop: 4,
        }}
      >
        Day Streak
      </Text>

      <View className="flex-row justify-center gap-6 mt-4">
        <View className="items-center">
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter-SemiBold",
              color: colors.textPrimary,
            }}
          >
            {longestStreak}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter-Regular",
              color: colors.textSecondary,
            }}
          >
            Best
          </Text>
        </View>

        <View style={{ width: 1, backgroundColor: colors.border }} />

        <View className="items-center">
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter-SemiBold",
              color: colors.textPrimary,
            }}
          >
            {dailyGoal}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter-Regular",
              color: colors.textSecondary,
            }}
          >
            Daily Goal
          </Text>
        </View>
      </View>
    </View>
  );
}
