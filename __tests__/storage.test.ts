import { storage } from "../lib/storage";

const mmkvMock = jest.requireMock("react-native-mmkv");

function rawNoorStore() {
  return mmkvMock.__getMMKVStore("noor-storage") as
    | Map<string, string>
    | undefined;
}

describe("storage", () => {
  beforeEach(() => {
    mmkvMock.__resetMMKV();
  });

  it("round-trips settings through versioned storage", () => {
    storage.setSettings({
      theme: "forest",
      uxMode: "study",
      translationLang: "ur",
      reciterId: "mishary",
      fontSize: "lg",
    });

    expect(storage.getSettings()).toEqual({
      theme: "forest",
      uxMode: "study",
      translationLang: "ur",
      reciterId: "mishary",
      fontSize: "lg",
    });

    const raw = JSON.parse(rawNoorStore()!.get("noor-settings")!);
    expect(raw).toMatchObject({ version: 1 });
    expect(raw.data.theme).toBe("forest");
  });

  it("normalizes older progress payloads and drops invalid values", () => {
    rawNoorStore()!.set(
      "noor-progress",
      JSON.stringify({
        lastReadSurah: 2,
        lastReadAyah: 255,
        lastReadDate: "2026-06-10",
        currentStreak: 9,
        longestStreak: 14,
        dailyGoal: Number.NaN,
        completedSurahs: [36, "bad", 2, 36],
      }),
    );

    expect(storage.getProgress()).toEqual({
      lastReadSurah: 2,
      lastReadAyah: 255,
      dailyGoal: 5,
      completedSurahs: [2, 36],
    });
  });

  it("deduplicates and removes bookmarks by surah and ayah", () => {
    storage.addBookmark({ surah: 1, ayah: 1, timestamp: 1, note: "A" });
    storage.addBookmark({ surah: 1, ayah: 1, timestamp: 2, note: "B" });
    storage.addBookmark({ surah: 2, ayah: 255, timestamp: 3 });

    expect(storage.getBookmarks()).toEqual([
      { surah: 1, ayah: 1, timestamp: 2, note: "B" },
      { surah: 2, ayah: 255, timestamp: 3 },
    ]);

    storage.removeBookmark(1, 1);

    expect(storage.getBookmarks()).toEqual([
      { surah: 2, ayah: 255, timestamp: 3 },
    ]);
  });
});
