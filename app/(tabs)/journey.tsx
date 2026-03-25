import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeProvider";
import { fonts } from "../../theme/typography";
import { OrnamentalDivider } from "../../components/ornaments";
import {
  SurahCompletionTracker,
  JuzMap,
  BookmarksCollection,
  KnowledgeExplorer,
} from "../../components/journey";

type Section = "completion" | "juz" | "bookmarks" | "explore";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "completion", label: "Completion" },
  { key: "juz", label: "Juz Map" },
  { key: "bookmarks", label: "Bookmarks" },
  { key: "explore", label: "Explore" },
];

export default function JourneyPage() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState<Section>("completion");

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.latin.bold }]}>
          Your Journey
        </Text>
      </View>

      {/* Section tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {SECTIONS.map((section) => (
          <Pressable
            key={section.key}
            onPress={() => setActiveSection(section.key)}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeSection === section.key ? colors.accent : "transparent",
                borderColor:
                  activeSection === section.key ? colors.accent : colors.border,
              },
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeSection === section.key }}
            accessibilityLabel={section.label}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeSection === section.key ? colors.bg : colors.textSecondary,
                  fontFamily: fonts.latin.medium,
                },
              ]}
            >
              {section.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <OrnamentalDivider />

      {/* Active section content */}
      <View style={styles.content}>
        {activeSection === "completion" && <SurahCompletionTracker />}
        {activeSection === "juz" && <JuzMap />}
        {activeSection === "bookmarks" && <BookmarksCollection />}
        {activeSection === "explore" && <KnowledgeExplorer />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
  },
  tabs: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: "center",
  },
  tabText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
});
