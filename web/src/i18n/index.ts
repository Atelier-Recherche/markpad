import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "../locales/de.json";
import en from "../locales/en.json";
import es from "../locales/es.json";
import fr from "../locales/fr.json";

export const SUPPORTED_LOCALES = ["fr", "en", "es", "de"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const STORAGE_KEY = "markpad-locale";

const detectLocale = (): SupportedLocale => {
  const stored = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
  if (stored && SUPPORTED_LOCALES.includes(stored)) {
    return stored;
  }
  const nav = navigator.language.slice(0, 2).toLowerCase();
  if (SUPPORTED_LOCALES.includes(nav as SupportedLocale)) {
    return nav as SupportedLocale;
  }
  return "en";
};

void i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    es: { translation: es },
    de: { translation: de }
  },
  lng: detectLocale(),
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export const setLocale = (lng: SupportedLocale): void => {
  void i18n.changeLanguage(lng);
  localStorage.setItem(STORAGE_KEY, lng);
};

export default i18n;
