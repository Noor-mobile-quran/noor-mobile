import { Platform, Text, type TextProps, type TextStyle } from "react-native";
import { fonts, fontSizes } from "../../theme/typography";
import { useAppStore } from "../../store/useAppStore";

interface Props extends Omit<TextProps, "style"> {
  children: string;
  variant?: "body" | "heading" | "display";
  bold?: boolean;
  decorative?: boolean;
  style?: TextStyle;
}

export function ArabicText({
  children,
  variant = "body",
  bold = false,
  decorative = false,
  style,
  ...rest
}: Props) {
  const fontSize = useAppStore((s) => s.settings.fontSize);

  const sizeValue =
    variant === "display"
      ? fontSizes[fontSize].arabic * 1.5
      : variant === "heading"
        ? fontSizes[fontSize].arabic * 1.2
        : fontSizes[fontSize].arabic;

  return (
    <Text
      style={[
        {
          fontFamily: bold ? fonts.arabic.bold : fonts.arabic.regular,
          fontSize: sizeValue,
          writingDirection: "rtl",
          textAlign: "right",
          lineHeight: sizeValue * 2.2,
        },
        style,
      ]}
      {...(Platform.OS !== "web"
        ? {
            accessibilityLanguage: "ar",
            importantForAccessibility: decorative ? "no" : "yes",
          }
        : { lang: "ar" })}
      accessibilityRole={decorative ? "none" : "text"}
      accessible={!decorative}
      {...rest}
    >
      {children}
    </Text>
  );
}
