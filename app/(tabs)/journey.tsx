import { View, Text } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

export default function JourneyPage() {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}>
      <Text style={{ color: colors.textSecondary, fontFamily: "Inter-Medium" }}>
        Journey — Coming Soon
      </Text>
    </View>
  );
}
