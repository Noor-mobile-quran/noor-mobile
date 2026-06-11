import React, { useEffect, useMemo, useState } from "react";
import { AccessibilityInfo, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Line,
  Rect,
  Text as SvgText,
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import hyperedgesData from "../../assets/knowledge/hyperedges.json";
import entitiesData from "../../assets/knowledge/entities.json";

const AnimatedLine = Animated.createAnimatedComponent(Line);

interface ConstellationGraphProps {
  centralEntityId: string;
  onEntityPress?: (entityId: string) => void;
  width?: number;
  height?: number;
}

interface HyperedgeMember {
  entity: string;
  role: string;
}

interface Hyperedge {
  id: string;
  members: HyperedgeMember[];
}

interface Entity {
  id: string;
  name_english: string;
  type: string;
}

const NODE_COLORS: Record<string, string> = {
  prophet: "#8B6914",
  theme: "#1B4332",
  place: "#7C4A2D",
  concept: "#4A3728",
};
const DEFAULT_NODE_COLOR = "#6B5B3E";

const RING_1_RADIUS = 80;
const RING_2_RADIUS = 130;
const RING_1_NODE_R = 8;
const RING_2_NODE_R = 6;
const CENTER_NODE_R = 6;
const BG_COLOR = "#1A1410";
const CREAM = "#FFF9ED";
const LABEL_COLOR = "#D4B896";
const TOUCH_SIZE = 44;

function getNodeColor(type: string): string {
  return NODE_COLORS[type] ?? DEFAULT_NODE_COLOR;
}

function getEntityById(id: string): Entity | undefined {
  return (entitiesData as { entities: Entity[] }).entities.find(
    (e) => e.id === id,
  );
}

function truncateLabel(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "\u2026" : text;
}

export function ConstellationGraph({
  centralEntityId,
  onEntityPress,
  width = 300,
  height = 300,
}: ConstellationGraphProps) {
  const cx = width / 2;
  const cy = height / 2;

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    try {
      AccessibilityInfo.isReduceMotionEnabled()
        .then(setReduceMotion)
        .catch(() => {});
    } catch (_) {}
    let sub: ReturnType<typeof AccessibilityInfo.addEventListener> | null =
      null;
    try {
      sub = AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        setReduceMotion,
      );
    } catch (_) {}
    return () => {
      sub?.remove();
    };
  }, []);

  const pulseOpacity = useSharedValue(0.3);
  useEffect(() => {
    if (reduceMotion) return;
    pulseOpacity.value = withRepeat(
      withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [reduceMotion, pulseOpacity]);

  const { ring1, ring2, centralEntity } = useMemo(() => {
    const hyperedges = (hyperedgesData as { hyperedges: Hyperedge[] })
      .hyperedges;
    const central = getEntityById(centralEntityId);

    // Ring 1: direct connections
    const ring1Ids = new Set<string>();
    const directEdges: Hyperedge[] = [];
    for (const he of hyperedges) {
      if (he.members.some((m) => m.entity === centralEntityId)) {
        directEdges.push(he);
        for (const m of he.members) {
          if (m.entity !== centralEntityId) ring1Ids.add(m.entity);
        }
      }
    }

    // Cap Ring 1 at 6
    const ring1List = Array.from(ring1Ids).slice(0, 6);

    // Ring 2: one hop further
    const ring2Ids = new Set<string>();
    for (const r1Id of ring1List) {
      for (const he of hyperedges) {
        if (he.members.some((m) => m.entity === r1Id)) {
          for (const m of he.members) {
            if (m.entity !== centralEntityId && !ring1Ids.has(m.entity)) {
              ring2Ids.add(m.entity);
            }
          }
        }
      }
    }

    // Cap total at 12
    const remaining = 12 - ring1List.length;
    const ring2List = Array.from(ring2Ids).slice(0, Math.min(6, remaining));

    return {
      ring1: ring1List
        .map((id) => getEntityById(id))
        .filter(Boolean) as Entity[],
      ring2: ring2List
        .map((id) => getEntityById(id))
        .filter(Boolean) as Entity[],
      centralEntity: central,
    };
  }, [centralEntityId]);

  const edgeAnimatedProps = useAnimatedProps(() => ({
    opacity: reduceMotion ? 0.4 : pulseOpacity.value,
  }));

  if (!centralEntity) return null;

  const centralLabel = truncateLabel(centralEntity.name_english, 14);

  return (
    <View
      style={[styles.container, { width, height, backgroundColor: BG_COLOR }]}
    >
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={CREAM} stopOpacity={0.4} />
            <Stop offset="100%" stopColor={CREAM} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Edges from center to Ring 1 */}
        {ring1.map((entity, i) => {
          const angle = (2 * Math.PI * i) / ring1.length;
          const x = cx + RING_1_RADIUS * Math.cos(angle);
          const y = cy + RING_1_RADIUS * Math.sin(angle);
          return (
            <AnimatedLine
              key={`edge-${entity.id}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={CREAM}
              strokeWidth={1}
              animatedProps={edgeAnimatedProps}
            />
          );
        })}

        {/* Center glow */}
        <Circle cx={cx} cy={cy} r={16} fill="url(#centerGlow)" />

        {/* Center node */}
        <Circle cx={cx} cy={cy} r={CENTER_NODE_R} fill={CREAM} />

        {/* Center label */}
        <SvgText
          x={cx}
          y={cy + CENTER_NODE_R + 14}
          textAnchor="middle"
          fill={LABEL_COLOR}
          fontSize={10}
          fontFamily="Inter-Regular"
        >
          {centralLabel}
        </SvgText>

        {/* Center touch target */}
        <Rect
          x={cx - TOUCH_SIZE / 2}
          y={cy - TOUCH_SIZE / 2}
          width={TOUCH_SIZE}
          height={TOUCH_SIZE}
          fill="transparent"
          onPress={() => onEntityPress?.(centralEntityId)}
        />

        {/* Ring 1 nodes */}
        {ring1.map((entity, i) => {
          const angle = (2 * Math.PI * i) / ring1.length;
          const x = cx + RING_1_RADIUS * Math.cos(angle);
          const y = cy + RING_1_RADIUS * Math.sin(angle);
          const color = getNodeColor(entity.type);
          return (
            <React.Fragment key={`r1-${entity.id}`}>
              <Circle cx={x} cy={y} r={RING_1_NODE_R} fill={color} />
              <SvgText
                x={x}
                y={y + RING_1_NODE_R + 12}
                textAnchor="middle"
                fill={LABEL_COLOR}
                fontSize={9}
                fontFamily="Inter-Regular"
              >
                {truncateLabel(entity.name_english, 10)}
              </SvgText>
              <Rect
                x={x - TOUCH_SIZE / 2}
                y={y - TOUCH_SIZE / 2}
                width={TOUCH_SIZE}
                height={TOUCH_SIZE}
                fill="transparent"
                onPress={() => onEntityPress?.(entity.id)}
              />
            </React.Fragment>
          );
        })}

        {/* Ring 2 nodes */}
        {ring2.map((entity, i) => {
          const angle = (2 * Math.PI * i) / ring2.length;
          const x = cx + RING_2_RADIUS * Math.cos(angle);
          const y = cy + RING_2_RADIUS * Math.sin(angle);
          const color = getNodeColor(entity.type);
          return (
            <React.Fragment key={`r2-${entity.id}`}>
              <Circle
                cx={x}
                cy={y}
                r={RING_2_NODE_R}
                fill={color}
                opacity={0.7}
              />
              <Rect
                x={x - TOUCH_SIZE / 2}
                y={y - TOUCH_SIZE / 2}
                width={TOUCH_SIZE}
                height={TOUCH_SIZE}
                fill="transparent"
                onPress={() => onEntityPress?.(entity.id)}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
  },
});
