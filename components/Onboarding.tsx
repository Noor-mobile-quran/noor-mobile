import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { storage } from "../lib/storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Onboarding uses a fixed dark palette so it always shows on the branded
// dark background regardless of the user's chosen theme.
const COLORS = {
  bg: "#1A1410",
  surface: "#2D261C",
  surfaceElevated: "#3D3428",
  textPrimary: "#FFF9ED",
  textSecondary: "#D4B896",
  textGold: "#E8C547",
  accent: "#E8C547",
  accentBg: "#D4A843",
  border: "rgba(232, 197, 71, 0.15)",
  borderSelected: "#E8C547",
};

type LanguageOption = "arabic" | "arabic-english" | "english-arabic";
type StartOption = "fatiha" | "ikhlas" | "browse";

const LANGUAGE_OPTIONS: { id: LanguageOption; label: string }[] = [
  { id: "arabic", label: "Arabic only" },
  { id: "arabic-english", label: "Arabic + English" },
  { id: "english-arabic", label: "English + Arabic" },
];

const START_OPTIONS: {
  id: StartOption;
  label: string;
  subtitle: string;
  recommended?: boolean;
}[] = [
  {
    id: "fatiha",
    label: "Al-Fatiha",
    subtitle: "The Opening, 7 ayahs",
    recommended: true,
  },
  {
    id: "ikhlas",
    label: "Al-Ikhlas",
    subtitle: "Short and powerful, 4 ayahs",
  },
  {
    id: "browse",
    label: "Browse all surahs",
    subtitle: "Choose your own starting point",
  },
];

interface Props {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: Props) {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [currentScreen, setCurrentScreen] = useState(0);
  const [language, setLanguage] = useState<LanguageOption>("arabic-english");
  const [startOption, setStartOption] = useState<StartOption>("fatiha");

  const TOTAL_SCREENS = 3;

  function goToScreen(index: number) {
    const clampedIndex = Math.max(0, Math.min(TOTAL_SCREENS - 1, index));
    Animated.timing(slideAnim, {
      toValue: -clampedIndex * SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setCurrentScreen(clampedIndex);
  }

  function handleSkip() {
    completeOnboarding();
  }

  function completeOnboarding() {
    try {
      storage.setSettings({
        theme: "dark",
        uxMode: "serene",
        translationLang: language === "arabic" ? "none" : "en",
        reciterId: "mishary",
        fontSize: "md",
      });
    } catch (e) {
      console.warn("Failed to save onboarding settings:", e);
    }

    // Persist the onboarding flag directly via the raw storage layer
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("onboarding_complete", "true");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { MMKV } = require("react-native-mmkv");
        const mmkv = new MMKV({ id: "noor-storage" });
        mmkv.set("onboarding_complete", "true");
      }
    } catch (e) {
      console.warn("Failed to write onboarding_complete flag:", e);
    }

    onComplete();

    // Navigate to chosen destination
    if (startOption === "fatiha") {
      router.replace("/surah/1");
    } else if (startOption === "ikhlas") {
      router.replace("/surah/112");
    } else {
      router.replace("/(tabs)/surahs");
    }
  }

  function handleNext() {
    if (currentScreen < TOTAL_SCREENS - 1) {
      goToScreen(currentScreen + 1);
    } else {
      completeOnboarding();
    }
  }

  function handleBack() {
    if (currentScreen > 0) {
      goToScreen(currentScreen - 1);
    }
  }

