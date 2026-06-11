import { View, Text, Pressable, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import type { FallbackProps } from "react-error-boundary";
import { fonts } from "../theme/typography";

interface ErrorFallbackProps extends FallbackProps {
  title?: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "An unexpected error occurred.";
}

export function logBoundaryError(error: unknown, info: unknown) {
  console.error("Noor error boundary caught an error:", error, info);
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
}: ErrorFallbackProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.iconWrap}>
        <Svg width={34} height={34} viewBox="0 0 24 24" accessible={false}>
          <Circle
            cx={12}
            cy={12}
            r={9}
            stroke="#D4A843"
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M12 7v6M12 16.5h.01"
            stroke="#D4A843"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>
        Noor ran into an unexpected problem. You can retry now.
      </Text>
      {__DEV__ ? (
        <Text style={styles.debugMessage} numberOfLines={3}>
          {getErrorMessage(error)}
        </Text>
      ) : null}
      <Pressable
        onPress={resetErrorBoundary}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Retry"
      >
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFF9ED",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF3D6",
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.latin.semiBold,
    fontSize: 18,
    color: "#2D261C",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontFamily: fonts.latin.regular,
    fontSize: 14,
    lineHeight: 20,
    color: "#6B5B45",
    textAlign: "center",
  },
  debugMessage: {
    fontFamily: fonts.latin.regular,
    fontSize: 12,
    lineHeight: 16,
    color: "#6B5B45",
    textAlign: "center",
    marginTop: 12,
    opacity: 0.75,
  },
  button: {
    minWidth: 120,
    minHeight: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B4332",
    paddingHorizontal: 18,
    marginTop: 20,
  },
  buttonText: {
    fontFamily: fonts.latin.semiBold,
    fontSize: 14,
    color: "#FFF9ED",
  },
});
