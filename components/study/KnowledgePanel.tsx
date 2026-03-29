import React, { useEffect, useCallback, useRef } from "react";
import {
  AccessibilityInfo,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { useTheme } from "../../theme/ThemeProvider";
import { fonts } from "../../theme/typography";
import surahIndex from "../../assets/data/surah-index.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SurahEntry {
  number: number;
  name_arabic: string;
  name_english: string;
  name_translation: string;
  revelation_type: string;
  ayah_count: number;
  juz_start: number;
}

export interface KnowledgePanelProps {
  visible: boolean;
  onDismiss: () => void;
  surah: number;
  ayah: number;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCREEN_HEIGHT = Dimensions.get("window").height;

// translateY values (distance from top of screen to top of sheet)
// Peek  = 75% from top  => 25% visible
// Half  = 50% from top  => 50% visible
// Full  = 10% from top  => 90% visible
// Offscreen = 100% (hidden below screen)
const SNAP_PEEK = SCREEN_HEIGHT * 0.75;
const SNAP_HALF = SCREEN_HEIGHT * 0.50;
const SNAP_FULL = SCREEN_HEIGHT * 0.10;
const SNAP_OFFSCREEN = SCREEN_HEIGHT;

const SNAP_POINTS = [SNAP_FULL, SNAP_HALF, SNAP_PEEK] as const;

const ANIM_DURATION = 250;

// Swipe velocity or distance threshold to change stage
const SWIPE_THRESHOLD = 50;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSurahName(surahNumber: number): { english: string; arabic: string } {
  const entries = surahIndex as SurahEntry[];
  const entry = entries.find((s) => s.number === surahNumber);
  if (!entry) {
    return { english: `Surah ${surahNumber}`, arabic: "" };
  }
  return { english: entry.name_english, arabic: entry.name_arabic };
}

function snapToNearest(y: number): number {
  let closest = SNAP_POINTS[0];
  let minDist = Math.abs(y - SNAP_POINTS[0]);
  for (const point of SNAP_POINTS) {
    const dist = Math.abs(y - point);
    if (dist < minDist) {
      minDist = dist;
      closest = point;
    }
  }
  return closest;
}

function getNextSnapDown(currentY: number): number | null {
  // Returns the next snap point below the current one (larger translateY)
  // Returns null if already at Peek (would dismiss)
  const sorted = [...SNAP_POINTS].sort((a, b) => a - b); // [Full, Half, Peek]
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i] > currentY + 1) {
      return sorted[i];
    }
  }
  return null; // at or below Peek — signal dismiss
}

