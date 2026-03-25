import { View } from "react-native";
import { StarOrnament } from "./StarOrnament";
import { useTheme } from "../../theme/ThemeProvider";

interface Props {
  width?: "full" | "compact";
}

export function OrnamentalDivider({ width = "full" }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginVertical: 16,
      }}
    >
      <View
        style={{
          height: 1,
          flex: width === "full" ? 1 : undefined,
          width: width === "compact" ? 48 : undefined,
          backgroundColor: colors.border,
        }}
      />
      <StarOrnament size={12} color={colors.accent} opacity={0.5} />
      <View
        style={{
          height: 1,
          flex: width === "full" ? 1 : undefined,
          width: width === "compact" ? 48 : undefined,
          backgroundColor: colors.border,
        }}
      />
    </View>
  );
}
