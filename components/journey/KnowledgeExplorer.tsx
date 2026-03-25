import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  AccessibilityInfo,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { useTheme } from "../../theme/ThemeProvider";

const entities = require("../../assets/knowledge/entities.json");
const themes = require("../../assets/knowledge/themes.json");
const narratives = require("../../assets/knowledge/narratives.json");

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CategoryKey =
  | "all"
  | "prophet"
  | "angel"
  | "place"
  | "theme"
  | "event"
  | "ruling"
  | "divine_attribute"
  | "narrative";

interface Category {
  key: CategoryKey;
  label: string;
}

const CATEGORIES: Category[] = [
  { key: "all", label: "All" },
  { key: "prophet", label: "Prophets" },
  { key: "angel", label: "Angels" },
  { key: "place", label: "Places" },
  { key: "theme", label: "Themes" },
  { key: "event", label: "Events" },
  { key: "ruling", label: "Rulings" },
  { key: "divine_attribute", label: "Divine Attributes" },
  { key: "narrative", label: "Narratives" },
];

function SearchIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={11}
        cy={11}
        r={7}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Line
        x1={16.5}
        y1={16.5}
        x2={21}
        y2={21}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ChevronIcon({
  color,
  expanded,
}: {
  color: string;
  expanded: boolean;
}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d={expanded ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function formatTypeBadge(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function configureExpandAnimation() {
  try {
    if (Platform.OS !== "web") {
      AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
        if (!reduceMotion) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
      });
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  } catch {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }
}

export default function KnowledgeExplorer() {
  const { colors } = useTheme();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (activeCategory === "narrative") {
      const narrs = narratives.narratives as Array<{
        id: string;
        title_english: string;
        title_arabic: string;
        title_urdu: string;
        description: string;
        surah_sequence: Array<{
          surah: number;
          ayah_range: number[];
          summary: string;
        }>;
      }>;
      if (!query) return narrs;
      return narrs.filter(
        (n) =>
          n.title_english.toLowerCase().includes(query) ||
          n.title_arabic.includes(query) ||
          n.title_urdu.includes(query)
      );
    }

    if (activeCategory === "theme") {
      const thms = themes.themes as Array<{
        id: string;
        name_english: string;
        name_arabic: string;
        name_urdu: string;
        description: string;
        ayahs: Array<{ surah: number; ayah: number; key_phrase: string }>;
        related_themes: string[];
      }>;
      if (!query) return thms;
      return thms.filter(
        (t) =>
          t.name_english.toLowerCase().includes(query) ||
          t.name_arabic.includes(query) ||
          t.name_urdu.includes(query)
      );
    }

    let items = entities.entities as Array<{
      id: string;
      name_english: string;
      name_arabic: string;
      name_urdu: string;
      type: string;
      description: string;
      mentioned_in: number[];
    }>;

    if (activeCategory !== "all") {
      items = items.filter((e) => e.type === activeCategory);
    }

    if (query) {
      items = items.filter(
        (e) =>
          e.name_english.toLowerCase().includes(query) ||
          e.name_arabic.includes(query) ||
          e.name_urdu.includes(query)
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  const handleToggleExpand = useCallback((id: string) => {
    configureExpandAnimation();
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleCategoryPress = useCallback((key: CategoryKey) => {
    setActiveCategory(key);
    setExpandedId(null);
  }, []);

  const renderEntityCard = useCallback(
    ({ item }: { item: any }) => {
      if (activeCategory === "narrative") {
        return (
          <NarrativeCard
            item={item}
            colors={colors}
            expanded={expandedId === item.id}
            onToggle={() => handleToggleExpand(item.id)}
            onSurahPress={(surahNum: number) =>
              router.push(`/surah/${surahNum}`)
            }
          />
        );
      }

      if (activeCategory === "theme") {
        return (
          <ThemeCard
            item={item}
            colors={colors}
            expanded={expandedId === item.id}
            onToggle={() => handleToggleExpand(item.id)}
            onSurahPress={(surahNum: number) =>
              router.push(`/surah/${surahNum}`)
            }
          />
        );
      }

      return (
        <EntityCard
          item={item}
          colors={colors}
          expanded={expandedId === item.id}
          onToggle={() => handleToggleExpand(item.id)}
          onSurahPress={(surahNum: number) =>
            router.push(`/surah/${surahNum}`)
          }
        />
      );
    },
    [activeCategory, colors, expandedId, handleToggleExpand, router]
  );

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={styles.headerTitle}
          accessibilityRole="header"
          {...({ "aria-level": 2 } as any)}
        >
          Explore the Quran
        </Text>
        <SearchIcon color={colors.textSecondary} size={22} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryBar}
        contentContainerStyle={styles.categoryBarContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => handleCategoryPress(cat.key)}
            style={[
              styles.categoryChip,
              activeCategory === cat.key
                ? styles.categoryChipActive
                : styles.categoryChipInactive,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: activeCategory === cat.key }}
            accessibilityLabel={`Filter by ${cat.label}`}
          >
            <Text
              style={[
                styles.categoryChipText,
                activeCategory === cat.key
                  ? styles.categoryChipTextActive
                  : styles.categoryChipTextInactive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.searchContainer}>
        <View style={styles.searchIconWrapper}>
          <SearchIcon color={colors.textSecondary} size={18} />
        </View>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name (English, Arabic, or Urdu)"
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search entities by name"
          accessibilityRole="search"
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item: any) => item.id}
        renderItem={renderEntityCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No results found</Text>
          </View>
        }
      />
    </View>
  );
}

function EntityCard({
  item,
  colors,
  expanded,
  onToggle,
  onSurahPress,
}: {
  item: {
    id: string;
    name_english: string;
    name_arabic: string;
    name_urdu: string;
    type: string;
    description: string;
    mentioned_in: number[];
  };
  colors: any;
  expanded: boolean;
  onToggle: () => void;
  onSurahPress: (surah: number) => void;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={styles.card}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`${item.name_english}, ${formatTypeBadge(item.type)}`}
      accessibilityHint={
        expanded ? "Tap to collapse" : "Tap to expand details"
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardNames}>
          <View style={styles.nameRow}>
            <Text style={styles.nameEnglish}>{item.name_english}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {formatTypeBadge(item.type)}
              </Text>
            </View>
          </View>
          <View style={styles.arabicUrduRow}>
            <Text
              style={styles.nameArabic}
              accessibilityLanguage="ar"
              {...({ dir: "rtl" } as any)}
            >
              {item.name_arabic}
            </Text>
            <Text
              style={styles.nameUrdu}
              accessibilityLanguage="ur"
              {...({ dir: "rtl" } as any)}
            >
              {item.name_urdu}
            </Text>
          </View>
        </View>
        <ChevronIcon color={colors.textSecondary} expanded={expanded} />
      </View>

      {!expanded && (
        <Text style={styles.descriptionTruncated} numberOfLines={1}>
          {item.description}
        </Text>
      )}

      <Text style={styles.mentionCount}>
        Mentioned in {item.mentioned_in.length} surah
        {item.mentioned_in.length !== 1 ? "s" : ""}
      </Text>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.descriptionFull}>{item.description}</Text>
          <Text style={styles.surahListLabel}>Mentioned in:</Text>
          <View style={styles.surahChipsContainer}>
            {item.mentioned_in.map((surahNum) => (
              <TouchableOpacity
                key={surahNum}
                onPress={() => onSurahPress(surahNum)}
                style={styles.surahChip}
                accessibilityRole="link"
                accessibilityLabel={`Go to Surah ${surahNum}`}
              >
                <Text style={styles.surahChipText}>Surah {surahNum}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

function ThemeCard({
  item,
  colors,
  expanded,
  onToggle,
  onSurahPress,
}: {
  item: {
    id: string;
    name_english: string;
    name_arabic: string;
    name_urdu: string;
    description: string;
    ayahs: Array<{ surah: number; ayah: number; key_phrase: string }>;
    related_themes: string[];
  };
  colors: any;
  expanded: boolean;
  onToggle: () => void;
  onSurahPress: (surah: number) => void;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={styles.card}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`Theme: ${item.name_english}`}
      accessibilityHint={
        expanded ? "Tap to collapse" : "Tap to expand details"
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardNames}>
          <View style={styles.nameRow}>
            <Text style={styles.nameEnglish}>{item.name_english}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>Theme</Text>
            </View>
          </View>
          <View style={styles.arabicUrduRow}>
            <Text
              style={styles.nameArabic}
              accessibilityLanguage="ar"
              {...({ dir: "rtl" } as any)}
            >
              {item.name_arabic}
            </Text>
            <Text
              style={styles.nameUrdu}
              accessibilityLanguage="ur"
              {...({ dir: "rtl" } as any)}
            >
              {item.name_urdu}
            </Text>
          </View>
        </View>
        <ChevronIcon color={colors.textSecondary} expanded={expanded} />
      </View>

      {!expanded && (
        <Text style={styles.descriptionTruncated} numberOfLines={1}>
          {item.description}
        </Text>
      )}

      <Text style={styles.mentionCount}>
        {item.ayahs.length} key ayah{item.ayahs.length !== 1 ? "s" : ""}
      </Text>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.descriptionFull}>{item.description}</Text>
          <Text style={styles.surahListLabel}>Key Ayahs:</Text>
          <View style={styles.surahChipsContainer}>
            {item.ayahs.map((ayah, idx) => (
              <TouchableOpacity
                key={`${ayah.surah}-${ayah.ayah}-${idx}`}
                onPress={() => onSurahPress(ayah.surah)}
                style={styles.surahChip}
                accessibilityRole="link"
                accessibilityLabel={`Surah ${ayah.surah}, Ayah ${ayah.ayah}: ${ayah.key_phrase}`}
              >
                <Text style={styles.surahChipText}>
                  {ayah.surah}:{ayah.ayah}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

function NarrativeCard({
  item,
  colors,
  expanded,
  onToggle,
  onSurahPress,
}: {
  item: {
    id: string;
    title_english: string;
    title_arabic: string;
    title_urdu: string;
    description: string;
    surah_sequence: Array<{
      surah: number;
      ayah_range: number[];
      summary: string;
    }>;
  };
  colors: any;
  expanded: boolean;
  onToggle: () => void;
  onSurahPress: (surah: number) => void;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={styles.card}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`Narrative: ${item.title_english}`}
      accessibilityHint={
        expanded ? "Tap to collapse" : "Tap to expand timeline"
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardNames}>
          <View style={styles.nameRow}>
            <Text style={styles.nameEnglish}>{item.title_english}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>Narrative</Text>
            </View>
          </View>
          <View style={styles.arabicUrduRow}>
            <Text
              style={styles.nameArabic}
              accessibilityLanguage="ar"
              {...({ dir: "rtl" } as any)}
            >
              {item.title_arabic}
            </Text>
            <Text
              style={styles.nameUrdu}
              accessibilityLanguage="ur"
              {...({ dir: "rtl" } as any)}
            >
              {item.title_urdu}
            </Text>
          </View>
        </View>
        <ChevronIcon color={colors.textSecondary} expanded={expanded} />
      </View>

      {!expanded && (
        <Text style={styles.descriptionTruncated} numberOfLines={1}>
          {item.description}
        </Text>
      )}

      <Text style={styles.mentionCount}>
        {item.surah_sequence.length} surah
        {item.surah_sequence.length !== 1 ? "s" : ""} in sequence
      </Text>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.descriptionFull}>{item.description}</Text>
          <Text style={styles.surahListLabel}>Surah Sequence:</Text>
          <View style={styles.timelineContainer}>
            {item.surah_sequence.map((step, idx) => (
              <View key={`${step.surah}-${idx}`} style={styles.timelineStep}>
                <View style={styles.timelineTrack}>
                  <Svg width={24} height="100%">
                    {idx > 0 && (
                      <Line
                        x1={12}
                        y1={0}
                        x2={12}
                        y2={12}
                        stroke={colors.gold}
                        strokeWidth={2}
                      />
                    )}
                    <Circle
                      cx={12}
                      cy={12}
                      r={5}
                      fill={colors.gold}
                      stroke={colors.surface}
                      strokeWidth={2}
                    />
                    {idx < item.surah_sequence.length - 1 && (
                      <Line
                        x1={12}
                        y1={12}
                        x2={12}
                        y2={100}
                        stroke={colors.gold}
                        strokeWidth={2}
                      />
                    )}
                  </Svg>
                </View>
                <TouchableOpacity
                  style={styles.timelineContent}
                  onPress={() => onSurahPress(step.surah)}
                  accessibilityRole="link"
                  accessibilityLabel={`Surah ${step.surah}, ayahs ${step.ayah_range[0]} to ${step.ayah_range[1]}: ${step.summary}`}
                >
                  <Text style={styles.timelineSurahNum}>
                    Surah {step.surah}:{step.ayah_range[0]}-
                    {step.ayah_range[1]}
                  </Text>
                  <Text style={styles.timelineSummary}>{step.summary}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    headerTitle: {
      fontFamily: "Inter-SemiBold",
      fontSize: 22,
      color: colors.textPrimary,
    },
    categoryBar: {
      flexShrink: 0,
      height: 48,
    },
    categoryBarContent: {
      paddingHorizontal: 16,
      alignItems: "center",
      gap: 8,
    },
    categoryChip: {
      paddingHorizontal: 14,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    categoryChipActive: {
      backgroundColor: colors.accent,
    },
    categoryChipInactive: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: "transparent",
    },
    categoryChipText: {
      fontFamily: "Inter-Medium",
      fontSize: 12,
    },
    categoryChipTextActive: {
      color: colors.bg,
    },
    categoryChipTextInactive: {
      color: colors.textSecondary,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
      marginTop: 4,
      marginBottom: 12,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
    },
    searchIconWrapper: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontFamily: "Inter-Regular",
      fontSize: 15,
      color: colors.textPrimary,
      paddingVertical: 12,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    cardNames: {
      flex: 1,
      marginRight: 12,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
    },
    nameEnglish: {
      fontFamily: "Inter-SemiBold",
      fontSize: 16,
      color: colors.textPrimary,
    },
    arabicUrduRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 4,
    },
    nameArabic: {
      fontFamily: "Amiri-Regular",
      fontSize: 18,
      color: colors.textPrimary,
      writingDirection: "rtl",
    },
    nameUrdu: {
      fontFamily: "Amiri-Regular",
      fontSize: 16,
      color: colors.textSecondary,
      writingDirection: "rtl",
    },
    typeBadge: {
      backgroundColor: colors.gold,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    typeBadgeText: {
      fontFamily: "Inter-Medium",
      fontSize: 11,
      color: "#FFFFFF",
      textTransform: "capitalize",
    },
    descriptionTruncated: {
      fontFamily: "Inter-Regular",
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
    },
    mentionCount: {
      fontFamily: "Inter-Regular",
      fontSize: 13,
      color: colors.gold,
      marginTop: 6,
    },
    expandedContent: {
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    descriptionFull: {
      fontFamily: "Inter-Regular",
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 22,
    },
    surahListLabel: {
      fontFamily: "Inter-SemiBold",
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 12,
      marginBottom: 8,
    },
    surahChipsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    surahChip: {
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.gold,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      minHeight: 44,
      justifyContent: "center",
    },
    surahChipText: {
      fontFamily: "Inter-Medium",
      fontSize: 13,
      color: colors.gold,
    },
    emptyContainer: {
      paddingVertical: 40,
      alignItems: "center",
    },
    emptyText: {
      fontFamily: "Inter-Regular",
      fontSize: 15,
      color: colors.textSecondary,
    },
    timelineContainer: {
      marginTop: 4,
    },
    timelineStep: {
      flexDirection: "row",
      minHeight: 56,
    },
    timelineTrack: {
      width: 24,
      alignItems: "center",
    },
    timelineContent: {
      flex: 1,
      paddingLeft: 8,
      paddingBottom: 16,
      minHeight: 44,
      justifyContent: "center",
    },
    timelineSurahNum: {
      fontFamily: "Inter-SemiBold",
      fontSize: 13,
      color: colors.gold,
    },
    timelineSummary: {
      fontFamily: "Inter-Regular",
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 19,
    },
  });
}
