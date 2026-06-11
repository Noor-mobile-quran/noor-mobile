import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useQuranSearch } from "../hooks/useQuranSearch";

async function renderSearchHook() {
  const rendered = await renderHook(() => useQuranSearch());
  await waitFor(() => expect(rendered.result.current).not.toBeNull());
  return rendered;
}

describe("useQuranSearch", () => {
  it("does not search until the query has at least three characters", async () => {
    const { result } = await renderSearchHook();

    await act(async () => {
      result.current!.setQuery("me");
    });

    expect(result.current!.results).toEqual([]);
    expect(result.current!.hasResults).toBe(false);
  });

  it("finds known English Quran text and returns ayah metadata", async () => {
    const { result } = await renderSearchHook();

    await act(async () => {
      result.current!.setQuery("merciful");
    });

    expect(result.current!.hasResults).toBe(true);
    expect(result.current!.results[0]).toMatchObject({
      surah: 1,
      surahName: "Al-Faatiha",
      ayah: 1,
    });
  });

  it("finds Arabic text without lowercasing or transliteration", async () => {
    const { result } = await renderSearchHook();

    await act(async () => {
      result.current!.setQuery("ٱللَّه");
    });

    expect(result.current!.results[0].textArabic).toContain("ٱللَّه");
  });
});
