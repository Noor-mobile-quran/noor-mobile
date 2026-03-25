import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "../../store/useAppStore";
import { useSurahList } from "../../hooks/useQuranData";
import { storage } from "../../lib/storage";
import { useTheme } from "../../theme/ThemeProvider";
import { fonts } from "../../theme/typography";
import { Crescent, StarOrnament, OrnamentalDivider } from "../../components/ornaments";
import type { Bookmark } from "../../types";

export default function ProgressScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const progress = useAppStore((s) => s.progress);
  const { data: surahs } = useSurahList();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(storage.getBookmarks());
  }, []);

  const completionPct = surahs
    ? Math.round((progress.completedSurahs.length / 114) * 100)
    : 0;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.forest }]}>
        <Crescent size={64} color={colors.gold} opacity={0.08} />
        <Text style={[styles.headerTitle, { fontFamily: fonts.latin.bold }]}>
          Your Journey
        </Text>
        <Text style={[styles.headerSubtitle, { fontFamily: fonts.latin.regular }]}>
          Every ayah brings you closer
        </Text>
        <OrnamentalDivider width="compact" />
      </View>

      <View style={styles.content}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.gold, fontFamily: fonts.latin.bold }]}>
              {progress.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.latin.regular }]}>
              Current Streak
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.gold, fontFamily: fonts.latin.bold }]}>
              {progress.longestStreak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.latin.regular }]}>
              Longest Streak
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.gold, fontFamily: fonts.latin.bold }]}>
              {completionPct}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.latin.regular }]}>
              Quran Completed
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.gold, fontFamily: fonts.latin.bold }]}>
              {bookmarks.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.latin.regular }]}>
              Saved Ayahs
            </Text>
          </View>
        </View>

        {/* Quran Progress Bar */}
        <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
          <View style={styles.progressHeader}>
            <Text
              style={[
                styles.progressTitle,
                { color: colors.textSecondary, fontFamily: fonts.latin.semiBold },
              ]}
            >
              QURAN PROGRESS
            </Text>
            <Text style={[styles.progressCount, { color: colors.gold, fontFamily: fonts.latin.medium }]}>
              {progress.completedSurahs.length}/114 Surahs
            </Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: `${colors.textSecondary}15` }]}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(2, completionPct)}%` },
              ]}
            />
          </View>
          <Text
            style={[
              styles.progressMessage,
              { color: colors.textSecondary, fontFamily: fonts.latin.regular },
            ]}
          >
            {completionPct === 0
              ? "Begin your journey — every ayah counts"
              : `MashaAllah — ${completionPct}% complete`}
          </Text>
        </View>

        {/* Ornamental divider */}
        <OrnamentalDivider />

        {/* Saved Ayahs */}
        {bookmarks.length > 0 ? (
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textPrimary, fontFamily: fonts.latin.semiBold },
              ]}
            >
              Saved Ayahs
            </Text>
            <View style={styles.bookmarkList}>
              {bookmarks.map((b) => {
                const surah = surahs?.find((s) => s.number === b.surah);
                return (
                  <TouchableOpacity
                    key={`${b.surah}-${b.ayah}`}
                    onPress={() => router.push(`/surah/${b.surah}`)}
                    style={[
                      styles.bookmarkCard,
                      {
                        backgroundColor: colors.surface,
                        borderLeftColor: `${colors.gold}40`,
                      },
                    ]}
                    accessibilityLabel={`${surah?.name_english ?? `Surah ${b.surah}`}, Ayah ${b.ayah}`}
                  >
                    <View>
                      <Text
                        style={[
                          styles.bookmarkTitle,
                          { color: colors.textPrimary, fontFamily: fonts.latin.semiBold },
                        ]}
                      >
                        {surah?.name_english ?? `Surah ${b.surah}`}
                      </Text>
                      <Text
                        style={[
                          styles.bookmarkAyah,
                          { color: colors.textSecondary, fontFamily: fonts.latin.regular },
                        ]}
                      >
                        Ayah {b.ayah}
                      </Text>
                    </View>
                    <StarOrnament size={16} color={colors.gold} opacity={0.8} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text
              style={[
                styles.emptyText,
                { color: colors.textSecondary, fontFamily: fonts.latin.regular },
              ]}
            >
              No saved ayahs yet
            </Text>
            <Text
              style={[
                styles.emptyHint,
                { color: `${colors.textSecondary}80`, fontFamily: fonts.latin.regular },
              ]}
            >
              Bookmark ayahs while reading to see them here
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFF9ED",
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 249, 237, 0.6)",
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "47%",
    flexGrow: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: {
    fontSize: 12,
    letterSpacing: 1,
  },
  progressCount: {
    fontSize: 12,
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#1B4332",
  },
  progressMessage: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  bookmarkList: {
    gap: 8,
  },
  bookmarkCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
  },
  bookmarkTitle: {
    fontSize: 15,
  },
  bookmarkAyah: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
  },
  emptyHint: {
    fontSize: 12,
    marginTop: 4,
  },
});
