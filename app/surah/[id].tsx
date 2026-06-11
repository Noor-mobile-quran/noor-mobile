import { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  type ViewToken,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { useSurah } from "../../hooks/useQuranData";
import { useAppStore } from "../../store/useAppStore";
import { useNoorAudioPlayer } from "../../hooks/useAudioPlayer";
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
  const markSurahComplete = useAppStore((s) => s.markSurahComplete);
  const unmarkSurahComplete = useAppStore((s) => s.unmarkSurahComplete);
  const isSurahCompleted = useAppStore((s) =>
    s.progress.completedSurahs.includes(surahNum),
  );
  const audioPlaying = useAppStore((s) => s.audioPlaying);
  const currentAudioAyah = useAppStore((s) => s.currentAudioAyah);

  const uxMode = useAppStore((s) => s.settings.uxMode);
  const translationLang = useAppStore((s) => s.settings.translationLang);

  const { play, stop } = useNoorAudioPlayer();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tafsirVisible, setTafsirVisible] = useState(false);
  const [continuousPlay, setContinuousPlay] = useState(false);
  const autoAdvanceRef = useRef(true);
  const progressRecorderRef = useRef({ surahNum, recordReading });
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const isImmersive = uxMode === "immersive";
  const isStudy = uxMode === "study";

  // Configure header — show surah name, hide in immersive
  useEffect(() => {
    navigation.setOptions({
      headerShown: !isImmersive,
      title: surah ? `${surah.name_english}` : "",
      headerTintColor: colors.textGold,
      headerBackVisible: true,
      headerBackTitle: "Back",
      headerStyle: { backgroundColor: colors.bg },
      headerTitleStyle: {
        fontFamily: fonts.latin.semiBold,
        fontSize: 16,
        color: colors.textPrimary,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            minWidth: 44,
            minHeight: 44,
            justifyContent: "center",
            paddingRight: 8,
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M15 18l-6-6 6-6"
              stroke={colors.textGold}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </TouchableOpacity>
      ),
    });
  }, [isImmersive, navigation, surah, colors, router]);

  // Load bookmarks
  useEffect(() => {
    setBookmarks(storage.getBookmarks());
  }, []);

  useEffect(() => {
    progressRecorderRef.current = { surahNum, recordReading };
  }, [surahNum, recordReading]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<Ayah>[] }) => {
      const firstVisible = viewableItems.find(
        (item) => item.isViewable && item.item,
      )?.item;

      if (firstVisible) {
        const {
          surahNum: currentSurahNum,
          recordReading: recordCurrentReading,
        } = progressRecorderRef.current;
        recordCurrentReading(currentSurahNum, firstVisible.number_in_surah);
      }
    },
  ).current;

  const playAyahAudio = useCallback(
    async (ayah: Ayah) => {
      autoAdvanceRef.current = true;
      recordReading(surahNum, ayah.number_in_surah);
      await play({
        globalAyah: ayah.number,
        displayAyah: ayah.number_in_surah,
        audioUrl: ayah.audio_url,
      });
    },
    [play, recordReading, surahNum],
  );

  // Auto-advance: when continuous play is active (or immersive), play next ayah when current finishes
  useEffect(() => {
    if ((!continuousPlay && !isImmersive) || !surah || audioPlaying) return;
    if (currentAudioAyah && autoAdvanceRef.current) {
      const idx = surah.ayahs.findIndex(
        (a) => a.number_in_surah === currentAudioAyah,
      );
      if (idx >= 0 && idx < surah.ayahs.length - 1) {
        const nextAyah = surah.ayahs[idx + 1];
        playAyahAudio(nextAyah);
      } else {
        autoAdvanceRef.current = false;
        setContinuousPlay(false);
        markSurahComplete(surahNum);
      }
    }
  }, [
    continuousPlay,
    isImmersive,
    audioPlaying,
    currentAudioAyah,
    markSurahComplete,
    playAyahAudio,
    surah,
    surahNum,
  ]);

  const playSurah = useCallback(() => {
    if (!surah || surah.ayahs.length === 0) return;
    setContinuousPlay(true);
    playAyahAudio(surah.ayahs[0]);
  }, [surah, playAyahAudio]);

  const stopSurah = useCallback(() => {
    setContinuousPlay(false);
    autoAdvanceRef.current = false;
    stop();
    autoAdvanceRef.current = true;
  }, [stop]);

  const isBookmarked = useCallback(
    (ayahNum: number) =>
      bookmarks.some((b) => b.surah === surahNum && b.ayah === ayahNum),
    [bookmarks, surahNum],
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
    [isBookmarked, surahNum],
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
    [surahNum],
  );

  const getNote = useCallback(
    (ayahNum: number) =>
      bookmarks.find((b) => b.surah === surahNum && b.ayah === ayahNum)?.note,
    [bookmarks, surahNum],
  );

  const surahBookmarkCount = bookmarks.filter(
    (b) => b.surah === surahNum,
  ).length;

  const playAyah = useCallback(
    async (ayah: Ayah) => {
      if (audioPlaying && currentAudioAyah === ayah.number_in_surah) {
        autoAdvanceRef.current = false;
        await stop();
        autoAdvanceRef.current = true;
        return;
      }

      await playAyahAudio(ayah);
    },
    [audioPlaying, currentAudioAyah, playAyahAudio, stop],
  );

  const renderAyah = useCallback(
    ({ item }: { item: Ayah }) => (
      <View>
        <AyahCard
          ayah={item}
          isPlaying={audioPlaying && currentAudioAyah === item.number_in_surah}
          onPlay={() => playAyah(item)}
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
    [
      audioPlaying,
      currentAudioAyah,
      playAyah,
      toggleBookmark,
      isBookmarked,
      uxMode,
      translationLang,
      isStudy,
      surahNum,
      getNote,
      saveNote,
      surah,
    ],
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
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: fonts.latin.regular,
          }}
        >
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
            <Text
              style={[
                styles.studyBarText,
                { color: colors.textSecondary, fontFamily: fonts.latin.medium },
              ]}
            >
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
            <Text
              style={[
                styles.tafsirButtonText,
                { color: colors.textGold, fontFamily: fonts.latin.medium },
              ]}
            >
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
      <TouchableOpacity
        onPress={() =>
          isSurahCompleted
            ? unmarkSurahComplete(surahNum)
            : markSurahComplete(surahNum)
        }
        style={[
          styles.completeButton,
          {
            backgroundColor: isSurahCompleted
              ? `${colors.accent}18`
              : colors.surface,
            borderColor: isSurahCompleted ? colors.accent : colors.border,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={
          isSurahCompleted
            ? "Mark this surah as not complete"
            : "Mark this surah complete"
        }
      >
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path
            d="M20 6L9 17l-5-5"
            stroke={isSurahCompleted ? colors.accent : colors.textSecondary}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
        <Text
          style={[
            styles.completeButtonText,
            {
              color: isSurahCompleted ? colors.textGold : colors.textSecondary,
              fontFamily: fonts.latin.medium,
            },
          ]}
        >
          {isSurahCompleted ? "Marked complete" : "Mark complete"}
        </Text>
      </TouchableOpacity>
      <View style={styles.navRow}>
        {surahNum > 1 ? (
          <TouchableOpacity
            onPress={() => router.push(`/surah/${surahNum - 1}`)}
            style={[styles.navButton, { borderColor: colors.border }]}
            accessibilityLabel="Previous Surah"
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Svg width={14} height={14} viewBox="0 0 24 24">
                <Path
                  d="M15 18l-6-6 6-6"
                  stroke={colors.accent}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
              <Text
                style={[
                  styles.navText,
                  { color: colors.textGold, fontFamily: fonts.latin.medium },
                ]}
              >
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
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Text
                style={[
                  styles.navText,
                  { color: colors.textGold, fontFamily: fonts.latin.medium },
                ]}
              >
                Next Surah
              </Text>
              <Svg width={14} height={14} viewBox="0 0 24 24">
                <Path
                  d="M9 18l6-6-6-6"
                  stroke={colors.accent}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
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
      {/* Custom header bar — always visible on all platforms */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: isImmersive ? 6 : 10,
          backgroundColor: isImmersive ? "transparent" : colors.bg,
          borderBottomWidth: isImmersive ? 0 : 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            minWidth: 44,
            minHeight: 44,
            justifyContent: "center",
            alignItems: "center",
            paddingRight: 8,
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path
              d="M15 18l-6-6 6-6"
              stroke={colors.textGold}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </TouchableOpacity>
        {!isImmersive && (
          <Text
            style={{
              flex: 1,
              fontFamily: fonts.latin.semiBold,
              fontSize: 16,
              color: colors.textPrimary,
            }}
            numberOfLines={1}
          >
            {surah.name_english}
          </Text>
        )}
        {/* Play / Stop Surah button */}
        <TouchableOpacity
          onPress={continuousPlay ? stopSurah : playSurah}
          style={{
            minWidth: 44,
            minHeight: 44,
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 8,
          }}
          accessibilityRole="button"
          accessibilityLabel={
            continuousPlay ? "Stop surah playback" : "Play entire surah"
          }
        >
          {continuousPlay ? (
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path d="M6 4h4v16H6zM14 4h4v16h-4z" fill={colors.textGold} />
            </Svg>
          ) : (
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path d="M8 5v14l11-7z" fill={colors.textGold} />
            </Svg>
          )}
        </TouchableOpacity>
      </View>
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
                <FlowerOrnament
                  size={32}
                  color={colors.accent}
                  opacity={0.04}
                />
              </View>
            )),
          )}
        </View>
      )}

      <FlatList
        data={surah.ayahs}
        renderItem={renderAyah}
        keyExtractor={(item) => String(item.number_in_surah)}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
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
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
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
            <Text
              style={[
                styles.modalTitle,
                { color: colors.textPrimary, fontFamily: fonts.latin.semiBold },
              ]}
            >
              Tafsir
            </Text>
            <Text
              style={[
                styles.modalSubtitle,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.latin.regular,
                },
              ]}
            >
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
  completeButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  completeButtonText: {
    fontSize: 14,
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
