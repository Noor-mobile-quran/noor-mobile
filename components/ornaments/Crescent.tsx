import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
  opacity?: number;
}

export function Crescent({ size = 48, color = "#D4A843", opacity = 0.2 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" opacity={opacity}>
      <Path
        d="M24 4C13 4 4 13 4 24s9 20 20 20c-7.7 0-14-6.3-14-14S16.3 16 24 16c3.3 0 6.3 1.1 8.7 3C30.3 11.3 24 4 24 4z"
        fill={color}
      />
      <Path
        d="M36 12l1.5 3 3.5.5-2.5 2.5.5 3.5L36 20l-3 1.5.5-3.5L31 15.5l3.5-.5z"
        fill={color}
        opacity={0.7}
      />
    </Svg>
  );
}
