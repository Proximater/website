import { useTranslation } from "react-i18next";
import appStoreBadge from "../../images/store_badges/appstore.png";
import googlePlayBadge from "../../images/store_badges/googleplay.png";

export const APP_STORE_URL = "https://apps.apple.com/app/id6468129023?mt=8&ct=website";
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.proximater.mobile&referrer=utm_source%3Dwebsite";

function AppStoreLink({ imgClass, trailingSpace }: { imgClass?: string; trailingSpace?: boolean }) {
  const { t } = useTranslation();
  return (
    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label={t("store.appStoreLabel")}>
      <img
        className={imgClass}
        src={appStoreBadge}
        width="160"
        height="50"
        alt={t("store.appStoreAlt")}
        style={{ cursor: "pointer" }}
      />
      {trailingSpace && " "}
    </a>
  );
}

function GooglePlayLink({ imgClass }: { imgClass?: string }) {
  const { t } = useTranslation();
  return (
    <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" aria-label={t("store.googlePlayLabel")}>
      <img
        className={imgClass}
        src={googlePlayBadge}
        width="160"
        height="48"
        alt={t("store.googlePlayAlt")}
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}

/** Badges side by side (hero). The spacing reproduces the old markup's " &nbsp; &nbsp; ",
 *  whose first space fell inside the App Store link. */
export function StoreBadgesInline() {
  return (
    <div>
      <AppStoreLink trailingSpace />
      {"    "}
      <GooglePlayLink />
    </div>
  );
}

/** Badges stacked (pricing card and footer). */
export function StoreBadgesStacked({ className }: { className: string }) {
  return (
    <div className={className}>
      <AppStoreLink imgClass="appstore-original" />
      <br />
      <br />
      <GooglePlayLink imgClass="googleplay-original" />
    </div>
  );
}
