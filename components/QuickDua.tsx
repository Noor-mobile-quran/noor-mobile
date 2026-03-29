import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ArabicText } from "./ui/ArabicText";
import { useTheme } from "../theme/ThemeProvider";

const duas = [
  { arabic: "سُبْحَانَ اللَّهِ", transliteration: "SubhanAllah", meaning: "Glory be to Allah" },
  { arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah", meaning: "All praise is due to Allah" },
  { arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar", meaning: "Allah is the Greatest" },
  { arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", transliteration: "La ilaha illallah", meaning: "There is no god but Allah" },
  { arabic: "أَسْتَغْفِرُ اللَّهَ", transliteration: "Astaghfirullah", meaning: "I seek forgiveness from Allah" },
  { arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", transliteration: "La hawla wa la quwwata illa billah", meaning: "There is no power except with Allah" },
  { arabic: "بِسْمِ اللَّهِ", transliteration: "Bismillah", meaning: "In the name of Allah" },
  { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", transliteration: "Hasbunallahu wa ni'mal wakeel", meaning: "Allah is sufficient for us, and He is the best disposer of affairs" },
];

export default function QuickDua() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * duas.length));
  const { colors } = useTheme();
  const dua = duas[index];

  const next = () => setIndex((i) => (i + 1) % duas.length);

  return (
    <Pressable
      onPress={next}
      className="p-5 rounded-2xl items-center"
      style={{ backgroundColor: colors.surface }}
      accessibilityRole="button"
      accessibilityLabel={`Daily Dhikr: ${dua.meaning}. Tap for next.`}
      accessibilityHint="Double tap to show the next dhikr"
    >
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: "Inter-Regular",
          fontSize: 11,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Daily Dhikr — Tap for next
      </Text>
      <ArabicText
        variant="heading"
        style={{ color: colors.textGold, textAlign: "center" }}
      >
        {dua.arabic}
      </ArabicText>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: "Inter-Regular",
          fontSize: 14,
          fontStyle: "italic",
          marginTop: 8,
        }}
      >
        {dua.meaning}
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: "Inter-Regular",
          fontSize: 12,
          marginTop: 4,
          opacity: 0.7,
        }}
      >
        ({dua.transliteration})
      </Text>
    </Pressable>
  );
}
