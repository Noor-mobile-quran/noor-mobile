import { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
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
import { NotesInput } from "../../components/NotesInput";
import { StarOrnament, FlowerOrnament } from "../../components/ornaments";
import type { Ayah, Bookmark } from "../../types";

export default function ReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahNum = Number(id);
  const router = useRouter();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { data: surah, isLoading, error } = useSurah(surahNum);
  const recordReading = useAppStore((s) => s.recordReading);
  const audioPlaying = useAppStore((s) => s.audioPlaying);
  const currentAudioAyah = useAppStore((s) => s.currentAudioAyah);

  const uxMode = useAppStore((s) => s.settings.uxMode);
  const translationLang = useAppStore((s) => s.settings.translationLang);

  const { play, stop } = useAudioPlayer();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tafsirVisible, setTafsirVisible] = useState(false);
  const autoAdvanceRef = useRef(true);

  const isImmersive = uxMode === "immersive";
  const isStudy = uxMode === "study";

  // Hide header in immersive mode
  useEffect(() => {
    navigation.setOptions({ headerShown: !isImmersive });
  }, [isImmersive, navigation]);

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

  // Auto-advance: in immersive mode, when current ayah finishes, play the next
  useEffect(() => {
    if (!isImmersive || !surah || audioPlaying) return;
    if (currentAudioAyah && autoAdvanceRef.current) {
      const idx = surah.ayahs.findIndex(
        (a) => a.number_in_surah === currentAudioAyah
      );
      if (idx >= 0 && idx < surah.ayahs.length - 1) {
        const nextAyah = surah.ayahs[idx + 1];
        play(nextAyah.number_in_surah);
      }
    }
  }, [isImmersive, audioPlaying, currentAudioAyah, surah, play]);

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

  const saveNote = useCallback(
    (ayahNum: number, note: string) => {
      storage.addBookmark({
        surah: surahNum,
        ayah: ayahNum,
        timestamp: Date.now(),
        note,
      });
      setBookmarks(storage.getBookmarks());
    },
    [surahNum]
  );

  const getNote = useCallback(
    (ayahNum: number) =>
      bookmarks.find((b) => b.surah === surahNum && b.ayah === ayahNum)?.note,
    [bookmarks, surahNum]
  );

  const surahBookmarkCount = bookmarks.filter((b) => b.surah === surahNum).length;

  const playAyah = useCallback(
    async (ayahNumber: number) => {
      if (audioPlaying && currentAudioAyah === ayahNumber) {
        autoAdvanceRef.current = false;
        await stop();
        autoAdvanceRef.current = true;
        return;
      }

      await play(ayahNumber);
    },
    [audioPlaying, currentAudioAyah, play, stop]
  );

  const renderAyah = useCallback(
    ({ item }: { item: Ayah }) => (
      <View>
        <AyahCard
          ayah={item}
          isPlaying={audioPlaying && currentAudioAyah === item.number_in_surah}
          onPlay={() => playAyah(item.number_in_surah)}
          onBookmark={() => toggleBookmark(item.number_in_surah)}
          isBookmarked={isBookmarked(item.number_in_surah)}
          uxMode={uxMode}
          translationLang={translationLang}
          surahName={surah?.name_english}
          surahNameArabic={surah?.name_arabic}
        />
        {isStudy && (
          <NotesInput
            surah={surahNum}
            ayah={item.number_in_surah}
            existingNote={getNote(item.number_in_surah)}
            onSave={(note) => saveNote(item.number_in_surah, note)}
          />
        )}
      </View>
    ),
    [audioPlaying, currentAudioAyah, playAyah, toggleBookmark, isBookmarked, uxMode, translationLang, isStudy, surahNum, getNote, saveNote]
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
      {isStudy && (
        <View style={styles.studyBar}>
          <View style={styles.studyBarLeft}>
            <Svg width={14} height={14} viewBox="0 0 24 24">
              <Path
                d="M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2z"
                stroke={colors.accent}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
            <Text style={[styles.studyBarText, { color: colors.textSecondary, fontFamily: fonts.latin.medium }]}>
              {surahBookmarkCount} bookmarked
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setTafsirVisible(true)}
            style={[styles.tafsirButton, { borderColor: colors.border }]}
            accessibilityLabel="Open Tafsir"
            accessibilityRole="button"
          >
            <Svg width={14} height={14} viewBox="0 0 24 24">
              <Path
                d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V5a2 2 0 012-2h14v14H6.5A2.5 2.5 0 004 19.5z"
                stroke={colors.accent}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
            <Text style={[styles.tafsirButtonText, { color: colors.accent, fontFamily: fonts.latin.medium }]}>
              Tafsir
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
      {/* Immersive: subtle Islamic pattern background */}
      {isImmersive && (
        <View style={styles.patternBackground} pointerEvents="none">
          {[0, 1, 2, 3, 4, 5].map((row) =>
            [0, 1, 2].map((col) => (
              <View
                key={`${row}-${col}`}
                style={{
                  position: "absolute",
                  top: row * 180 + 40,
                  left: col * 140 + (row % 2 === 0 ? 0 : 70),
                }}
              >
                <FlowerOrnament size={32} color={colors.accent} opacity={0.04} />
              </View>
            ))
          )}
        </View>
      )}

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

      {/* Tafsir Coming Soon Modal */}
      <Modal
        visible={tafsirVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTafsirVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTafsirVisible(false)}
          accessibilityLabel="Close tafsir modal"
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V5a2 2 0 012-2h14v14H6.5A2.5 2.5 0 004 19.5z"
                stroke={colors.accent}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
            <Text style={[styles.modalTitle, { color: colors.textPrimary, fontFamily: fonts.latin.semiBold }]}>
              Tafsir
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary, fontFamily: fonts.latin.regular }]}>
              Coming Soon
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
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
  studyBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingTop: 12,
  },
  studyBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  studyBarText: {
    fontSize: 13,
  },
  tafsirButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  tafsirButtonText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 40,
    paddingVertical: 32,
    borderRadius: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
  },
  modalSubtitle: {
    fontSize: 14,
  },
  patternBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
});
