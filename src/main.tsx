import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { config as faConfig } from "@fortawesome/fontawesome-svg-core";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";

// Theme stylesheets, in the order the old page loaded them. They define the layout, so they
// are kept as-is; the React components render the same markup and classes.
import "../css/bootstrap.min.css";
import "../css/fa-svg-with-js.css";
import "../css/magnific-popup.css";
import "../css/slick.css";
import "../css/slick-theme.css";
import "../css/animate.css";
import "../css/style.css";
import "../css/responsive.css";
import "./styles/preloader.css";
import "./styles/hero-images.css";
import "./styles/react-compat.css";

import "./i18n";
import { theme } from "./theme";
import App from "./App";

// css/fa-svg-with-js.css (the stylesheet the icons were designed against) styles the icons.
faConfig.autoAddCss = false;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* injectFirst: MUI's styles go before the theme CSS, so the theme wins where they overlap */}
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
);
