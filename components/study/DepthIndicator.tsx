import React, { useMemo } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import hyperedgesData from "../../assets/knowledge/hyperedges.json";

// Bronze dot color for depth indicators — distinct from the gold accent palette
const BRONZE = "#6B5B3E";

interface DepthIndicatorProps {
  surah: number;
  ayah: number;
  onPress?: () => void;
}

interface HyperedgeEntry {
  id: string;
  grounding_ayahs: string[];
}

// Parse a grounding_ayah string such as "2:30-34" or "2:50" into surah number
// and an inclusive ayah range [start, end]. Returns null if the string is malformed.
function parseGroundingRef(
  ref: string,
): { surah: number; start: number; end: number } | null {
  const colonIdx = ref.indexOf(":");
  if (colonIdx === -1) return null;

  const surahNum = parseInt(ref.slice(0, colonIdx), 10);
  const ayahPart = ref.slice(colonIdx + 1);
  const dashIdx = ayahPart.indexOf("-");

  if (dashIdx === -1) {
    const ayahNum = parseInt(ayahPart, 10);
    if (isNaN(surahNum) || isNaN(ayahNum)) return null;
    return { surah: surahNum, start: ayahNum, end: ayahNum };
  }

  const start = parseInt(ayahPart.slice(0, dashIdx), 10);
  const end = parseInt(ayahPart.slice(dashIdx + 1), 10);
  if (isNaN(surahNum) || isNaN(start) || isNaN(end)) return null;
  return { surah: surahNum, start, end };
}

// Build a map of surah -> ayah -> connection count from the hyperedges array.
// Only the top-level "hyperedges" array (schema v2 relational facts) is used;
// the legacy per-ayah array does not carry grounding_ayahs in the same shape.
function buildConnectionMap(): Map<number, Map<number, number>> {
  const map = new Map<number, Map<number, number>>();

  const edges =
    (hyperedgesData as { hyperedges?: HyperedgeEntry[] }).hyperedges ?? [];

  for (const edge of edges) {
    if (!Array.isArray(edge.grounding_ayahs)) continue;

    for (const ref of edge.grounding_ayahs) {
      const parsed = parseGroundingRef(ref);
      if (!parsed) continue;

      let ayahMap = map.get(parsed.surah);
      if (!ayahMap) {
        ayahMap = new Map<number, number>();
        map.set(parsed.surah, ayahMap);
      }

      for (let a = parsed.start; a <= parsed.end; a++) {
        ayahMap.set(a, (ayahMap.get(a) ?? 0) + 1);
      }
    }
  }

  return map;
}

// Module-level singleton so the full map is built once across all component instances.
let _connectionMap: Map<number, Map<number, number>> | null = null;

function getConnectionMap(): Map<number, Map<number, number>> {
  if (!_connectionMap) {
    _connectionMap = buildConnectionMap();
  }
  return _connectionMap;
}

function getDotStyle(count: number): { size: number; opacity: number } | null {
  if (count <= 0) return null;
  if (count <= 3) return { size: 4, opacity: 0.4 };
  if (count <= 8) return { size: 6, opacity: 0.6 };
  return { size: 8, opacity: 0.8 };
}

export function DepthIndicator({ surah, ayah, onPress }: DepthIndicatorProps) {
  // Cache the per-ayah counts for the entire surah on first render for this surah.
  const surahAyahMap = useMemo(() => {
    return getConnectionMap().get(surah) ?? new Map<number, number>();
  }, [surah]);

  const count = surahAyahMap.get(ayah) ?? 0;
  const dotStyle = getDotStyle(count);

  // No connections — render nothing
  if (!dotStyle) return null;

  const { size, opacity } = dotStyle;

  return (
    <Pressable
      style={styles.touchTarget}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${count} knowledge connection${count === 1 ? "" : "s"} for this verse`}
      accessibilityHint="Opens the knowledge panel for this verse"
    >
      <View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: BRONZE,
            opacity,
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchTarget: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    // width, height, borderRadius, backgroundColor, opacity are set dynamically
  },
});
