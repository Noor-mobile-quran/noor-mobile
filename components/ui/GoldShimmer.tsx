import { useEffect } from "react";
import { type ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
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

  useEffect(() => {
    if (isReadingContext) return; // No animation on reading screens
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [isReadingContext, shimmerPosition]);

  const animatedStyle = useAnimatedStyle(() => {
    if (isReadingContext) {
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
