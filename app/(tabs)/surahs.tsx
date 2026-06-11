import { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSurahList } from "../../hooks/useQuranData";
import { useQuranSearch } from "../../hooks/useQuranSearch";
import { useTheme } from "../../theme/ThemeProvider";
import { StarOrnament } from "../../components/ornaments";
import { ArabicText } from "../../components/ui/ArabicText";
import SurahCard from "../../components/SurahCard";
import SearchBar from "../../components/SearchBar";
import SearchResultCard from "../../components/SearchResultCard";
import type { SurahMeta } from "../../types";
import { fonts } from "../../theme/typography";

type Filter = "all" | "meccan" | "medinan";

export default function SurahIndexPage() {
  const { data: surahs, isLoading } = useSurahList();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    setQuery: setAyahQuery,
    results: ayahResults,
    query: ayahQuery,
  } = useQuranSearch();

  const handleSearch = (text: string) => {
    setSearch(text);
    setAyahQuery(text);
  };

  const showAyahResults = ayahQuery.length >= 3 && ayahResults.length > 0;

  const filtered = useMemo(() => {
    if (!surahs) return [];
    return surahs.filter((s) => {
      const matchesSearch =
        !search ||
        s.name_english.toLowerCase().includes(search.toLowerCase()) ||
        s.name_arabic.includes(search) ||
        String(s.number).includes(search);
      const matchesFilter = filter === "all" || s.revelation_type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [surahs, search, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All Surahs" },
    { key: "meccan", label: "Meccan" },
    { key: "medinan", label: "Medinan" },
  ];

  const renderItem = ({ item }: { item: SurahMeta }) => (
    <View className="px-4 mb-2">
      <SurahCard surah={item} />
    </View>
  );

  const ListHeader = (
    <>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ["#2D261C", "#1A1410"] : ["#4A3F30", "#2D261C"]}
        className="rounded-b-3xl px-6 py-8 items-center overflow-hidden"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="absolute top-3 right-4 opacity-10">
          <ArabicText
            decorative
            style={{
              color: colors.textGold,
              fontSize: 36,
              lineHeight: 44,
              textAlign: "right",
            }}
          >
            {"القرآن"}
          </ArabicText>
        </View>

        <Text
          style={{
            color: "#FFF9ED",
            fontFamily: fonts.latin.bold,
            fontSize: 22,
          }}
        >
          The Noble Quran
        </Text>
        <Text
          style={{
            color: "rgba(255, 249, 237, 0.6)",
            fontFamily: fonts.latin.regular,
            fontSize: 13,
            marginTop: 4,
          }}
        >
          114 Surahs · 6,236 Ayahs
        </Text>

        <View className="flex-row items-center justify-center gap-3 mt-4">
          <View
            className="h-px w-12"
            style={{ backgroundColor: "rgba(212, 168, 67, 0.3)" }}
          />
          <StarOrnament size={12} color={colors.accent} opacity={0.5} />
          <View
            className="h-px w-12"
            style={{ backgroundColor: "rgba(212, 168, 67, 0.3)" }}
          />
        </View>
      </LinearGradient>

      {/* Search + Filters */}
      <View className="px-4 pt-5 gap-4">
        <SearchBar onSearch={handleSearch} />

        <View className="flex-row gap-2">
          {filters.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor:
                  filter === f.key ? colors.accent : colors.surface,
                shadowColor: filter === f.key ? colors.accent : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: filter === f.key ? 0.2 : 0,
                shadowRadius: 4,
                elevation: filter === f.key ? 3 : 0,
              }}
            >
              <Text
                style={{
                  color: filter === f.key ? "#FFFFFF" : colors.textSecondary,
                  fontFamily: fonts.latin.medium,
                  fontSize: 13,
                }}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: fonts.latin.regular,
            fontSize: 12,
          }}
        >
          {filtered.length} surahs
        </Text>
      </View>
    </>
  );

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.bg }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => String(item.number)}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        <View className="items-center py-12">
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: fonts.latin.regular,
              fontSize: 15,
            }}
          >
            No surahs found
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: fonts.latin.regular,
              fontSize: 12,
              marginTop: 4,
              opacity: 0.6,
            }}
          >
            Try a different search term
          </Text>
        </View>
      }
      ListFooterComponent={
        showAyahResults ? (
          <View
            style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: fonts.latin.semiBold,
                fontSize: 14,
                marginBottom: 10,
              }}
            >
              Ayah matches ({ayahResults.length}
              {ayahResults.length >= 50 ? "+" : ""})
            </Text>
            {ayahResults.map((r) => (
              <SearchResultCard
                key={`${r.surah}-${r.ayah}`}
                result={r}
                query={ayahQuery}
              />
            ))}
          </View>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 24, backgroundColor: colors.bg }}
      style={{ backgroundColor: colors.bg }}
      showsVerticalScrollIndicator={false}
    />
  );
}
