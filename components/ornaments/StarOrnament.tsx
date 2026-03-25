import { Platform } from "react-native";
import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
  opacity?: number;
}

export function StarOrnament({ size = 16, color = "#D4A843", opacity = 0.5 }: Props) {
  // 8-pointed star (Rub el Hizb)
  const decorativeProps = Platform.OS === "web"
    ? { "aria-hidden": true as const }
    : { accessible: false, importantForAccessibility: "no" as const };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity} {...decorativeProps}>
      <Path
        d="M12 0l3 9h9l-7.5 5.5 3 9L12 18l-7.5 5.5 3-9L0 9h9z"
        fill={color}
      />
    </Svg>
  );
}
