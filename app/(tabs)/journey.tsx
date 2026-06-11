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

const SECTIONS: { key: Section; label: string; desc: string }[] = [
  {
    key: "completion",
    label: "Completion",
    desc: "Track your progress through all 114 surahs",
  },
  {
    key: "juz",
    label: "Juz Map",
    desc: "30 parts of the Quran \u2014 read 1 per day",
  },
  {
    key: "bookmarks",
    label: "Bookmarks",
    desc: "Ayahs you\u2019ve saved for reflection",
  },
  {
    key: "explore",
    label: "Explore",
    desc: "Discover prophets, themes, and stories across the Quran",
  },
];

export default function JourneyPage() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState<Section>("completion");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg, paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontFamily: fonts.latin.bold },
          ]}
        >
          Your Journey
        </Text>
      </View>

      {/* Section tabs — fixed height pill bar */}
      <View style={styles.tabBar}>
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
                    activeSection === section.key
                      ? colors.accent
                      : "transparent",
                  borderColor:
                    activeSection === section.key
                      ? colors.accent
                      : colors.border,
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
                      activeSection === section.key
                        ? colors.bg
                        : colors.textSecondary,
                    fontFamily: fonts.latin.medium,
                  },
                ]}
              >
                {section.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Section description */}
      <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
        {SECTIONS.find((s) => s.key === activeSection)?.desc}
      </Text>

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
  tabBar: {
    flexShrink: 0,
  },
  tabs: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: "center",
  },
  tab: {
    paddingHorizontal: 18,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 13,
    lineHeight: 16,
  },
  sectionDesc: {
    fontFamily: fonts.latin.regular,
    fontSize: 11,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 2,
  },
  content: {
    flex: 1,
  },
});
