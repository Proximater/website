import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import logoWide from "../../images/_logo/proximater-logo-wide.png";
import { useCollapse } from "../hooks/useCollapse";
import { useDropdown } from "../hooks/useDropdown";
import { useScrolledPast } from "../hooks/useScrolledPast";
import { scrollToSection } from "../lib/scroll";
import { LanguageSelector } from "./LanguageSelector";

const ABOUT_LINKS: { href: string; label: ParseKeys }[] = [
  { href: "#features-2", label: "nav.aboutProximater" },
  { href: "#screens-1", label: "nav.proximaterFeatures" },
  { href: "#content-2", label: "nav.whyProximater" },
  { href: "#reviews-2", label: "nav.feedback" },
  { href: "#js-tech-stack", label: "nav.technology" },
  { href: "#faqs-1", label: "nav.faqs" },
];

const MAIN_LINKS: { href: string; label: ParseKeys }[] = [
  { href: "#screens-1", label: "nav.features" },
  { href: "#pricing-1", label: "nav.business" },
  { href: "#social-1", label: "nav.social" },
  { href: "#faqs-1", label: "nav.faqs" },
];

/** Header links glide to their section instead of jumping. */
function glide(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  scrollToSection(e.currentTarget.hash);
}

export function Header() {
  const { t } = useTranslation();
  const scrolled = useScrolledPast(72);
  const menu = useCollapse<HTMLDivElement>();
  const about = useDropdown<HTMLAnchorElement>();

  return (
    <header id="header" className="header">
      <nav className={`navbar fixed-top navbar-expand-lg navbar-dark bg-tra${scrolled ? " scroll" : ""}`}>
        <div className="container">
          <a href="#hero-10" className="navbar-brand logo-white" onClick={glide}>
            <img src={logoWide} width="200" alt="header-logo" />
          </a>
          <a href="#hero-10" className="navbar-brand logo-black" onClick={glide}>
            <img src={logoWide} width="200" alt="header-logo" />
          </a>
          <LanguageSelector />
          <button
            className={`navbar-toggler${menu.open ? "" : " collapsed"}`}
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={menu.open}
            aria-label={t("nav.toggle")}
            onClick={menu.toggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="navbarSupportedContent" className="collapse navbar-collapse" ref={menu.ref}>
            <ul className="navbar-nav ml-auto">
              <li className={`nav-item dropdown${about.open ? " show" : ""}`}>
                <a
                  ref={about.toggleRef}
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={about.open}
                  onClick={(e) => {
                    e.preventDefault();
                    about.toggle();
                  }}
                >
                  {t("nav.about")}
                </a>
                <div className={`dropdown-menu${about.open ? " show" : ""}`} aria-labelledby="navbarDropdown">
                  {ABOUT_LINKS.map((link) => (
                    <a key={link.href + link.label} className="dropdown-item" href={link.href} onClick={glide}>
                      {t(link.label)}
                    </a>
                  ))}
                </div>
              </li>
              {MAIN_LINKS.map((link) => (
                <li key={link.label} className="nav-item nl-simple" onClick={menu.closeNow}>
                  <a className="nav-link" href={link.href} onClick={glide}>
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
