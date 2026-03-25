import { View } from "react-native";
import { StarOrnament } from "./StarOrnament";
import { useTheme } from "../../theme/ThemeProvider";

interface Props {
  width?: "full" | "compact";
}

export function OrnamentalDivider({ width = "full" }: Props) {
  const { colors } = useTheme();
  const lineWidth = width === "full" ? "flex-1" : "w-12";

  return (
    <View className="flex-row items-center justify-center gap-3 my-4">
      <View
        className={`h-px ${lineWidth}`}
        style={{ backgroundColor: colors.border }}
      />
      <StarOrnament size={12} color={colors.accent} opacity={0.5} />
      <View
        className={`h-px ${lineWidth}`}
        style={{ backgroundColor: colors.border }}
      />
    </View>
  );
}
