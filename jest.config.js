module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.(test|spec).ts?(x)"],
  collectCoverageFrom: [
    "lib/storage.ts",
    "store/useAppStore.ts",
    "hooks/useQuranSearch.ts",
    "hooks/useAudioPlayer.ts",
  ],
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    "lib/storage.ts": {
      lines: 80,
      statements: 80,
      functions: 80,
      branches: 70,
    },
    "store/useAppStore.ts": {
      lines: 80,
      statements: 80,
      functions: 80,
      branches: 70,
    },
    "hooks/useQuranSearch.ts": {
      lines: 60,
      statements: 60,
      functions: 60,
      branches: 60,
    },
    "hooks/useAudioPlayer.ts": {
      lines: 60,
      statements: 60,
      functions: 60,
      branches: 60,
    },
  },
};
