import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";
import "../global.css";

// On web the splash screen API is a no-op — guard it so it never blocks render
if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

function RootLayoutInner() {
  const { colors, isDark } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [fontsReady, setFontsReady] = useState(Platform.OS === "web");
  const [fontsLoaded, fontsError] = Font.useFonts({
    "Amiri-Regular": require("../assets/fonts/Amiri-Regular.ttf"),
    "Amiri-Bold": require("../assets/fonts/Amiri-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    try {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    } catch (_) {
      // AccessibilityInfo is unavailable on web
    }
    let sub: ReturnType<typeof AccessibilityInfo.addEventListener> | null = null;
    try {
      sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    } catch (_) {
      // Not supported on web
    }
    return () => {
      sub?.remove();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      if (fontsError) {
        console.error("Font loading failed:", fontsError);
      }
      setFontsReady(true);
      if (Platform.OS !== "web") {
        SplashScreen.hideAsync().catch(() => {});
      }
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsReady) return null;

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: reduceMotion ? "none" : "fade_from_bottom",
          animationDuration: 250,
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RootLayoutInner />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
