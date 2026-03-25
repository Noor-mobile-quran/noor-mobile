import Svg, { Circle, Path, G } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
  opacity?: number;
}

export function FlowerOrnament({ size = 20, color = "#D4A843", opacity = 0.3 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
      <G transform="translate(12,12)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <Path
            key={angle}
            d="M0,-8 C3,-6 3,-2 0,0 C-3,-2 -3,-6 0,-8"
            fill={color}
            transform={`rotate(${angle})`}
          />
        ))}
        <Circle r={2.5} fill={color} />
      </G>
    </Svg>
  );
}
