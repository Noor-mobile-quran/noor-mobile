import { useAppStore } from "../store/useAppStore";
import { t, type Lang } from "../lib/i18n";

export function useI18n() {
  const lang = useAppStore((s) => s.settings.translationLang) as Lang;
  return {
    t: (key: string) => t(key, lang === "ur" ? "ur" : "en"),
    lang: lang as Lang,
    isUrdu: lang === "ur",
  };
}
