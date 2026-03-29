import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useTheme } from "../theme/ThemeProvider";
import type { SearchResult } from "../hooks/useQuranSearch";

function ChevronRightIcon({ size = 16, color = "#6B5B45" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HighlightedText({
  text,
  highlight,
  baseStyle,
  highlightStyle,
}: {
  text: string;
  highlight: string;
  baseStyle: object;
  highlightStyle: object;
}) {
  if (!highlight || highlight.length < 3) {
    return <Text style={baseStyle} numberOfLines={3}>{text}</Text>;
  }

  const lowerText = text.toLowerCase();
  const lowerHighlight = highlight.toLowerCase();
  const parts: { text: string; bold: boolean }[] = [];
  let lastIndex = 0;

  let idx = lowerText.indexOf(lowerHighlight);
  while (idx !== -1 && parts.length < 20) {
    if (idx > lastIndex) {
      parts.push({ text: text.slice(lastIndex, idx), bold: false });
    }
    parts.push({ text: text.slice(idx, idx + highlight.length), bold: true });
    lastIndex = idx + highlight.length;
    idx = lowerText.indexOf(lowerHighlight, lastIndex);
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), bold: false });
  }

  return (
    <Text style={baseStyle} numberOfLines={3}>
      {parts.map((part, i) =>
        part.bold ? (
          <Text key={i} style={highlightStyle}>
            {part.text}
          </Text>
        ) : (
          <Text key={i}>{part.text}</Text>
        )
      )}
    </Text>
  );
}

interface Props {
  result: SearchResult;
  query: string;
}

export default function SearchResultCard({ result, query }: Props) {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 14,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
        },
        content: { flex: 1, marginRight: 8 },
        headerRow: {
          flexDirection: "row",
          alignItems: "baseline",
          gap: 6,
          marginBottom: 4,
        },
        surahArabic: {
          fontFamily: "Amiri_700Bold",
          fontSize: 15,
          color: colors.textPrimary,
        },
        surahEnglish: {
          fontFamily: "Inter_500Medium",
          fontSize: 13,
          color: colors.textPrimary,
        },
        ayahLabel: {
          fontFamily: "Inter_400Regular",
          fontSize: 12,
          color: colors.textSecondary,
        },
        matchText: {
          fontFamily: "Inter_400Regular",
          fontSize: 13,
          color: colors.textSecondary,
          lineHeight: 19,
          marginTop: 4,
        },
        matchBold: {
          fontFamily: "Inter_600SemiBold",
          color: colors.textGold,
        },
        chevron: {
          justifyContent: "center",
          alignItems: "center",
          width: 24,
        },
      }),
    [colors]
  );

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/surah/${result.surah}`)}
      accessibilityRole="button"
      accessibilityLabel={`${result.surahName}, Ayah ${result.ayah}`}
      accessibilityHint="Tap to read this ayah"
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text
            style={styles.surahArabic}
            accessibilityLanguage="ar"
          >
            {result.surahNameArabic}
          </Text>
          <Text style={styles.surahEnglish}>{result.surahName}</Text>
          <Text style={styles.ayahLabel}>Ayah {result.ayah}</Text>
        </View>
        <HighlightedText
          text={result.matchContext}
          highlight={query}
          baseStyle={styles.matchText}
          highlightStyle={styles.matchBold}
        />
      </View>
      <View style={styles.chevron}>
        <ChevronRightIcon size={16} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}
