// Store badges while the app is in the stores: each badge links to its listing.
// StoreBadges.tsx chooses between this and StoreBadgesNotLive.tsx.
import { useTranslation } from "react-i18next";
import appStoreBadge from "../../images/store_badges/appstore.png?localized";
import googlePlayBadge from "../../images/store_badges/googleplay.png?localized";
import { useImageTranslation } from "../hooks/useImageTranslation";
import type { BadgeProps } from "./StoreBadges";

export const APP_STORE_URL = "https://apps.apple.com/app/id6468129023?mt=8&ct=website";
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.proximater.mobile&referrer=utm_source%3Dwebsite";

export function AppStoreBadge({ imgClass, trailingSpace }: BadgeProps) {
  const { t } = useTranslation();
  const { img } = useImageTranslation();
  return (
    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label={t("store.appStoreLabel")}>
      <img
        className={imgClass}
        src={img(appStoreBadge)}
        width="160"
        height="50"
        alt={t("store.appStoreAlt")}
        style={{ cursor: "pointer" }}
      />
      {trailingSpace && " "}
    </a>
  );
}

export function GooglePlayBadge({ imgClass, trailingSpace }: BadgeProps) {
  const { t } = useTranslation();
  const { img } = useImageTranslation();
  return (
    <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" aria-label={t("store.googlePlayLabel")}>
      <img
        className={imgClass}
        src={img(googlePlayBadge)}
        width="160"
        height="48"
        alt={t("store.googlePlayAlt")}
        style={{ cursor: "pointer" }}
      />
      {trailingSpace && " "}
    </a>
  );
}
