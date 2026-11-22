import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imageOptimizer } from "./build/optimize-images.js";
import { localizedImages } from "./build/localized-images.js";
import { languagePages } from "./build/language-pages.js";

/** The site's public address: canonical and language links point here. */
const SITE_URL = "https://proximater.com/";

export default defineConfig({
  // Relative URLs, so the build works under /website/ on GitHub Pages and on a custom domain.
  base: "./",
  plugins: [
    react(),
    // `import pic from "./pic.png?localized"` + pic.zh-Hant.png etc.: see build/localized-images.js.
    localizedImages(),
    // See build/optimize-images.js for what each option does.
    imageOptimizer({ quality: 85, maxWidth: 2560, maxHeight: 2000 }),
    // zh-hant/, zh-hans/: a page per language with translated <head>; see build/language-pages.js.
    languagePages({ siteUrl: SITE_URL }),
  ],
  build: {
    outDir: "dist",
    rolldownOptions: {
      // languagePages() adds the language pages.
      input: ["index.html"],
      // Libraries change less often than the site, so give them their own long-cached chunks.
      output: {
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: "mui", test: /node_modules[\\/](@mui|@emotion|@popperjs|react-transition-group)[\\/]/ },
            { name: "vendor", test: /node_modules[\\/]/ },
          ],
        },
      },
    },
  },
});
