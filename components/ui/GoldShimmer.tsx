import { useEffect, useState } from "react";
import { AccessibilityInfo, type ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../../theme/ThemeProvider";

interface Props extends ViewProps {
  children: React.ReactNode;
  /** Set to true on reading screens to disable shimmer */
  isReadingContext?: boolean;
}

export function GoldShimmer({
  children,
  isReadingContext = false,
  style,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const shimmerPosition = useSharedValue(0);

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    try {
      AccessibilityInfo.isReduceMotionEnabled()
        .then(setReduceMotion)
        .catch(() => {});
    } catch (_) {
      // AccessibilityInfo is unavailable on web
    }
    let sub: ReturnType<typeof AccessibilityInfo.addEventListener> | null =
      null;
    try {
      sub = AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        setReduceMotion,
      );
    } catch (_) {
      // Not supported on web
    }
    return () => {
      sub?.remove();
    };
  }, []);

  useEffect(() => {
    if (isReadingContext || reduceMotion) {
      cancelAnimation(shimmerPosition);
      shimmerPosition.value = 0;
      return;
    }
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [isReadingContext, reduceMotion, shimmerPosition]);

  const animatedStyle = useAnimatedStyle(() => {
    if (isReadingContext || reduceMotion) {
      return { opacity: 1 }; // Static gold, no shimmer
    }
    return {
      opacity: 0.7 + shimmerPosition.value * 0.3,
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]} {...rest}>
      {children}
    </Animated.View>
  );
}
