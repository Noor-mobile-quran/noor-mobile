import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAppStore } from "../../store/useAppStore";
import { useTheme } from "../../theme/ThemeProvider";
import { fonts, fontSizes } from "../../theme/typography";
import { ArabicText } from "../../components/ui/ArabicText";
import {
  Crescent,
  StarOrnament,
  OrnamentalDivider,
} from "../../components/ornaments";
import { RECITERS } from "../../data/reciters";
import type { ThemeMode, UXMode } from "../../types";

const LANG_OPTIONS: { value: string; label: string; labelNative: string }[] = [
  { value: "en", label: "English", labelNative: "English" },
  { value: "ur", label: "Urdu", labelNative: "\u0627\u0631\u062F\u0648" },
];

const THEME_OPTIONS: {
  value: ThemeMode;
  label: string;
  desc: string;
  swatch: { bg: string; accent: string };
}[] = [
  {
    value: "light",
    label: "Light",
    desc: "Warm cream",
    swatch: { bg: "#FFF9ED", accent: "#D4A843" },
  },
  {
    value: "parchment",
    label: "Parchment",
    desc: "Aged paper",
    swatch: { bg: "#F5E6C8", accent: "#C49A3C" },
  },
  {
    value: "dark",
    label: "Dark",
    desc: "Warm midnight",
    swatch: { bg: "#1A1410", accent: "#E8C547" },
  },
  {
    value: "moonlight",
    label: "Moonlight",
    desc: "Cool night",
    swatch: { bg: "#1C2331", accent: "#7EB8DA" },
  },
  {
    value: "forest",
    label: "Forest",
    desc: "Deep emerald",
    swatch: { bg: "#0B2618", accent: "#D4A843" },
  },
  {
    value: "oled",
    label: "OLED",
    desc: "True black",
    swatch: { bg: "#000000", accent: "#D4A843" },
  },
  {
    value: "high-contrast",
    label: "Contrast",
    desc: "Max clarity",
    swatch: { bg: "#000000", accent: "#FFD700" },
  },
];

const UX_MODES: { value: UXMode; label: string; desc: string }[] = [
  { value: "serene", label: "Serene", desc: "Clean, peaceful reading" },
  {
    value: "immersive",
    label: "Immersive",
    desc: "Dark, atmospheric experience",
  },
  { value: "study", label: "Study", desc: "With tafsir and study tools" },
];

