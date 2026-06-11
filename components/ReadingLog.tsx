import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";

export default function ReadingLog() {
  const dailyGoal = useAppStore((s) => s.progress.dailyGoal);
  const readingReflectionVisible = useAppStore(
    (s) => s.readingReflectionVisible,
  );
  const toggleReadingReflectionVisible = useAppStore(
    (s) => s.toggleReadingReflectionVisible,
  );
  const { colors } = useTheme();

  if (!readingReflectionVisible) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }]}
      accessibilityRole="summary"
      accessibilityLabel={`Welcome back to your Quran reflection. Your intention: ${dailyGoal} ayahs.`}
    >
      <Text style={[styles.reflection, { color: colors.textSecondary }]}>
        Welcome back to your{" "}
        <Text
          style={[styles.reflectionHighlight, { color: colors.textPrimary }]}
        >
          Quran reflection
        </Text>
      </Text>

      <Text style={[styles.intention, { color: colors.textSecondary }]}>
        Gentle intention: {dailyGoal} ayahs
      </Text>

      <Pressable
        onPress={toggleReadingReflectionVisible}
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
    fontFamily: fonts.latin.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  reflectionHighlight: {
    fontFamily: fonts.latin.semiBold,
  },
  intention: {
    fontFamily: fonts.latin.regular,
    fontSize: 12,
    opacity: 0.7,
  },
  hideButton: {
    marginTop: 4,
    minHeight: 44,
    justifyContent: "center",
  },
  hideText: {
    fontFamily: fonts.latin.regular,
    fontSize: 12,
  },
});
