import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { fonts } from "../../theme/typography";
import surahIndex from "../../assets/data/surah-index.json";
import hyperedgesData from "../../assets/knowledge/hyperedges.json";

interface CrossReferencesProps {
  surah: number;
  ayah: number;
  onReferencePress?: (surah: number, ayah: number) => void;
}

interface Hyperedge {
  id: string;
  type: string;
  label: string;
  grounding_ayahs: string[];
  weight: number;
  description?: string;
}

interface ReferenceItem {
  surahNumber: number;
  ayahRange: string;
  surahNameArabic: string;
  surahNameEnglish: string;
  hyperedgeLabel: string;
  hyperedgeType: string;
  weight: number;
}

interface NarrativeInfo {
  label: string;
  sceneIndex: number;
  totalScenes: number;
}

function parseAyahRef(
  ref: string,
): { surah: number; start: number; end: number } | null {
  const match = ref.match(/^(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;
  return {
    surah: parseInt(match[1], 10),
    start: parseInt(match[2], 10),
    end: match[3] ? parseInt(match[3], 10) : parseInt(match[2], 10),
  };
}

function ayahMatchesRef(surah: number, ayah: number, ref: string): boolean {
  const parsed = parseAyahRef(ref);
  if (!parsed) return false;
  return parsed.surah === surah && ayah >= parsed.start && ayah <= parsed.end;
}

function getSurahMeta(num: number) {
  return (
    surahIndex as {
      number: number;
      name_arabic: string;
      name_english: string;
    }[]
  ).find((s) => s.number === num);
}

const TYPE_LABELS: Record<string, string> = {
  relational_fact: "Relational Fact",
  narrative_arc: "Narrative Arc",
  legal_ruling: "Legal Ruling",
};

export function CrossReferences({
  surah,
  ayah,
  onReferencePress,
}: CrossReferencesProps) {
  const { colors } = useTheme();
  const hyperedges = (hyperedgesData as { hyperedges: Hyperedge[] }).hyperedges;

  const { references, narrative } = useMemo(() => {
    const matchingEdges: Hyperedge[] = [];
    for (const he of hyperedges) {
      for (const ref of he.grounding_ayahs) {
        if (ayahMatchesRef(surah, ayah, ref)) {
          matchingEdges.push(he);
          break;
        }
      }
    }

    // Find narrative arc info
    let narrativeInfo: NarrativeInfo | null = null;
    for (const he of matchingEdges) {
      if (he.type === "narrative_arc") {
        const totalScenes = he.grounding_ayahs.length;
        let sceneIndex = 0;
        for (let i = 0; i < he.grounding_ayahs.length; i++) {
          if (ayahMatchesRef(surah, ayah, he.grounding_ayahs[i])) {
            sceneIndex = i + 1;
            break;
          }
        }
        narrativeInfo = {
          label: he.label,
          sceneIndex,
          totalScenes,
        };
        break;
      }
    }

    // Collect cross-references (other ayahs from matching hyperedges)
    const refs: ReferenceItem[] = [];
    const seen = new Set<string>();

    for (const he of matchingEdges) {
      for (const ref of he.grounding_ayahs) {
        if (ayahMatchesRef(surah, ayah, ref)) continue;
        if (seen.has(`${ref}:${he.id}`)) continue;
        seen.add(`${ref}:${he.id}`);

        const parsed = parseAyahRef(ref);
        if (!parsed) continue;
        const meta = getSurahMeta(parsed.surah);
        if (!meta) continue;

        refs.push({
          surahNumber: parsed.surah,
          ayahRange: ref,
          surahNameArabic: meta.name_arabic,
          surahNameEnglish: meta.name_english,
          hyperedgeLabel: he.label,
          hyperedgeType: he.type,
          weight: he.weight,
        });
      }
    }

    refs.sort((a, b) => b.weight - a.weight);
    return { references: refs.slice(0, 8), narrative: narrativeInfo };
  }, [surah, ayah, hyperedges]);

  if (references.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[
            styles.emptyText,
            { color: colors.textSecondary, fontFamily: fonts.latin.regular },
          ]}
        >
          No cross-references found for this ayah
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {narrative && (
        <View
          style={[
            styles.narrativeBanner,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.narrativeLabel,
              { color: colors.textGold, fontFamily: fonts.latin.semiBold },
            ]}
          >
            {narrative.label}
          </Text>
          <Text
            style={[
              styles.narrativeScene,
              { color: colors.textSecondary, fontFamily: fonts.latin.regular },
            ]}
          >
            Scene {narrative.sceneIndex} of {narrative.totalScenes}
          </Text>
        </View>
      )}

      {references.map((ref, index) => (
        <Pressable
          key={`${ref.ayahRange}-${ref.hyperedgeLabel}-${index}`}
          style={[styles.card, { backgroundColor: colors.surface }]}
          onPress={() => {
            const parsed = parseAyahRef(ref.ayahRange);
            if (parsed && onReferencePress) {
              onReferencePress(parsed.surah, parsed.start);
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={`${ref.surahNameEnglish} ${ref.ayahRange}, ${ref.hyperedgeLabel}`}
        >
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.surahName,
                { color: colors.textGold, fontFamily: fonts.latin.semiBold },
              ]}
            >
              {ref.surahNameEnglish}
            </Text>
            <Text
              style={[
                styles.surahNameArabic,
                { color: colors.textGold, fontFamily: fonts.arabic.regular },
              ]}
              accessibilityLanguage="ar"
            >
              {ref.surahNameArabic}
            </Text>
          </View>

          <Text
            style={[
              styles.ayahRange,
              { color: colors.textSecondary, fontFamily: fonts.latin.regular },
            ]}
          >
            {ref.ayahRange}
          </Text>

          <Text
            style={[
              styles.hyperedgeLabel,
              { color: colors.textPrimary, fontFamily: fonts.latin.medium },
            ]}
            numberOfLines={2}
          >
            {ref.hyperedgeLabel}
          </Text>

          <View style={[styles.typeBadge, { backgroundColor: colors.border }]}>
            <Text
              style={[
                styles.typeBadgeText,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.latin.regular,
                },
              ]}
            >
              {TYPE_LABELS[ref.hyperedgeType] || ref.hyperedgeType}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

export function CrossReferencesSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.card,
            { backgroundColor: colors.surface, opacity: 0.5 },
          ]}
        >
          <View
            style={[
              styles.skeletonLine,
              { width: "60%", backgroundColor: colors.border },
            ]}
          />
          <View
            style={[
              styles.skeletonLine,
              { width: "30%", backgroundColor: colors.border },
            ]}
          />
          <View
            style={[
              styles.skeletonLine,
              { width: "80%", backgroundColor: colors.border },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  narrativeBanner: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginBottom: 4,
  },
  narrativeLabel: {
    fontSize: 15,
  },
  narrativeScene: {
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    minHeight: 44,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  surahName: {
    fontSize: 14,
  },
  surahNameArabic: {
    fontSize: 16,
  },
  ayahRange: {
    fontSize: 12,
    marginTop: 2,
  },
  hyperedgeLabel: {
    fontSize: 14,
    marginTop: 6,
  },
  typeBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 8,
  },
  typeBadgeText: {
    fontSize: 10,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
});
