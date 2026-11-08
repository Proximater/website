// Translations: one JSON file per language in src/locales/, loaded on demand.
// The language comes from ?lng=…, then the visitor's last choice, then the browser.
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

/** Languages offered in the selector, named in their own language. To add one, add its
 *  locales/<code>.json and an entry here. */
export const LANGUAGES = [
  { code: "en", name: "English", short: "EN" },
  { code: "zh-Hant", name: "繁體中文", short: "繁" },
  { code: "zh-Hans", name: "简体中文", short: "简" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

/** Browsers report regional codes (zh-TW, zh-CN, en-GB); map Chinese ones to the script we
 *  publish. Anything else is left for i18next to match (en-GB -> en) or fall back to English. */
function toSiteLanguage(code: string): string {
  const lower = code.toLowerCase();
  if (!lower.startsWith("zh")) return code;
  return /hant|tw|hk|mo/.test(lower) ? "zh-Hant" : "zh-Hans";
}

void i18n
  .use(resourcesToBackend((lng: string) => import(`./locales/${lng}.json`)))
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: LANGUAGES.map((l) => l.code),
    fallbackLng: "en",
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lng",
      lookupLocalStorage: "lng",
      caches: ["localStorage"],
      convertDetectedLanguage: toSiteLanguage,
    },
    interpolation: { escapeValue: false }, // React escapes; the copy is ours, not user input
    react: { transKeepBasicHtmlNodesFor: ["br", "strong", "em"] },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
