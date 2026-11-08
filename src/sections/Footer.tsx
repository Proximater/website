import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import logoSquare from "../../images/_logo/proximater-logo-square.png";
import { RichText } from "../components/RichText";
import { StoreBadgesStacked } from "../components/StoreBadges";

const PRIVACY_POLICY_URL = "https://api.proximater.com/privacy-policy";

/** Site map links jump straight to their section (only header links glide). */
const SITE_MAP: { href: string; label: ParseKeys; nowrap?: boolean }[] = [
  { href: "#features-2", label: "nav.aboutProximater" },
  { href: "#screens-1", label: "nav.proximaterFeatures" },
  { href: "#content-2", label: "nav.whyProximater" },
  { href: "#pricing-1", label: "nav.forBusiness", nowrap: true },
  { href: "#reviews-2", label: "nav.feedback" },
  { href: "#js-tech-stack", label: "nav.technology" },
  { href: "#faqs-1", label: "nav.faqs" },
];

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer id="footer-1" className="bg-lightgrey wide-60 footer division">
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div className="footer-info p-right-45 m-bottom-40">
              <img src={logoSquare} width="200" alt="footer-logo" />
              <br />
              <br />
              <h6>{t("footer.tagline")}</h6>
              <p className="m-top-20">
                <RichText k="footer.about" />
              </p>
            </div>
          </div>
          <div className="col-md-4 col-lg-1"></div>
          <div className="col-md-4 col-lg-3">
            <div className="footer-links m-bottom-40">
              <h5 className="h5-md">{t("footer.siteMap")}</h5>
              <ul className="foo-links clearfix">
                {SITE_MAP.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} style={link.nowrap ? { whiteSpace: "nowrap" } : undefined}>
                      {t(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-4 col-lg-3">
            <div className="footer-stores-badge text-right m-bottom-40">
              <p>
                <strong>{t("footer.crossPlatform")}</strong>
              </p>
              <StoreBadgesStacked className="stores-badge" />
            </div>
          </div>
          <div className="bottom-footer">
            <div className="row">
              <div className="col-md-12">
                <div className="footer-copyright">
                  <p style={{ marginLeft: 10 }}>
                    <span>&copy; 2025 Proximater LTD</span>. {t("footer.registered")} |{" "}
                    <a href={PRIVACY_POLICY_URL} target="_blank">
                      {t("footer.privacy")}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
