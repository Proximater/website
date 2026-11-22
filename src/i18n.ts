// Translations: one JSON file per language in src/locales/, loaded on demand.
// Each language has its own page: English at the site root, the others in a folder named after
// their code in lower case (zh-hant/, zh-hans/), made by build/language-pages.js. A language
// page always shows its language; the root page uses ?lng=…, then the visitor's last choice,
// then the browser. The address then follows the language shown (see showLanguageInAddress).
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

const DEFAULT_LANGUAGE: LanguageCode = "en";

/** The folder of a language's page, relative to the site root ("" for English). */
const folderOf = (code: string) => (code === DEFAULT_LANGUAGE ? "" : `${code.toLowerCase()}/`);

/** The language of the page being viewed, if it is one of the language folders. */
function pageLanguage(): LanguageCode | undefined {
  const folder = /\/([^/]+\/)(?:index\.html)?$/.exec(window.location.pathname)?.[1]?.toLowerCase();
  return LANGUAGES.find((l) => l.code !== DEFAULT_LANGUAGE && folderOf(l.code) === folder)?.code;
}

/** Moves the address to the page of the language shown, without reloading, so reloading or
 *  sharing the link keeps the language. An old ?lng= is dropped; the page address replaces it. */
function showLanguageInAddress(code: string) {
  const url = new URL(window.location.href);
  let siteRoot = url.pathname.replace(pageLanguage() ? /[^/]+\/(?:index\.html)?$/ : /index\.html$/, "");
  if (!siteRoot.endsWith("/")) siteRoot += "/";
  url.pathname = siteRoot + folderOf(code);
  url.searchParams.delete("lng");
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
}

const detector = new LanguageDetector();
detector.addDetector({ name: "page", lookup: () => pageLanguage() });

/** Browsers report regional codes (zh-TW, zh-CN, en-GB); map Chinese ones to the script we
 *  publish. Anything else is left for i18next to match (en-GB -> en) or fall back to English. */
function toSiteLanguage(code: string): string {
  const lower = code.toLowerCase();
  if (!lower.startsWith("zh")) return code;
  return /hant|tw|hk|mo/.test(lower) ? "zh-Hant" : "zh-Hans";
}

void i18n
  .use(resourcesToBackend((lng: string) => import(`./locales/${lng}.json`)))
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: LANGUAGES.map((l) => l.code),
    fallbackLng: DEFAULT_LANGUAGE,
    detection: {
      order: ["page", "querystring", "localStorage", "navigator"],
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
  showLanguageInAddress(i18n.resolvedLanguage ?? lng);
});

export default i18n;
