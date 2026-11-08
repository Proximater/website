// Type-checks translation keys against the English file, so a typo in t("…") fails the build.
import "i18next";
import type en from "./locales/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: typeof en };
  }
}
