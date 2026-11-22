// Store badges while the app is out of the stores: the same badges, in the same place, but not
// links. StoreBadges.tsx chooses between this and StoreBadgesLive.tsx.
import { useTranslation } from "react-i18next";
import appStoreBadge from "../../images/store_badges/appstore.png?localized";
import googlePlayBadge from "../../images/store_badges/googleplay.png?localized";
import { useImageTranslation } from "../hooks/useImageTranslation";
import type { BadgeProps } from "./StoreBadges";

// A <span> sits in the line exactly like the live version's <a>, so nothing moves.

export function AppStoreBadge({ imgClass, trailingSpace }: BadgeProps) {
  const { t } = useTranslation();
  const { img } = useImageTranslation();
  return (
    <span>
      <img className={imgClass} src={img(appStoreBadge)} width="160" height="50" alt={t("store.appStoreAlt")} />
      {trailingSpace && " "}
    </span>
  );
}

export function GooglePlayBadge({ imgClass, trailingSpace }: BadgeProps) {
  const { t } = useTranslation();
  const { img } = useImageTranslation();
  return (
    <span>
      <img className={imgClass} src={img(googlePlayBadge)} width="160" height="48" alt={t("store.googlePlayAlt")} />
      {trailingSpace && " "}
    </span>
  );
}
