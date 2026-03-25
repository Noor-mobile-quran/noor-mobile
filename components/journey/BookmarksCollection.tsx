import React, { useCallback, useMemo, useState } from "react";
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Path, Circle, G } from "react-native-svg";
import { useRouter } from "expo-router";
import { useTheme } from "../../theme/ThemeProvider";
import { useSurahList } from "../../hooks/useQuranData";
import { storage } from "../../lib/storage";
import type { Bookmark } from "../../types";

// ---------------------------------------------------------------------------
// SVG Icons (no emoji)
// ---------------------------------------------------------------------------

function BookmarkIcon({
  size = 20,
  color = "#D4A843",
  filled = true,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18l-7-4-7 4V4z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function StarOrnament({ size = 64, color = "#D4A843" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <G opacity={0.6}>
        <Path
          d="M32 4l6.9 14 15.5 2.3-11.2 10.9 2.6 15.4L32 39.4l-13.8 7.2 2.6-15.4L9.6 20.3 25.1 18z"
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <Circle cx={32} cy={32} r={6} fill={color} opacity={0.3} />
      </G>
    </Svg>
  );
}

function DeleteIcon({ size = 18, color = "#C0392B" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FilterTab = "all" | "with-notes";

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (weeks === 1) return "1 week ago";
  if (weeks < 5) return `${weeks} weeks ago`;
  return new Date(timestamp).toLocaleDateString();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BookmarksCollection() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data: surahs } = useSurahList();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => storage.getBookmarks());

  // Reduce motion check (safe for web)
  const [reduceMotion, setReduceMotion] = useState(false);
  React.useEffect(() => {
    if (Platform.OS === "web") return;
    try {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
      const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
      return () => sub?.remove();
    } catch {
      // AccessibilityInfo not available
    }
  }, []);

  const surahMap = useMemo(() => {
    if (!surahs) return new Map<number, { arabic: string; english: string }>();
    return new Map(
      surahs.map((s) => [s.number, { arabic: s.name_arabic, english: s.name_english }])
    );
  }, [surahs]);

  const filtered = useMemo(() => {
    const sorted = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);
    if (activeTab === "with-notes") return sorted.filter((b) => !!b.note);
    return sorted;
  }, [bookmarks, activeTab]);

  const handleDelete = useCallback(
    (surah: number, ayah: number) => {
      storage.removeBookmark(surah, ayah);
      setBookmarks(storage.getBookmarks());
      setConfirmDeleteKey(null);
    },
    []
  );

  const handlePress = useCallback(
    (surah: number) => {
      router.push(`/surah/${surah}` as const);
    },
    [router]
  );

  const bookmarkKey = (b: Bookmark) => `${b.surah}-${b.ayah}`;

  // -----------------------------------------------------------------------
  // Styles (theme-driven)
  // -----------------------------------------------------------------------
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
        header: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          gap: 8,
        },
        headerTitle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 18,
          color: colors.textPrimary,
          flex: 1,
        },
        badge: {
          backgroundColor: colors.gold,
          borderRadius: 10,
          minWidth: 24,
          height: 24,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 6,
        },
        badgeText: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 12,
          color: "#FFF9ED",
        },
        tabRow: {
          flexDirection: "row",
          marginBottom: 16,
          gap: 8,
        },
        tab: {
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
          minHeight: 44,
          justifyContent: "center",
          alignItems: "center",
        },
        tabActive: {
          backgroundColor: colors.gold,
          borderColor: colors.gold,
        },
        tabText: {
          fontFamily: "Inter_500Medium",
          fontSize: 14,
          color: colors.textSecondary,
        },
        tabTextActive: {
          color: "#FFF9ED",
        },
        card: {
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: colors.border,
        },
        cardRow: {
          flexDirection: "row",
          alignItems: "flex-start",
        },
        cardContent: { flex: 1, marginRight: 12 },
        surahArabic: {
          fontFamily: "Amiri_700Bold",
          fontSize: 18,
          color: colors.textPrimary,
          textAlign: "right",
          writingDirection: "rtl",
        },
        surahEnglish: {
          fontFamily: "Inter_500Medium",
          fontSize: 14,
          color: colors.textPrimary,
          marginTop: 2,
        },
        ayahLabel: {
          fontFamily: "Inter_400Regular",
          fontSize: 13,
          color: colors.textSecondary,
          marginTop: 2,
        },
        note: {
          fontFamily: "Inter_400Regular",
          fontSize: 13,
          color: colors.textSecondary,
          marginTop: 6,
          lineHeight: 18,
        },
        timeText: {
          fontFamily: "Inter_400Regular",
          fontSize: 12,
          color: colors.textSecondary,
          marginTop: 6,
          opacity: 0.7,
        },
        iconCol: {
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 2,
        },
        confirmRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: 10,
          gap: 12,
        },
        confirmText: {
          fontFamily: "Inter_500Medium",
          fontSize: 13,
          color: "#C0392B",
        },
        cancelText: {
          fontFamily: "Inter_500Medium",
          fontSize: 13,
          color: colors.textSecondary,
        },
        emptyContainer: {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 48,
        },
        emptyText: {
          fontFamily: "Inter_400Regular",
          fontSize: 15,
          color: colors.textSecondary,
          marginTop: 16,
        },
      }),
    [colors]
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BookmarkIcon size={22} color={colors.gold} filled />
        <Text style={styles.headerTitle}>Bookmarks &amp; Notes</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{bookmarks.length}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {(["all", "with-notes"] as FilterTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === "all" ? "All" : "With Notes";
          return (
            <Pressable
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filter: ${label}`}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* List or Empty State */}
      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <StarOrnament size={64} color={colors.gold} />
          <Text style={styles.emptyText}>
            {activeTab === "with-notes"
              ? "No bookmarks with notes"
              : "No bookmarks yet"}
          </Text>
        </View>
      ) : (
        filtered.map((bm) => {
          const key = bookmarkKey(bm);
          const surah = surahMap.get(bm.surah);
          const isConfirming = confirmDeleteKey === key;

          return (
            <Pressable
              key={key}
              style={styles.card}
              onPress={() => handlePress(bm.surah)}
              onLongPress={() => setConfirmDeleteKey(key)}
              accessibilityRole="button"
              accessibilityLabel={`${surah?.english ?? `Surah ${bm.surah}`}, Ayah ${bm.ayah}${bm.note ? `, Note: ${bm.note}` : ""}`}
              accessibilityHint="Tap to read, long press to delete"
            >
              <View style={styles.cardRow}>
                <View style={styles.cardContent}>
                  {surah && (
                    <Text
                      style={styles.surahArabic}
                      accessibilityLanguage="ar"
                    >
                      {surah.arabic}
                    </Text>
                  )}
                  <Text style={styles.surahEnglish}>
                    {surah?.english ?? `Surah ${bm.surah}`}
                  </Text>
                  <Text style={styles.ayahLabel}>Ayah {bm.ayah}</Text>
                  {bm.note ? (
                    <Text style={styles.note} numberOfLines={2}>
                      {bm.note}
                    </Text>
                  ) : null}
                  <Text style={styles.timeText}>
                    {getRelativeTime(bm.timestamp)}
                  </Text>
                </View>
                <View style={styles.iconCol}>
                  <BookmarkIcon size={20} color={colors.gold} filled />
                </View>
              </View>

              {/* Inline delete confirmation */}
              {isConfirming && (
                <View style={styles.confirmRow}>
                  <Pressable
                    onPress={() => setConfirmDeleteKey(null)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel delete"
                    style={{ minHeight: 44, justifyContent: "center" }}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(bm.surah, bm.ayah)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove bookmark for ${surah?.english ?? `Surah ${bm.surah}`} Ayah ${bm.ayah}`}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      minHeight: 44,
                      justifyContent: "center",
                    }}
                  >
                    <DeleteIcon size={16} color="#C0392B" />
                    <Text style={styles.confirmText}>Remove?</Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}
