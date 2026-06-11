export interface Reciter {
  id: string;
  name_english: string;
  name_arabic: string;
  name_urdu: string;
  style: string;
  audioBaseUrl: string;
}

export const RECITERS: Reciter[] = [
  {
    id: "mishary",
    name_english: "Mishary Rashid Al-Afasy",
    name_arabic: "مشاري راشد العفاسي",
    name_urdu: "مشاری راشد العفاسی",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy",
  },
  {
    id: "abdulbasit",
    name_english: "Abdul Basit Abdul Samad",
    name_arabic: "عبد الباسط عبد الصمد",
    name_urdu: "عبدالباسط عبدالصمد",
    style: "Mujawwad",
    audioBaseUrl:
      "https://cdn.islamic.network/quran/audio/192/ar.abdulbasitmurattal",
  },
  {
    id: "sudais",
    name_english: "Abdur-Rahman As-Sudais",
    name_arabic: "عبد الرحمن السديس",
    name_urdu: "عبدالرحمٰن السدیس",
    style: "Murattal",
    audioBaseUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais",
  },
  {
    id: "maher",
    name_english: "Maher Al-Muaiqly",
    name_arabic: "ماهر المعيقلي",
    name_urdu: "ماہر المعیقلی",
    style: "Murattal",
    audioBaseUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.maaboralmueaqly",
  },
  {
    id: "husary",
    name_english: "Mahmoud Khalil Al-Husary",
    name_arabic: "محمود خليل الحصري",
    name_urdu: "محمود خلیل الحصری",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary",
  },
  {
    id: "minshawi",
    name_english: "Mohamed Siddiq El-Minshawi",
    name_arabic: "محمد صديق المنشاوي",
    name_urdu: "محمد صدیق المنشاوی",
    style: "Mujawwad",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.minshawi",
  },
];
