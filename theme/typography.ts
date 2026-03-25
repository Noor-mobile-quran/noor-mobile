export const fonts = {
  arabic: {
    regular: "Amiri-Regular",
    bold: "Amiri-Bold",
  },
  latin: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
    bold: "Inter-Bold",
  },
};

export const fontSizes = {
  sm: { arabic: 20, latin: 14 },
  md: { arabic: 26, latin: 16 },
  lg: { arabic: 32, latin: 18 },
  xl: { arabic: 38, latin: 20 },
} as const;
