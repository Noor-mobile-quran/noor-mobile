import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../theme/ThemeProvider";

export default function ReadingLog() {
  const currentStreak = useAppStore((s) => s.progress.currentStreak);
  const dailyGoal = useAppStore((s) => s.progress.dailyGoal);
  const streakVisible = useAppStore((s) => s.streakVisible);
  const toggleStreakVisible = useAppStore((s) => s.toggleStreakVisible);
  const { colors } = useTheme();

  if (!streakVisible) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }]}
      accessibilityRole="summary"
      accessibilityLabel={`You have spent time with the Quran ${currentStreak} days this month. Your intention: ${dailyGoal} ayahs.`}
    >
      <Text style={[styles.reflection, { color: colors.textSecondary }]}>
        You've spent time with the Quran{" "}
        <Text style={[styles.reflectionHighlight, { color: colors.textPrimary }]}>
          {currentStreak} {currentStreak === 1 ? "day" : "days"}
        </Text>{" "}
        this month
      </Text>

      <Text style={[styles.intention, { color: colors.textSecondary }]}>
        Your intention: {dailyGoal} ayahs
      </Text>

      <Pressable
        onPress={toggleStreakVisible}
        accessibilityLabel="Hide reading reflection"
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
        style={styles.hideButton}
      >
        <Text style={[styles.hideText, { color: colors.textSecondary }]}>
          Hide
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 6,
  },
  reflection: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  reflectionHighlight: {
    fontFamily: "Inter-SemiBold",
  },
  intention: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    opacity: 0.7,
  },
  hideButton: {
    marginTop: 4,
    minHeight: 44,
    justifyContent: "center",
  },
  hideText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
  },
});
