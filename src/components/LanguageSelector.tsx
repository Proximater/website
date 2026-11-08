import { useState } from "react";
import { useTranslation } from "react-i18next";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "../icons";
import { LANGUAGES, type LanguageCode } from "../i18n";

/** Language menu at the right of the header (next to the menu button on mobile). */
export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0];

  const choose = (code: LanguageCode) => {
    setAnchor(null);
    void i18n.changeLanguage(code);
    // Keep a ?lng= link in step, so reloading or sharing it shows the chosen language.
    const url = new URL(window.location.href);
    if (url.searchParams.has("lng")) {
      url.searchParams.set("lng", code);
      window.history.replaceState(null, "", url);
    }
  };

  return (
    <ul className="navbar-nav lang-switch ml-auto order-lg-last">
      <li className="nav-item">
        <button
          type="button"
          className="nav-link dropdown-toggle"
          id="lang-button"
          aria-haspopup="true"
          aria-controls={anchor ? "lang-menu" : undefined}
          aria-expanded={anchor ? "true" : "false"}
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          <FontAwesomeIcon icon={faGlobe} className="lang-icon" />
          <span className="sr-only">{t("lang.label")} </span>
          <span className="lang-name">{current.name}</span>
          <span className="lang-short" aria-hidden="true">
            {current.short}
          </span>
        </button>
        <Menu
          id="lang-menu"
          anchorEl={anchor}
          open={anchor !== null}
          onClose={() => setAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          disableScrollLock // the fixed header would shift if the scrollbar were hidden
          slotProps={{ list: { "aria-labelledby": "lang-button" } }}
        >
          {LANGUAGES.map((lang) => (
            <MenuItem
              key={lang.code}
              lang={lang.code}
              selected={lang.code === current.code}
              onClick={() => choose(lang.code)}
            >
              {lang.name}
            </MenuItem>
          ))}
        </Menu>
      </li>
    </ul>
  );
}
