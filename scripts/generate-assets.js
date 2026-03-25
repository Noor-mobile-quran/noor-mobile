// Script to generate app icon and splash screen
// Run: node scripts/generate-assets.js
// Requires: sharp (npm install sharp --save-dev)

const sharp = require('sharp');

async function generateIcon() {
  // 1024x1024 icon: Gold crescent + star on forest green (#1B4332)
  const svg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" fill="#1B4332" rx="224"/>
    <g transform="translate(512,512) scale(8)">
      <path d="M24 4C13 4 4 13 4 24s9 20 20 20c-7.7 0-14-6.3-14-14S16.3 16 24 16c3.3 0 6.3 1.1 8.7 3C30.3 11.3 24 4 24 4z" fill="#D4A843"/>
      <path d="M36 12l1.5 3 3.5.5-2.5 2.5.5 3.5L36 20l-3 1.5.5-3.5L31 15.5l3.5-.5z" fill="#D4A843" opacity="0.8"/>
    </g>
  </svg>`;
  await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile('assets/icon.png');
  console.log('Generated: assets/icon.png (1024x1024)');
}

async function generateAdaptiveIcon() {
  // Same but with more padding for Android adaptive icon
  const svg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" fill="#1B4332"/>
    <g transform="translate(512,480) scale(6)">
      <path d="M24 4C13 4 4 13 4 24s9 20 20 20c-7.7 0-14-6.3-14-14S16.3 16 24 16c3.3 0 6.3 1.1 8.7 3C30.3 11.3 24 4 24 4z" fill="#D4A843"/>
      <path d="M36 12l1.5 3 3.5.5-2.5 2.5.5 3.5L36 20l-3 1.5.5-3.5L31 15.5l3.5-.5z" fill="#D4A843" opacity="0.8"/>
    </g>
  </svg>`;
  await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile('assets/adaptive-icon.png');
  console.log('Generated: assets/adaptive-icon.png (1024x1024)');
}

async function generateSplash() {
  // 1284x2778 splash: "نور" in gold on forest green with ornamental divider
  const svg = `<svg width="1284" height="2778" xmlns="http://www.w3.org/2000/svg">
    <rect width="1284" height="2778" fill="#1B4332"/>
    <text x="642" y="1200" text-anchor="middle" font-family="serif" font-size="280" font-weight="bold" fill="#D4A843" direction="rtl">نور</text>
    <line x1="442" y1="1350" x2="842" y2="1350" stroke="#D4A843" stroke-width="2" opacity="0.4"/>
    <g transform="translate(642,1350) scale(2)">
      <path d="M12 0l3 9h9l-7.5 5.5 3 9L12 18l-7.5 5.5 3-9L0 9h9z" fill="#D4A843" opacity="0.5"/>
    </g>
    <text x="642" y="1450" text-anchor="middle" font-family="sans-serif" font-size="48" fill="#D4A843" opacity="0.6">Your Quran Companion</text>
  </svg>`;
  await sharp(Buffer.from(svg)).resize(1284, 2778).png().toFile('assets/splash.png');
  console.log('Generated: assets/splash.png (1284x2778)');
}

async function main() {
  await generateIcon();
  await generateAdaptiveIcon();
  await generateSplash();
  console.log('All assets generated!');
}

main().catch(console.error);
