import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  currentStreak: number;
}

export function StreakCelebration({ currentStreak }: Props) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const prevStreak = useRef(currentStreak);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (currentStreak > prevStreak.current && currentStreak > 0) {
      setVisible(true);

      if (reduceMotion) {
        // Show briefly without animation
        const timeout = setTimeout(() => setVisible(false), 400);
        prevStreak.current = currentStreak;
        return () => clearTimeout(timeout);
      }

      scale.value = 0;
      opacity.value = 1;
      scale.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      }, (finished) => {
        if (finished) {
          runOnJS(setVisible)(false);
        }
      });
    }
    prevStreak.current = currentStreak;
  }, [currentStreak, reduceMotion, scale, opacity]);

  const animatedProps = useAnimatedProps(() => ({
    r: 20 + scale.value * 30,
    opacity: opacity.value,
    strokeWidth: 2 - scale.value * 1.5,
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Svg width={120} height={120} viewBox="0 0 120 120">
        <AnimatedCircle
          cx={60}
          cy={60}
          fill="none"
          stroke={colors.accent}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
