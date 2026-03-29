import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../theme/ThemeProvider";

const entitiesData = require("../assets/knowledge/entities.json");

interface Entity {
  id: string;
  name_english: string;
  name_arabic: string;
  name_urdu: string;
  type: string;
  description: string;
  mentioned_in: number[];
}

function ChevronRight({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function KnowledgeDiscovery() {
  const { colors } = useTheme();
  const router = useRouter();
  const lastReadSurah = useAppStore((s) => s.progress.lastReadSurah);

  const featured = useMemo<Entity | null>(() => {
    if (!lastReadSurah) return null;

    const entities = entitiesData.entities as Entity[];
    const relevant = entities.filter((e) =>
      e.mentioned_in.includes(lastReadSurah)
    );

    if (relevant.length === 0) return null;

    // Pick the entity with the most surah mentions (most prominent)
    return relevant.reduce((best, curr) =>
      curr.mentioned_in.length > best.mentioned_in.length ? curr : best
    );
  }, [lastReadSurah]);

  return (
    <Pressable
      onPress={() => router.push("/(tabs)/journey")}
      style={[styles.card, { backgroundColor: colors.forest }]}
      accessibilityRole="button"
      accessibilityLabel={
        featured
          ? `Discover ${featured.name_english}. ${featured.description}. Mentioned in ${featured.mentioned_in.length} surahs. Tap to explore.`
          : "Explore 222 Quranic entities. Tap to explore."
      }
    >
      <View style={styles.content}>
        <Text style={styles.label}>Discover</Text>

        {featured ? (
          <>
            <View style={styles.nameRow}>
              <Text style={styles.nameEnglish}>{featured.name_english}</Text>
              <Text
                style={[styles.nameArabic, { color: colors.textGold }]}
                accessibilityLanguage="ar"
              >
                {featured.name_arabic}
              </Text>
            </View>
            <Text style={styles.description} numberOfLines={1}>
              {featured.description}
            </Text>
            <Text style={styles.mention}>
              Mentioned in {featured.mentioned_in.length} surah
              {featured.mentioned_in.length !== 1 ? "s" : ""}
            </Text>
          </>
        ) : (
          <Text style={styles.fallback}>
            Explore 222 Quranic entities {"\u2014"} prophets, angels, places,
            and more
          </Text>
        )}
      </View>

      <View style={styles.chevron}>
        <ChevronRight color="rgba(255, 249, 237, 0.6)" size={20} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    minHeight: 44,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontFamily: "Inter-Medium",
    fontSize: 11,
    color: "rgba(255, 249, 237, 0.6)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    flexWrap: "wrap",
  },
  nameEnglish: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF9ED",
  },
  nameArabic: {
    fontFamily: "Amiri-Regular",
    fontSize: 14,
    writingDirection: "rtl",
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "rgba(255, 249, 237, 0.8)",
  },
  mention: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "rgba(255, 249, 237, 0.5)",
    marginTop: 2,
  },
  fallback: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(255, 249, 237, 0.85)",
    lineHeight: 20,
  },
  chevron: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
