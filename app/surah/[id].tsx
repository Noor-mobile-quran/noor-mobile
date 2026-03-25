import { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { useSurah } from "../../hooks/useQuranData";
import { useAppStore } from "../../store/useAppStore";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useTheme } from "../../theme/ThemeProvider";
import { storage } from "../../lib/storage";
import { fonts } from "../../theme/typography";
import SurahHeader from "../../components/SurahHeader";
import SurahContextCard from "../../components/SurahContextCard";
import AyahCard from "../../components/AyahCard";
import { StarOrnament } from "../../components/ornaments";
import type { Ayah, Bookmark } from "../../types";

export default function ReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahNum = Number(id);
  const router = useRouter();
  const { colors } = useTheme();

  const { data: surah, isLoading, error } = useSurah(surahNum);
  const recordReading = useAppStore((s) => s.recordReading);
  const audioPlaying = useAppStore((s) => s.audioPlaying);
  const currentAudioAyah = useAppStore((s) => s.currentAudioAyah);

  const { play, stop } = useAudioPlayer();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks
  useEffect(() => {
    setBookmarks(storage.getBookmarks());
  }, []);

  // Record reading on mount
  useEffect(() => {
    if (surah) {
      recordReading(surahNum, 1);
    }
  }, [surahNum, surah, recordReading]);

  const isBookmarked = useCallback(
    (ayahNum: number) =>
      bookmarks.some((b) => b.surah === surahNum && b.ayah === ayahNum),
    [bookmarks, surahNum]
  );

  const toggleBookmark = useCallback(
    (ayahNum: number) => {
      if (isBookmarked(ayahNum)) {
        storage.removeBookmark(surahNum, ayahNum);
      } else {
        storage.addBookmark({
          surah: surahNum,
          ayah: ayahNum,
          timestamp: Date.now(),
        });
      }
      setBookmarks(storage.getBookmarks());
    },
    [isBookmarked, surahNum]
  );

  const playAyah = useCallback(
    async (ayahNumber: number, audioUrl?: string) => {
      if (!audioUrl) return;

      if (audioPlaying && currentAudioAyah === ayahNumber) {
        await stop();
        return;
      }

      await play(audioUrl, ayahNumber);
    },
    [audioPlaying, currentAudioAyah, play, stop]
  );

  const renderAyah = useCallback(
    ({ item }: { item: Ayah }) => (
      <AyahCard
        ayah={item}
        isPlaying={audioPlaying && currentAudioAyah === item.number_in_surah}
        onPlay={() => playAyah(item.number_in_surah, item.audio_url)}
        onBookmark={() => toggleBookmark(item.number_in_surah)}
        isBookmarked={isBookmarked(item.number_in_surah)}
      />
    ),
    [audioPlaying, currentAudioAyah, playAyah, toggleBookmark, isBookmarked]
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !surah) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.latin.regular }}>
          Surah not found
        </Text>
      </View>
    );
  }

  const ListHeader = () => (
    <View>
      <SurahHeader surah={surah} />
      <SurahContextCard surahNumber={surahNum} />
      <View style={{ height: 16 }} />
    </View>
  );

  const ListFooter = () => (
    <View style={styles.footer}>
      <View style={styles.navRow}>
        {surahNum > 1 ? (
          <TouchableOpacity
            onPress={() => router.push(`/surah/${surahNum - 1}`)}
            style={[styles.navButton, { borderColor: colors.border }]}
            accessibilityLabel="Previous Surah"
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Svg width={14} height={14} viewBox="0 0 24 24">
                <Path d="M15 18l-6-6 6-6" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </Svg>
              <Text style={[styles.navText, { color: colors.accent, fontFamily: fonts.latin.medium }]}>
                Previous Surah
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {surahNum < 114 ? (
          <TouchableOpacity
            onPress={() => router.push(`/surah/${surahNum + 1}`)}
            style={[styles.navButton, { borderColor: colors.border }]}
            accessibilityLabel="Next Surah"
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={[styles.navText, { color: colors.accent, fontFamily: fonts.latin.medium }]}>
                Next Surah
              </Text>
              <Svg width={14} height={14} viewBox="0 0 24 24">
                <Path d="M9 18l6-6-6-6" stroke={colors.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </Svg>
            </View>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
      <View style={styles.footerOrnament}>
        <StarOrnament size={12} color={colors.accent} opacity={0.2} />
      </View>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <FlatList
        data={surah.ayahs}
        renderItem={renderAyah}
        keyExtractor={(item) => String(item.number_in_surah)}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 32,
    gap: 24,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  navText: {
    fontSize: 14,
  },
  footerOrnament: {
    alignItems: "center",
  },
});