const FONT_SIZES: { value: "sm" | "md" | "lg" | "xl"; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra" },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const settings = useAppStore((s) => s.settings);
  const setTheme = useAppStore((s) => s.setTheme);
  const setFontSize = useAppStore((s) => s.setFontSize);
  const setUXMode = useAppStore((s) => s.setUXMode);
  const setTranslationLang = useAppStore((s) => s.setTranslationLang);
  const setReciter = useAppStore((s) => s.setReciter);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.forest }]}>
        <Crescent size={64} color={colors.accent} opacity={0.08} />
        <Text style={[styles.headerTitle, { fontFamily: fonts.latin.bold }]}>
          Settings
        </Text>
        <Text
          style={[styles.headerSubtitle, { fontFamily: fonts.latin.regular }]}
        >
          Customize your experience
        </Text>
      </View>

      <View style={styles.content}>
        {/* Theme Selector — 3 options including High Contrast */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text
            style={[
              styles.cardTitle,
              { color: colors.textSecondary, fontFamily: fonts.latin.semiBold },
            ]}
          >
            APPEARANCE
          </Text>
          <View style={styles.themeGrid}>
            {THEME_OPTIONS.map((opt) => {
              const isActive = settings.theme === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setTheme(opt.value)}
                  style={[
                    styles.themeCard,
                    {
                      backgroundColor: isActive
                        ? `${colors.accent}15`
                        : colors.bg,
                      borderColor: isActive ? colors.accent : colors.border,
                      borderWidth: 1.5,
                    },
                  ]}
                  accessibilityLabel={`${opt.label} theme: ${opt.desc}`}
                  accessibilityState={{ selected: isActive }}
                >
                  <View style={styles.swatchRow}>
                    <View
                      style={[
                        styles.swatch,
                        {
                          backgroundColor: opt.swatch.bg,
                          borderColor: `${colors.textSecondary}30`,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.swatchAccent,
                          { backgroundColor: opt.swatch.accent },
                        ]}
                      />
                    </View>
                    {isActive && (
                      <StarOrnament
                        size={14}
                        color={colors.accent}
                        opacity={0.9}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.themeLabel,
                      {
                        color: isActive ? colors.accent : colors.textPrimary,
                        fontFamily: fonts.latin.medium,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={[
                      styles.themeDesc,
                      {
                        color: isActive
                          ? colors.accent
                          : `${colors.textSecondary}90`,
                        fontFamily: fonts.latin.regular,
                      },
                    ]}
                  >
                    {opt.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* UX Mode — Serene / Immersive / Study */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text
            style={[
              styles.cardTitle,
              { color: colors.textSecondary, fontFamily: fonts.latin.semiBold },
            ]}
          >
            READING MODE
          </Text>
          <View style={styles.modeList}>
            {UX_MODES.map((opt) => {
              const isActive = settings.uxMode === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setUXMode(opt.value)}
                  style={[
                    styles.modeButton,
                    {
                      backgroundColor: isActive
                        ? `${colors.accent}15`
                        : "transparent",
                      borderColor: isActive
                        ? `${colors.accent}40`
                        : "transparent",
                      borderWidth: isActive ? 1 : 0,
                    },
                  ]}
                  accessibilityLabel={`${opt.label} mode: ${opt.desc}`}
                  accessibilityState={{ selected: isActive }}
                >
                  <StarOrnament
                    size={16}
                    color={isActive ? colors.accent : colors.textSecondary}
                    opacity={isActive ? 0.8 : 0.3}
                  />
                  <View style={styles.modeTextContainer}>
                    <Text
                      style={[
                        styles.modeLabel,
                        {
                          color: isActive ? colors.accent : colors.textPrimary,
                          fontFamily: fonts.latin.medium,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={[
                        styles.modeDesc,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.latin.regular,
                        },
                      ]}
                    >
                      {opt.desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Font Size with Arabic preview */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text
            style={[
              styles.cardTitle,
              { color: colors.textSecondary, fontFamily: fonts.latin.semiBold },
            ]}
          >
            ARABIC FONT SIZE
          </Text>

          {/* Live Arabic preview */}
          <View style={[styles.previewBox, { backgroundColor: colors.bg }]}>
            <ArabicText
              style={{ color: colors.textPrimary, textAlign: "center" }}
            >
              بِسْمِ اللَّهِ
            </ArabicText>
          </View>

          <View style={styles.fontSizeRow}>
            {FONT_SIZES.map((opt) => {
              const isActive = settings.fontSize === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setFontSize(opt.value)}
                  style={[
                    styles.fontSizeButton,
                    {
                      backgroundColor: isActive ? colors.accent : colors.bg,
                      shadowColor: isActive ? colors.accent : "transparent",
                      shadowOpacity: isActive ? 0.3 : 0,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 4 },
                    },
                  ]}
                  accessibilityLabel={`${opt.label} font size`}
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.arabic.regular,
                      fontSize: fontSizes[opt.value].arabic * 0.6,
                      color: isActive ? "#FFFFFF" : colors.textSecondary,
                    }}
                  >
                    ا
                  </Text>
                  <Text
                    style={[
                      styles.fontSizeLabel,
                      {
                        color: isActive ? "#FFFFFF" : colors.textSecondary,
                        fontFamily: fonts.latin.medium,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Language */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text
            style={[
              styles.cardTitle,
              { color: colors.textSecondary, fontFamily: fonts.latin.semiBold },
            ]}
          >
            LANGUAGE
          </Text>
          <View style={styles.modeList}>
            {LANG_OPTIONS.map((opt) => {
              const isActive = settings.translationLang === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setTranslationLang(opt.value)}
                  style={[
                    styles.modeButton,
                    {
                      backgroundColor: isActive
                        ? `${colors.accent}15`
                        : "transparent",
                      borderColor: isActive
                        ? `${colors.accent}40`
                        : "transparent",
                      borderWidth: isActive ? 1 : 0,
                    },
                  ]}
                  accessibilityLabel={`${opt.label} language`}
                  accessibilityState={{ selected: isActive }}
                >
                  <StarOrnament
                    size={16}
                    color={isActive ? colors.accent : colors.textSecondary}
                    opacity={isActive ? 0.8 : 0.3}
                  />
                  <View style={styles.modeTextContainer}>
                    <Text
                      style={[
                        styles.modeLabel,
                        {
                          color: isActive ? colors.accent : colors.textPrimary,
                          fontFamily: fonts.latin.medium,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={[
                        styles.modeDesc,
                        {
                          color: colors.textSecondary,
                          fontFamily:
                            opt.value === "ur"
                              ? fonts.arabic.regular
                              : fonts.latin.regular,
                          writingDirection: opt.value === "ur" ? "rtl" : "ltr",
                        },
                      ]}
                      {...(opt.value === "ur"
                        ? { accessibilityLanguage: "ur" }
                        : {})}
                    >
                      {opt.labelNative}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Reciter */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text
            style={[
              styles.cardTitle,
              { color: colors.textSecondary, fontFamily: fonts.latin.semiBold },
            ]}
          >
            RECITER
          </Text>
          <View style={styles.modeList}>
            {RECITERS.map((reciter) => {
              const isActive = settings.reciterId === reciter.id;
              return (
                <TouchableOpacity
                  key={reciter.id}
                  onPress={() => setReciter(reciter.id)}
                  style={[
                    styles.reciterCard,
                    {
                      backgroundColor: isActive
                        ? `${colors.accent}15`
                        : "transparent",
                      borderColor: isActive ? colors.accent : colors.border,
                      borderWidth: 1,
                    },
                  ]}
                  accessibilityLabel={`${reciter.name_english}, ${reciter.style}`}
                  accessibilityState={{ selected: isActive }}
                >
                  <View style={styles.modeTextContainer}>
                    <Text
                      style={[
                        styles.modeLabel,
                        {
                          color: isActive ? colors.accent : colors.textPrimary,
                          fontFamily: fonts.latin.medium,
                        },
                      ]}
                    >
                      {reciter.name_english}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.arabic.regular,
                        fontSize: 16,
                        color: isActive ? colors.accent : colors.textSecondary,
                        writingDirection: "rtl",
                        marginTop: 2,
                      }}
                      accessibilityLanguage="ar"
                    >
                      {reciter.name_arabic}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.styleBadge,
                      {
                        backgroundColor: isActive ? colors.accent : colors.bg,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.latin.medium,
                        fontSize: 11,
                        color: isActive ? "#FFFFFF" : colors.textSecondary,
                      }}
                    >
                      {reciter.style}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <OrnamentalDivider width="compact" />
          <ArabicText
            decorative
            style={{
              color: colors.textSecondary,
              textAlign: "center",
              opacity: 0.4,
            }}
          >
            الحمد لله
          </ArabicText>
          <Text
            style={[
              styles.footerText,
              { color: colors.textSecondary, fontFamily: fonts.latin.regular },
            ]}
          >
            Noor v1.0 — Built with reverence
          </Text>
        </View>
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
  card: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  cardTitle: {
    fontSize: 12,
    letterSpacing: 1,
  },
  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  themeCard: {
    width: "47%",
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  swatchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchAccent: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  themeLabel: {
    fontSize: 13,
  },
  themeDesc: {
    fontSize: 10,
  },
  modeList: {
    gap: 8,
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  modeDesc: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  previewBox: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  fontSizeRow: {
    flexDirection: "row",
    gap: 8,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  fontSizeLabel: {
    fontSize: 11,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
  reciterCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    minHeight: 44,
  },
  styleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
