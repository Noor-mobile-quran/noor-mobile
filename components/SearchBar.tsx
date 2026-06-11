import { useState } from "react";
import { TextInput } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");
  const { colors } = useTheme();

  return (
    <TextInput
      value={query}
      onChangeText={(text) => {
        setQuery(text);
        onSearch(text);
      }}
      placeholder="Search surahs..."
      placeholderTextColor={colors.textSecondary}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: fonts.latin.regular,
        fontSize: 15,
        color: colors.textPrimary,
      }}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
      accessibilityLabel="Search surahs"
      accessibilityRole="search"
    />
  );
}
