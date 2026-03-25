import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "public", "data");
const SURAHS_DIR = join(DATA_DIR, "surahs");

mkdirSync(SURAHS_DIR, { recursive: true });

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const json = await res.json();
      if (json.code !== 200 || json.status !== "OK") {
        throw new Error(`API error: ${json.status} for ${url}`);
      }
      return json.data;
    } catch (err) {
      if (attempt < retries) {
        console.warn(`  Retry ${attempt + 1} for ${url}: ${err.message}`);
        await delay(1000);
      } else {
        throw err;
      }
    }
  }
}

async function fetchSurahList() {
  console.log("Fetching surah list...");
  const data = await fetchWithRetry("https://api.alquran.cloud/v1/surah");
  console.log(`  Got ${data.length} surahs`);
  return data;
}

async function fetchSurahData(number) {
  const [arabic, english] = await Promise.all([
    fetchWithRetry(`https://api.alquran.cloud/v1/surah/${number}/ar.alafasy`),
    fetchWithRetry(`https://api.alquran.cloud/v1/surah/${number}/en.sahih`),
  ]);
  return { arabic, english };
}

function buildSurahJson(meta, arabic, english) {
  const ayahs = arabic.ayahs.map((ar, i) => {
    const en = english.ayahs[i];
    return {
      number: ar.number,
      number_in_surah: ar.numberInSurah,
      text_arabic: ar.text,
      text_translation: en.text,
      juz: ar.juz,
      page: ar.page,
      audio_url: ar.audio,
    };
  });

  return {
    number: meta.number,
    name_arabic: meta.name,
    name_english: meta.englishName,
    name_translation: meta.englishNameTranslation,
    revelation_type: meta.revelationType.toLowerCase(),
    ayah_count: meta.numberOfAyahs,
    juz_start: ayahs[0]?.juz ?? 1,
    ayahs,
  };
}

function buildSurahMeta(meta, juzStart) {
  return {
    number: meta.number,
    name_arabic: meta.name,
    name_english: meta.englishName,
    name_translation: meta.englishNameTranslation,
    revelation_type: meta.revelationType.toLowerCase(),
    ayah_count: meta.numberOfAyahs,
    juz_start: juzStart,
  };
}

async function main() {
  const surahList = await fetchSurahList();
  const index = [];
  const BATCH_SIZE = 5;

  for (let i = 0; i < surahList.length; i += BATCH_SIZE) {
    const batch = surahList.slice(i, i + BATCH_SIZE);
    const batchNumbers = batch.map((s) => s.number);
    console.log(`Processing batch: surahs ${batchNumbers.join(", ")}...`);

    const results = await Promise.all(
      batch.map(async (meta) => {
        const { arabic, english } = await fetchSurahData(meta.number);
        return { meta, arabic, english };
      })
    );

    for (const { meta, arabic, english } of results) {
      const surahJson = buildSurahJson(meta, arabic, english);
      const filename = String(meta.number).padStart(3, "0") + ".json";
      writeFileSync(
        join(SURAHS_DIR, filename),
        JSON.stringify(surahJson, null, 2)
      );
      index.push(buildSurahMeta(meta, surahJson.juz_start));
      console.log(
        `  Surah ${meta.number} (${meta.englishName}): ${meta.numberOfAyahs} ayahs`
      );
    }

    // Delay between batches to be respectful to the API
    if (i + BATCH_SIZE < surahList.length) {
      await delay(200);
    }
  }

  // Sort index by surah number
  index.sort((a, b) => a.number - b.number);

  writeFileSync(
    join(DATA_DIR, "surah-index.json"),
    JSON.stringify(index, null, 2)
  );

  console.log(`\nDone! Wrote ${index.length} surahs.`);
  console.log(`  Index: ${join(DATA_DIR, "surah-index.json")}`);
  console.log(`  Surahs: ${SURAHS_DIR}/`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
