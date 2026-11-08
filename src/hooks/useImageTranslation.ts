// Translated images: the image counterpart of react-i18next's t(). See build/localized-images.js
// for how translations are named and imported.
import type { i18n as I18n } from "i18next";
import { useTranslation } from "react-i18next";

/** An image imported with ?localized: its default URL plus one per translated language. */
export type LocalizedImage = { readonly default: string; readonly [language: string]: string | undefined };

/** The version of `image` for i18next's current language. Tries the same languages i18next uses
 *  for text, in order (zh-Hant, then the English fallback), and also accepts a version made for
 *  the base language (foo.zh.png serves both Chinese scripts). */
export function translateImage(image: LocalizedImage, i18n: I18n): string {
  for (const language of i18n.languages ?? []) {
    const src = image[language] ?? image[language.split("-")[0] ?? language];
    if (src) return src;
  }
  return image.default;
}

/** `const { img } = useImageTranslation(); <img src={img(screenshot)} />`. Like t(), the
 *  component re-renders with the right version when the language changes. */
export function useImageTranslation() {
  const { i18n } = useTranslation();
  return { img: (image: LocalizedImage) => translateImage(image, i18n), i18n };
}
