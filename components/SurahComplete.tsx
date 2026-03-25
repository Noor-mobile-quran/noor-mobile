import { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from "react-native";
import { OrnamentalDivider, FlowerOrnament } from "./ornaments";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";

interface Props {
  visible: boolean;
}

export function SurahComplete({ visible }: Props) {
  const { colors } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (visible) {
      if (reduceMotion) {
        opacity.setValue(1);
      } else {
        opacity.setValue(0);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    } else {
      opacity.setValue(0);
    }
  }, [visible, reduceMotion, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <OrnamentalDivider color={colors.accent} />
      <Text
        style={[
          styles.text,
          {
            color: colors.accent,
            fontFamily: fonts.latin.medium,
          },
        ]}
      >
        Surah Complete
      </Text>
      <View style={styles.ornament}>
        <FlowerOrnament size={32} color={colors.accent} opacity={0.3} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  text: {
    fontSize: 18,
    letterSpacing: 0.5,
  },
  ornament: {
    marginTop: 4,
  },
});
