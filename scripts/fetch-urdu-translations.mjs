import fs from 'fs';
import path from 'path';

const API = 'https://api.alquran.cloud/v1/quran/ur.ahmedali';

async function main() {
  console.log('Fetching Urdu translations...');
  const res = await fetch(API);
  const data = await res.json();
  const surahs = data.data.surahs;

  for (const surah of surahs) {
    const num = String(surah.number).padStart(3, '0');
    const filePath = path.join('assets/data/surahs', `${num}.json`);
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (let i = 0; i < existing.ayahs.length; i++) {
      existing.ayahs[i].text_translation_ur = surah.ayahs[i].text;
    }

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
    console.log(`Updated ${num}.json (${surah.ayahs.length} ayahs)`);
  }
  console.log('Done! All 114 surahs updated with Urdu translations.');
}

main().catch(console.error);
