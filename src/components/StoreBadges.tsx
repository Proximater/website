// App Store and Google Play badges (hero, pricing card and footer).
//
// Which version the page shows is chosen by the import below:
//   ./StoreBadgesLive    - the app is in the stores: badges link to the listings
//   ./StoreBadgesNotLive - the app is out of the stores: same badges, no links
import { AppStoreBadge, GooglePlayBadge } from "./StoreBadgesNotLive";

export type BadgeProps = { imgClass?: string; trailingSpace?: boolean };

/** Badges side by side (hero). The spacing reproduces the old markup's " &nbsp; &nbsp; ",
 *  whose first space fell inside the App Store link. */
export function StoreBadgesInline() {
  return (
    <div>
      <AppStoreBadge trailingSpace />
      {"    "}
      <GooglePlayBadge />
    </div>
  );
}

/** Badges stacked (pricing card and footer). */
export function StoreBadgesStacked({ className }: { className: string }) {
  return (
    <div className={className}>
      <AppStoreBadge imgClass="appstore-original" />
      <br />
      <br />
      <GooglePlayBadge imgClass="googleplay-original" />
    </div>
  );
}