function getNextSnapUp(currentY: number): number | null {
  const sorted = [...SNAP_POINTS].sort((a, b) => a - b);
  for (const point of sorted) {
    if (point < currentY - 1) {
      return point;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Overlay
// ---------------------------------------------------------------------------

interface OverlayProps {
  translateY: SharedValue<number>;
}

function DimOverlay({ translateY }: OverlayProps) {
  const overlayStyle = useAnimatedStyle(() => {
    // opacity: 0 at Peek/Offscreen, 0.6 at Half and Full
    // Map translateY: SNAP_PEEK => 0, SNAP_HALF => 0.6, SNAP_FULL => 0.6
    // We clamp opacity between 0 and 0.6
    const progress = (SNAP_PEEK - translateY.value) / (SNAP_PEEK - SNAP_HALF);
    const clamped = Math.min(1, Math.max(0, progress));
    return { opacity: clamped * 0.6 };
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, styles.overlay, overlayStyle]}
      pointerEvents="none"
    />
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function KnowledgePanel({
  visible,
  onDismiss,
  surah,
  ayah,
  children,
}: KnowledgePanelProps) {
  const { colors } = useTheme();

  const surahInfo = getSurahName(surah);

  // Shared values
  const translateY = useSharedValue(SNAP_OFFSCREEN);
  const gestureStartY = useSharedValue(SNAP_PEEK);
  const currentSnap = useSharedValue(SNAP_PEEK);

  // reduce-motion ref — readable on JS thread; also a ref so gesture callbacks
  // can close over a stable reference
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    let sub: ReturnType<typeof AccessibilityInfo.addEventListener> | undefined;
    const init = async () => {
      try {
        const enabled = await AccessibilityInfo.isReduceMotionEnabled();
        reduceMotionRef.current = enabled;
      } catch {
        reduceMotionRef.current = false;
      }
    };
    init();
    try {
      sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => {
        reduceMotionRef.current = enabled;
      });
    } catch {}
    return () => {
      try {
        sub?.remove();
      } catch {}
    };
  }, []);

  // Animate in/out when visible changes
  useEffect(() => {
    if (visible) {
      currentSnap.value = SNAP_PEEK;
      const duration = reduceMotionRef.current ? 0 : ANIM_DURATION;
      translateY.value = withTiming(SNAP_PEEK, {
        duration,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      const duration = reduceMotionRef.current ? 0 : ANIM_DURATION;
      translateY.value = withTiming(SNAP_OFFSCREEN, {
        duration,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [visible, translateY, currentSnap]);

  const snapTo = useCallback(
    (targetY: number) => {
      "worklet";
      const duration = reduceMotionRef.current ? 0 : ANIM_DURATION;
      translateY.value = withTiming(targetY, {
        duration,
        easing: Easing.out(Easing.cubic),
      });
      currentSnap.value = targetY;
    },
    [translateY, currentSnap]
  );

  const dismiss = useCallback(() => {
    "worklet";
    const duration = reduceMotionRef.current ? 0 : ANIM_DURATION;
    translateY.value = withTiming(SNAP_OFFSCREEN, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
    runOnJS(onDismiss)();
  }, [translateY, onDismiss]);

  // Pan gesture
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      gestureStartY.value = translateY.value;
    })
    .onUpdate((event) => {
      "worklet";
      const nextY = gestureStartY.value + event.translationY;
      // Clamp: cannot drag above SNAP_FULL, can drag below screen
      translateY.value = Math.max(SNAP_FULL, nextY);
    })
    .onEnd((event) => {
      "worklet";
      const velocity = event.velocityY;
      const translation = event.translationY;
      const snap = currentSnap.value;

      // Fast swipe down
      if (velocity > 500 || translation > SWIPE_THRESHOLD) {
        if (snap >= SNAP_PEEK - 1) {
          // Already at Peek — dismiss
          dismiss();
          return;
        }
        const next = getNextSnapDown(snap);
        if (next === null) {
          dismiss();
        } else {
          snapTo(next);
        }
        return;
      }

      // Fast swipe up
      if (velocity < -500 || translation < -SWIPE_THRESHOLD) {
        const next = getNextSnapUp(snap);
        if (next !== null) {
          snapTo(next);
        } else {
          snapTo(SNAP_FULL);
        }
        return;
      }

      // Settle to nearest snap point
      const nearest = snapToNearest(translateY.value);
      if (nearest > SNAP_PEEK + 10) {
        dismiss();
      } else {
        snapTo(nearest);
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Determine if content should be scrollable (Half and Full stages)
  // We drive this via the shared value on the JS side indirectly.
  // ScrollView is always rendered but scrollEnabled is controlled by a state
  // derived from currentSnap. We use a ref approach here.
  // For simplicity: always allow scroll — at Peek the small height naturally
  // prevents scrolling further.

  if (!visible && translateY.value >= SNAP_OFFSCREEN - 1) {
    // Avoid rendering the modal entirely when not visible and fully off-screen.
    // We still render when in the process of animating out (visible=false but
    // translateY hasn't reached SNAP_OFFSCREEN yet). We rely on the Modal
    // visible prop for the initial render gate.
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
      accessibilityViewIsModal
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        {/* Dimming overlay */}
        <DimOverlay translateY={translateY} />

        {/* Bottom sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surfaceElevated,
              shadowColor: colors.textPrimary,
            },
            sheetAnimatedStyle,
          ]}
        >
          {/* Drag handle — 44px touch target, 40x4 visual */}
          <GestureDetector gesture={panGesture}>
            <View
              style={styles.handleArea}
              accessibilityLabel="Drag to resize panel"
              accessibilityRole="adjustable"
              accessibilityHint="Drag up to expand, drag down to collapse"
            >
              <View
                style={[
                  styles.handle,
                  { backgroundColor: colors.textSecondary },
                ]}
              />
            </View>
          </GestureDetector>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text
                style={[
                  styles.surahName,
                  { color: colors.textPrimary },
                ]}
                numberOfLines={1}
                accessibilityLanguage="ar"
                aria-label={surahInfo.english}
              >
                {surahInfo.arabic || surahInfo.english}
              </Text>
              <Text style={[styles.headerDot, { color: colors.textSecondary }]}>
                {" \u00B7 "}
              </Text>
              <Text
                style={[styles.ayahNumber, { color: colors.textSecondary }]}
              >
                {"Ayah "}
                {ayah}
              </Text>
            </View>
          </View>

          {/* Scrollable content area */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,1)",
    zIndex: 0,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Shadow (top edge)
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
    zIndex: 1,
  },
  // 44px tall touch target for drag handle area
  handleArea: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  surahName: {
    fontFamily: fonts.arabic.regular,
    fontSize: 20,
    lineHeight: 28,
  },
  headerDot: {
    fontFamily: fonts.latin.regular,
    fontSize: 16,
  },
  ayahNumber: {
    fontFamily: fonts.latin.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
