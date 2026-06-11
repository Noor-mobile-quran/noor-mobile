export interface SurahContext {
  theme: string;
  period:
    | "Early Meccan"
    | "Middle Meccan"
    | "Late Meccan"
    | "Meccan"
    | "Medinan";
  rukus: number;
  sajdah?: number;
  names: string[];
}

export const surahContexts: Record<number, SurahContext> = {
  1: {
    theme:
      "The essence of the Quran — a prayer for guidance that Muslims recite in every unit of prayer.",
    period: "Early Meccan",
    rukus: 1,
    names: [
      "The Opening",
      "Umm al-Kitab (Mother of the Book)",
      "As-Sab'a al-Mathani",
    ],
  },
  2: {
    theme:
      "Guidance for humanity — covers faith, law, history of previous nations, and the foundations of Islamic society.",
    period: "Medinan",
    rukus: 40,
    sajdah: 285,
    names: ["The Cow", "The Longest Surah"],
  },
  3: {
    theme:
      "The family of Imran, the nature of truth, and lessons from the Battle of Uhud.",
    period: "Medinan",
    rukus: 20,
    names: ["The Family of Imran", "Az-Zahra (The Radiant)"],
  },
  4: {
    theme:
      "Rights of women, orphans, and inheritance — the foundation of Islamic family law.",
    period: "Medinan",
    rukus: 24,
    names: ["The Women"],
  },
  5: {
    theme:
      "Fulfillment of covenants, dietary laws, and the completion of the religion of Islam.",
    period: "Medinan",
    rukus: 16,
    names: ["The Table Spread"],
  },
  6: {
    theme:
      "The oneness of Allah, rejection of polytheism, and Abraham's search for truth.",
    period: "Late Meccan",
    rukus: 20,
    names: ["The Cattle"],
  },
  7: {
    theme:
      "The story of Adam, prophets through history, and the consequences of rejecting divine guidance.",
    period: "Late Meccan",
    rukus: 24,
    sajdah: 206,
    names: ["The Heights", "The Elevated Places"],
  },
  8: {
    theme:
      "Lessons from the Battle of Badr — trust in Allah, distribution of spoils, and unity.",
    period: "Medinan",
    rukus: 10,
    names: ["The Spoils of War"],
  },
  9: {
    theme:
      "Repentance and disavowal — the only surah without Bismillah. Treaties with polytheists and hypocrites.",
    period: "Medinan",
    rukus: 16,
    names: ["Repentance", "Al-Bara'ah (The Disavowal)"],
  },
  10: {
    theme:
      "Jonah's story and the invitation to reflect on signs of Allah in creation.",
    period: "Late Meccan",
    rukus: 11,
    names: ["Jonah"],
  },
  11: {
    theme:
      "Stories of prophets Hud, Salih, and Shu'ayb — standing firm on truth despite opposition.",
    period: "Late Meccan",
    rukus: 10,
    names: ["Hud"],
  },
  12: {
    theme:
      "The complete story of Prophet Yusuf (Joseph) — the most beautiful of stories in the Quran.",
    period: "Late Meccan",
    rukus: 12,
    names: ["Joseph", "The Best of Stories"],
  },
  13: {
    theme:
      "Thunder glorifies Allah — signs in nature that point to the Creator.",
    period: "Medinan",
    rukus: 6,
    sajdah: 15,
    names: ["The Thunder"],
  },
  14: {
    theme: "Abraham's prayer for Mecca and gratitude for blessings.",
    period: "Late Meccan",
    rukus: 7,
    names: ["Abraham"],
  },
  15: {
    theme:
      "The preserved Quran, the story of Iblis, and the people of the Stone.",
    period: "Middle Meccan",
    rukus: 6,
    names: ["The Rocky Tract", "Al-Hijr"],
  },
  16: {
    theme:
      "Blessings of Allah in nature — bees, milk, fruit — as signs of His mercy.",
    period: "Late Meccan",
    rukus: 16,
    sajdah: 50,
    names: ["The Bee"],
  },
  17: {
    theme:
      "The Night Journey to Jerusalem, commandments of conduct, and the excellence of the Quran.",
    period: "Late Meccan",
    rukus: 12,
    names: ["The Night Journey", "Bani Isra'il"],
  },
  18: {
    theme:
      "Four stories of trial — the Sleepers, the Garden Owner, Moses and Khidr, Dhul-Qarnayn.",
    period: "Middle Meccan",
    rukus: 12,
    names: ["The Cave"],
  },
  19: {
    theme:
      "Stories of Zakariya, Maryam, and Isa (Jesus) — Allah's mercy through miraculous births.",
    period: "Middle Meccan",
    rukus: 6,
    sajdah: 58,
    names: ["Mary"],
  },
  20: {
    theme:
      "The story of Moses from birth to prophethood — courage, trust, and divine support.",
    period: "Middle Meccan",
    rukus: 8,
    names: ["Ta-Ha"],
  },
  21: {
    theme:
      "The prophets and their unwavering commitment to monotheism despite trials.",
    period: "Late Meccan",
    rukus: 7,
    names: ["The Prophets"],
  },
  22: {
    theme:
      "The pilgrimage to Mecca, sacrifice, and the universality of worship.",
    period: "Medinan",
    rukus: 10,
    sajdah: 18,
    names: ["The Pilgrimage"],
  },
  23: {
    theme:
      "Qualities of successful believers and the stages of human creation.",
    period: "Late Meccan",
    rukus: 6,
    names: ["The Believers"],
  },
  24: {
    theme:
      "Laws of modesty, privacy, the parable of Allah's light, and social ethics.",
    period: "Medinan",
    rukus: 9,
    names: ["The Light"],
  },
  25: {
    theme:
      "The Criterion between truth and falsehood — qualities of the servants of the Most Merciful.",
    period: "Middle Meccan",
    rukus: 6,
    sajdah: 60,
    names: ["The Criterion"],
  },
  26: {
    theme:
      "Stories of Moses, Abraham, Noah, and other prophets — poetry vs. revelation.",
    period: "Middle Meccan",
    rukus: 11,
    names: ["The Poets"],
  },
  27: {
    theme: "Solomon, the Queen of Sheba, and the miracles granted to prophets.",
    period: "Middle Meccan",
    rukus: 7,
    sajdah: 26,
    names: ["The Ant"],
  },
  28: {
    theme:
      "The detailed story of Moses and Pharaoh — oppression, migration, and divine victory.",
    period: "Middle Meccan",
    rukus: 9,
    names: ["The Stories", "The Narration"],
  },
  29: {
    theme:
      "Trials test faith — the spider's web as a metaphor for false protectors.",
    period: "Late Meccan",
    rukus: 7,
    names: ["The Spider"],
  },
  30: {
    theme:
      "The Roman defeat and prophecy of their future victory — signs of Allah in creation.",
    period: "Middle Meccan",
    rukus: 6,
    names: ["The Romans", "The Byzantines"],
  },
  31: {
    theme:
      "Luqman's timeless wisdom to his son — gratitude, patience, and humility.",
    period: "Late Meccan",
    rukus: 4,
    names: ["Luqman the Wise"],
  },
  32: {
    theme:
      "Prostration before Allah — creation, resurrection, and the contrast between believers and deniers.",
    period: "Middle Meccan",
    rukus: 3,
    sajdah: 15,
    names: ["The Prostration"],
  },
  33: {
    theme:
      "The Battle of the Trench, conduct of the Prophet's household, and social reforms.",
    period: "Medinan",
    rukus: 9,
    names: ["The Combined Forces", "The Confederates"],
  },
  34: {
    theme:
      "The kingdoms of David and Solomon — gratitude vs. ingratitude for blessings.",
    period: "Middle Meccan",
    rukus: 6,
    names: ["Sheba"],
  },
  35: {
    theme:
      "Allah the Originator of creation — angels, mercy, and the fate of nations.",
    period: "Middle Meccan",
    rukus: 5,
    names: ["The Originator", "Fatir"],
  },
  36: {
    theme:
      "The heart of the Quran — resurrection, signs in nature, and the story of the messengers.",
    period: "Middle Meccan",
    rukus: 5,
    names: ["Ya-Sin", "The Heart of the Quran"],
  },
  37: {
    theme:
      "Angels in ranks, stories of prophets, and the ultimate triumph of truth.",
    period: "Middle Meccan",
    rukus: 5,
    names: ["Those Ranged in Ranks"],
  },
  38: {
    theme:
      "David's judgment, Solomon's trials, and Job's patience — lessons in humility.",
    period: "Middle Meccan",
    rukus: 5,
    sajdah: 24,
    names: ["Sad"],
  },
  39: {
    theme: "Sincerity in worship, the mercy of Allah, and the Day of Judgment.",
    period: "Late Meccan",
    rukus: 8,
    names: ["The Troops", "The Groups"],
  },
  40: {
    theme:
      "The believing man from Pharaoh's people who concealed his faith — courage in adversity.",
    period: "Middle Meccan",
    rukus: 9,
    names: ["The Forgiver", "The Believer"],
  },
  41: {
    theme:
      "The Quran explained in detail — the earth and heavens bear witness to Allah's creation.",
    period: "Middle Meccan",
    rukus: 6,
    sajdah: 38,
    names: ["Explained in Detail", "Fussilat"],
  },
  42: {
    theme:
      "Consultation in affairs, unity of prophetic message, and divine wisdom in diversity.",
    period: "Middle Meccan",
    rukus: 5,
    names: ["The Consultation"],
  },
  43: {
    theme:
      "The ornaments of this world are temporary — Jesus as a servant of Allah, not divine.",
    period: "Middle Meccan",
    rukus: 7,
    names: ["The Ornaments of Gold"],
  },
  44: {
    theme:
      "The smoke as a sign, the story of Pharaoh's destruction, and the tree of Zaqqum.",
    period: "Middle Meccan",
    rukus: 3,
    names: ["The Smoke"],
  },
  45: {
    theme:
      "Signs of Allah in creation — kneeling before Him on the Day of Judgment.",
    period: "Middle Meccan",
    rukus: 4,
    names: ["The Crouching", "The Kneeling"],
  },
  46: {
    theme:
      "The sand dunes of 'Ad, honoring parents, and the jinn who listened to the Quran.",
    period: "Late Meccan",
    rukus: 4,
    names: ["The Wind-Curved Sandhills"],
  },
  47: {
    theme:
      "Fighting in the cause of Allah, the nature of this worldly life, and steadfastness.",
    period: "Medinan",
    rukus: 4,
    names: ["Muhammad"],
  },
  48: {
    theme:
      "The Treaty of Hudaybiyyah as a clear victory and the promise of Mecca's conquest.",
    period: "Medinan",
    rukus: 4,
    names: ["The Victory"],
  },
  49: {
    theme:
      "Manners before the Prophet, verifying news, and the brotherhood of believers.",
    period: "Medinan",
    rukus: 2,
    names: ["The Rooms", "The Private Apartments"],
  },
  50: {
    theme:
      "Resurrection and the closeness of Allah — closer than the jugular vein.",
    period: "Middle Meccan",
    rukus: 3,
    names: ["Qaf"],
  },
  51: {
    theme:
      "The scattering winds, the story of Abraham's guests, and the certainty of the Hereafter.",
    period: "Middle Meccan",
    rukus: 3,
    names: ["The Winnowing Winds"],
  },
  52: {
    theme:
      "The Mount Sinai oath, the reality of the Day of Judgment, and patience in adversity.",
    period: "Middle Meccan",
    rukus: 2,
    names: ["The Mount"],
  },
  53: {
    theme:
      "The Prophet's Night Journey vision, the folly of idol worship, and divine accountability.",
    period: "Early Meccan",
    rukus: 3,
    sajdah: 62,
    names: ["The Star"],
  },
  54: {
    theme:
      "The splitting of the moon, stories of destroyed nations, and the Quran made easy to remember.",
    period: "Early Meccan",
    rukus: 3,
    names: ["The Moon"],
  },
  55: {
    theme:
      "The Most Merciful — a catalog of divine blessings with the refrain 'Which favors will you deny?'",
    period: "Early Meccan",
    rukus: 3,
    names: ["The Most Merciful", "The Bride of the Quran"],
  },
  56: {
    theme:
      "The three groups on the Day of Judgment — the foremost, the right, and the left.",
    period: "Early Meccan",
    rukus: 3,
    names: ["The Inevitable Event"],
  },
  57: {
    theme:
      "Iron sent down from the heavens, spending in Allah's cause, and the nature of worldly life.",
    period: "Medinan",
    rukus: 4,
    names: ["The Iron"],
  },
  58: {
    theme:
      "The woman who pleaded regarding her husband — divine justice in personal and social matters.",
    period: "Medinan",
    rukus: 3,
    names: ["The Pleading Woman"],
  },
  59: {
    theme:
      "The exile of Banu Nadir, the distribution of gains, and the beautiful names of Allah.",
    period: "Medinan",
    rukus: 3,
    names: ["The Exile", "The Gathering"],
  },
  60: {
    theme:
      "Testing the faith of women emigrants and guidelines for relations with non-hostile disbelievers.",
    period: "Medinan",
    rukus: 2,
    names: ["The Woman to be Examined"],
  },
  61: {
    theme:
      "The importance of following through on promises and supporting Allah's cause in solid ranks.",
    period: "Medinan",
    rukus: 2,
    names: ["The Ranks", "Battle Array"],
  },
  62: {
    theme:
      "Friday prayer, leaving trade for worship, and the message sent to the unlettered.",
    period: "Medinan",
    rukus: 2,
    names: ["Friday", "The Congregation"],
  },
  63: {
    theme:
      "The characteristics and dangers of hypocrites within the Muslim community.",
    period: "Medinan",
    rukus: 2,
    names: ["The Hypocrites"],
  },
  64: {
    theme:
      "Mutual loss and gain on the Day of Judgment — wealth and children as tests.",
    period: "Medinan",
    rukus: 2,
    names: ["The Mutual Disillusion", "Loss and Gain"],
  },
  65: {
    theme:
      "Laws of divorce, waiting periods, and trust in Allah during hardship.",
    period: "Medinan",
    rukus: 2,
    names: ["The Divorce"],
  },
  66: {
    theme:
      "The Prophet's household matters, repentance, and examples of righteous and unrighteous women.",
    period: "Medinan",
    rukus: 2,
    names: ["The Prohibition"],
  },
  67: {
    theme:
      "The dominion of Allah, the perfection of creation, and the purpose of life and death as a test.",
    period: "Middle Meccan",
    rukus: 2,
    names: ["The Sovereignty", "The Dominion", "Al-Mulk"],
  },
  68: {
    theme:
      "The pen and what it writes — the Prophet's noble character and the story of the garden owners.",
    period: "Early Meccan",
    rukus: 2,
    names: ["The Pen"],
  },
  69: {
    theme:
      "The inevitable reality of the Day of Judgment and the destruction of past nations.",
    period: "Early Meccan",
    rukus: 2,
    names: ["The Inevitable Reality"],
  },
  70: {
    theme:
      "The ways of ascent to Allah, the nature of man, and qualities of the prayerful.",
    period: "Early Meccan",
    rukus: 2,
    names: ["The Ascending Stairways"],
  },
  71: {
    theme:
      "Noah's patient preaching for 950 years and his plea to Allah against his people.",
    period: "Early Meccan",
    rukus: 2,
    names: ["Noah"],
  },
  72: {
    theme:
      "A group of jinn who heard the Quran and believed — the unseen world acknowledges truth.",
    period: "Early Meccan",
    rukus: 2,
    names: ["The Jinn"],
  },
  73: {
    theme:
      "Night prayer and its spiritual importance — preparation for receiving the Quran's message.",
    period: "Early Meccan",
    rukus: 2,
    names: ["The Enshrouded One"],
  },
  74: {
    theme:
      "The call to rise and warn — one of the earliest revelations to the Prophet.",
    period: "Early Meccan",
    rukus: 2,
    names: ["The Cloaked One"],
  },
  75: {
    theme:
      "The Day of Resurrection and the self-reproaching soul — human accountability.",
    period: "Early Meccan",
    rukus: 2,
    names: ["The Resurrection"],
  },
  76: {
    theme:
      "The creation of man, the reward of the righteous, and the nature of divine will.",
    period: "Medinan",
    rukus: 2,
    names: ["Man", "Time", "Ad-Dahr"],
  },
  77: {
    theme:
      "Winds sent forth as mercy and punishment — 'Woe that Day to the deniers!'",
    period: "Early Meccan",
    rukus: 2,
    names: ["Those Sent Forth"],
  },
  78: {
    theme:
      "The great news of resurrection — the earth spread out and the mountains as stakes.",
    period: "Early Meccan",
    rukus: 2,
    names: ["The Great News", "The Tidings"],
  },
  79: {
    theme:
      "Angels who extract souls, the story of Moses and Pharaoh, and the overwhelming Hour.",
    period: "Early Meccan",
    rukus: 2,
    names: ["Those Who Pull Out"],
  },
  80: {
    theme:
      "The Prophet frowned at a blind man — a lesson in treating all people with equal dignity.",
    period: "Early Meccan",
    rukus: 1,
    names: ["He Frowned"],
  },
  81: {
    theme:
      "The sun wrapped up, stars scattered — vivid images of the Day of Judgment.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Overthrowing"],
  },
  82: {
    theme:
      "The sky breaks apart — recording angels and the reality of the coming judgment.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Cleaving"],
  },
  83: {
    theme:
      "Woe to those who give less measure — fraud, the record of the wicked, and the righteous.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Defrauders"],
  },
  84: {
    theme:
      "The sky splits open and the earth stretches — every soul meets what it has prepared.",
    period: "Early Meccan",
    rukus: 1,
    sajdah: 21,
    names: ["The Sundering"],
  },
  85: {
    theme:
      "The people of the trench who were persecuted for their faith — Allah's justice prevails.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Great Stars", "The Constellations"],
  },
  86: {
    theme:
      "The night visitor star and the creation of man from fluid — the Quran is decisive.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Night Comer"],
  },
  87: {
    theme:
      "Glorify the name of your Lord, the Most High — the fleeting world vs. the lasting Hereafter.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Most High"],
  },
  88: {
    theme:
      "The overwhelming event — faces of humiliation and faces of joy on the Day of Judgment.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Overwhelming"],
  },
  89: {
    theme:
      "The dawn, the destroyed civilizations of 'Ad and Thamud, and the soul at peace.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Dawn"],
  },
  90: {
    theme:
      "The city of Mecca, the steep path of righteousness — freeing slaves, feeding the needy.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The City"],
  },
  91: {
    theme:
      "The sun and its brightness — the soul's purification or corruption determines destiny.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Sun"],
  },
  92: {
    theme:
      "The night covers, the day reveals — those who give and those who withhold.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Night"],
  },
  93: {
    theme:
      "The morning brightness — Allah's comfort to the Prophet: your Lord has not forsaken you.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Morning Hours", "The Forenoon"],
  },
  94: {
    theme:
      "With hardship comes ease — Allah expanded the Prophet's chest and relieved his burden.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Relief", "The Expansion"],
  },
  95: {
    theme:
      "The fig and the olive — man created in the best form, then reduced to the lowest.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Fig"],
  },
  96: {
    theme:
      "Read! The first revelation — man created from a clinging clot, taught by the pen.",
    period: "Early Meccan",
    rukus: 1,
    sajdah: 19,
    names: ["The Clot", "Read!", "The First Revelation"],
  },
  97: {
    theme:
      "The Night of Decree is better than a thousand months — the night the Quran was revealed.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Night of Decree", "The Power"],
  },
  98: {
    theme:
      "Clear evidence sent to the People of the Book — sincere worship and the best of creation.",
    period: "Medinan",
    rukus: 1,
    names: ["The Clear Evidence"],
  },
  99: {
    theme:
      "The earth shakes and reveals its burdens — every atom's weight of deed is shown.",
    period: "Medinan",
    rukus: 1,
    names: ["The Earthquake"],
  },
  100: {
    theme: "The charging war horses at dawn — man's ingratitude to his Lord.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Courser", "The War Horses"],
  },
  101: {
    theme:
      "The striking calamity — the Day when people are like scattered moths and mountains like wool.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Calamity"],
  },
  102: {
    theme:
      "Competition for worldly increase distracts until the grave — you will surely see the Hellfire.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Rivalry in Worldly Increase"],
  },
  103: {
    theme:
      "By time, mankind is in loss — except those who believe, do good, and counsel truth and patience.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Declining Day", "Time"],
  },
  104: {
    theme:
      "Woe to every slanderer and backbiter who hoards wealth thinking it will make them immortal.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Slanderer"],
  },
  105: {
    theme:
      "The army of the elephant destroyed by birds of Ababil — Allah's protection of the Ka'bah.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Elephant"],
  },
  106: {
    theme:
      "The Quraysh's winter and summer trade journeys — gratitude to the Lord of the Ka'bah.",
    period: "Early Meccan",
    rukus: 1,
    names: ["Quraysh"],
  },
  107: {
    theme:
      "Small kindnesses — those who deny the religion are those who repel the orphan and neglect prayer.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Small Kindnesses"],
  },
  108: {
    theme:
      "Al-Kawthar, the abundance given to the Prophet — pray and sacrifice for your Lord.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Abundance"],
  },
  109: {
    theme:
      "Declaration of religious freedom — to you your religion, and to me mine.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Disbelievers"],
  },
  110: {
    theme:
      "The help of Allah and the conquest of Mecca — glorify and seek forgiveness.",
    period: "Medinan",
    rukus: 1,
    names: ["The Divine Support", "The Victory"],
  },
  111: {
    theme:
      "The fate of Abu Lahab and his wife who opposed the Prophet with fierce hostility.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Palm Fiber", "The Flame"],
  },
  112: {
    theme:
      "Pure monotheism — Allah is One, eternal, neither begetting nor begotten.",
    period: "Early Meccan",
    rukus: 1,
    names: ["Sincerity", "Purity of Faith", "One-third of the Quran"],
  },
  113: {
    theme:
      "Seeking refuge in Allah from the evil of creation, darkness, witchcraft, and envy.",
    period: "Early Meccan",
    rukus: 1,
    names: ["The Daybreak", "The Dawn"],
  },
  114: {
    theme:
      "Seeking refuge in Allah from the whisperer who retreats — the evil that whispers in hearts.",
    period: "Early Meccan",
    rukus: 1,
    names: ["Mankind"],
  },
};
