import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Svg, { Polygon, Rect } from "react-native-svg";
import { useTheme } from "../../theme/ThemeProvider";

interface EntityChipsProps {
  entities: Array<{
    id: string;
    name_english: string;
    name_arabic: string;
    type: string;
  }>;
  maxVisible?: number;
  onChipPress?: (entityId: string) => void;
}

const CHIP_COLORS: Record<string, string> = {
  prophet: "#8B6914",
  theme: "#1B4332",
  place: "#7C4A2D",
  concept: "#4A3728",
};
const DEFAULT_CHIP_COLOR = "#6B5B3E";

function getChipColor(type: string): string {
  return CHIP_COLORS[type] ?? DEFAULT_CHIP_COLOR;
}

function CircleIndicator({ color }: { color: string }) {
  return <View style={[styles.indicator, styles.circle, { backgroundColor: color }]} />;
}

function RoundedRectIndicator({ color }: { color: string }) {
  return <View style={[styles.indicator, styles.roundedRect, { backgroundColor: color }]} />;
}

function DiamondIndicator({ color }: { color: string }) {
  return (
    <Svg width={8} height={8} viewBox="0 0 8 8" accessible={false}>
      <Polygon points="4,0 8,4 4,8 0,4" fill={color} />
    </Svg>
  );
}

function HexagonIndicator({ color }: { color: string }) {
  return (
    <Svg width={8} height={8} viewBox="0 0 8 8" accessible={false}>
      <Polygon points="2,0 6,0 8,4 6,8 2,8 0,4" fill={color} />
    </Svg>
  );
}

function PillIndicator({ color }: { color: string }) {
  return <View style={[styles.indicator, styles.pill, { backgroundColor: color }]} />;
}

function ShapeIndicator({ type, color }: { type: string; color: string }) {
  switch (type) {
    case "prophet":
      return <CircleIndicator color={color} />;
    case "theme":
      return <RoundedRectIndicator color={color} />;
    case "place":
      return <DiamondIndicator color={color} />;
    case "concept":
      return <HexagonIndicator color={color} />;
    default:
      return <PillIndicator color={color} />;
  }
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "\u2026" : text;
}

export function EntityChips({
  entities,
  maxVisible = 5,
  onChipPress,
}: EntityChipsProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? entities : entities.slice(0, maxVisible);
  const overflowCount = entities.length - maxVisible;

  return (
    <View style={styles.container}>
      {visible.map((entity) => {
        const chipColor = getChipColor(entity.type);
        return (
          <Pressable
            key={entity.id}
            style={[styles.chip, { backgroundColor: chipColor }]}
            onPress={() => onChipPress?.(entity.id)}
            accessibilityLabel={`${entity.name_english}, ${entity.type}`}
            accessibilityRole="button"
          >
            <ShapeIndicator type={entity.type} color="#FFFFFF" />
            <Text style={styles.chipLabel} numberOfLines={1}>
              {truncate(entity.name_english, 12)}
            </Text>
          </Pressable>
        );
      })}
      {!expanded && overflowCount > 0 && (
        <Pressable
          style={[styles.chip, styles.overflowChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => setExpanded(true)}
          accessibilityLabel={`Show ${overflowCount} more entities`}
          accessibilityRole="button"
        >
          <Text style={[styles.overflowLabel, { color: colors.textSecondary }]}>
            +{overflowCount} more
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    minHeight: 44,
    borderRadius: 16,
  },
  chipLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: "#FFFFFF",
  },
  overflowChip: {
    borderWidth: 1,
  },
  overflowLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
  },
  indicator: {
    width: 8,
    height: 8,
  },
  circle: {
    borderRadius: 999,
  },
  roundedRect: {
    borderRadius: 2,
  },
  pill: {
    borderRadius: 4,
    width: 12,
    height: 6,
  },
});