  return (
    <View style={styles.root}>
      {/* Slides container */}
      <Animated.View
        style={[
          styles.slidesTrack,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Screen 1: Welcome */}
        <View style={styles.slide}>
          <View style={styles.slideContent}>
            <View style={styles.welcomeCenter}>
              <Text
                style={styles.arabicTitle}
                accessibilityLabel="Noor"
                {...(Platform.OS !== "web"
                  ? { accessibilityLanguage: "ar" }
                  : { lang: "ar" })}
              >
                نور
              </Text>
              <Text style={styles.tagline}>Your Quran Companion</Text>
            </View>
          </View>
        </View>

        {/* Screen 2: Language */}
        <View style={styles.slide}>
          <View style={styles.slideContent}>
            <Text style={styles.screenHeading}>
              How would you like to read?
            </Text>
            <View style={styles.cardList}>
              {LANGUAGE_OPTIONS.map((opt) => {
                const selected = language === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setLanguage(opt.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={opt.label}
                    style={[
                      styles.optionCard,
                      selected && styles.optionCardSelected,
                    ]}
                  >
                    <View style={styles.radioRow}>
                      <View
                        style={[
                          styles.radioOuter,
                          selected && styles.radioOuterSelected,
                        ]}
                      >
                        {selected && <View style={styles.radioInner} />}
                      </View>
                      <Text
                        style={[
                          styles.optionLabel,
                          selected && styles.optionLabelSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Screen 3: Starting Point */}
        <View style={styles.slide}>
          <View style={styles.slideContent}>
            <Text style={styles.screenHeading}>
              Where would you like to begin?
            </Text>
            <View style={styles.cardList}>
              {START_OPTIONS.map((opt) => {
                const selected = startOption === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setStartOption(opt.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={`${opt.label}, ${opt.subtitle}`}
                    style={[
                      styles.optionCard,
                      selected && styles.optionCardSelected,
                    ]}
                  >
                    <View style={styles.radioRow}>
                      <View
                        style={[
                          styles.radioOuter,
                          selected && styles.radioOuterSelected,
                        ]}
                      >
                        {selected && <View style={styles.radioInner} />}
                      </View>
                      <View style={styles.optionTextBlock}>
                        <View style={styles.optionLabelRow}>
                          <Text
                            style={[
                              styles.optionLabel,
                              selected && styles.optionLabelSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                          {opt.recommended && (
                            <View style={styles.recommendedBadge}>
                              <Text style={styles.recommendedText}>
                                Recommended
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Dot indicators */}
        <View style={styles.dotsRow} accessibilityLabel={`Step ${currentScreen + 1} of ${TOTAL_SCREENS}`}>
          {Array.from({ length: TOTAL_SCREENS }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, currentScreen === i && styles.dotActive]}
            />
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          {currentScreen === 0 ? (
            // Welcome screen: single centered Begin button
            <Pressable
              onPress={handleNext}
              accessibilityRole="button"
              accessibilityLabel="Begin onboarding"
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Begin</Text>
            </Pressable>
          ) : (
            // Screens 2 & 3: Back + Next/Start Reading
            <>
              <Pressable
                onPress={handleBack}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </Pressable>
              <Pressable
                onPress={handleNext}
                accessibilityRole="button"
                accessibilityLabel={
                  currentScreen === TOTAL_SCREENS - 1
                    ? "Start reading"
                    : "Next step"
                }
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  {currentScreen === TOTAL_SCREENS - 1 ? "Start Reading" : "Next"}
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Skip link */}
        <Pressable
          onPress={handleSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          style={styles.skipButton}
          hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
    overflow: "hidden",
  },

  // Slides
  slidesTrack: {
    flex: 1,
    flexDirection: "row",
    width: SCREEN_WIDTH * 3,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 16,
    justifyContent: "center",
  },

  // Screen 1 — Welcome
  welcomeCenter: {
    alignItems: "center",
    gap: 12,
  },
  arabicTitle: {
    fontFamily: "Amiri-Bold",
    fontSize: 72,
    color: COLORS.textGold,
    textAlign: "center",
    lineHeight: 88,
  },
  tagline: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: "#D4B896",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  // Screen 2 & 3 — headings
  screenHeading: {
    fontFamily: "Inter-SemiBold",
    fontSize: 22,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 30,
  },

  // Option cards
  cardList: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
    justifyContent: "center",
  },
  optionCardSelected: {
    borderColor: COLORS.borderSelected,
    backgroundColor: COLORS.surfaceElevated,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: COLORS.accent,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  optionTextBlock: {
    flex: 1,
    gap: 2,
  },
  optionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  optionLabelSelected: {
    color: COLORS.textPrimary,
  },
  optionSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  recommendedBadge: {
    backgroundColor: "rgba(232, 197, 71, 0.15)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  recommendedText: {
    fontFamily: "Inter-Medium",
    fontSize: 10,
    color: COLORS.textGold,
    letterSpacing: 0.3,
  },

  // Bottom controls
  bottomControls: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
    gap: 16,
    alignItems: "center",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 20,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  primaryButton: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.accentBg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1A1410",
    letterSpacing: 0.2,
  },
  secondaryButton: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  skipButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.textSecondary,
    textDecorationLine: "underline",
    textDecorationColor: COLORS.textSecondary,
  },
});
