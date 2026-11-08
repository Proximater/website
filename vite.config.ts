import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imageOptimizer } from "./build/optimize-images.js";

export default defineConfig({
  // Relative URLs, so the build works under /website/ on GitHub Pages and on a custom domain.
  base: "./",
  plugins: [
    react(),
    // See build/optimize-images.js for what each option does.
    imageOptimizer({ quality: 85, maxWidth: 2560, maxHeight: 2000 }),
  ],
  build: {
    outDir: "dist",
    rolldownOptions: {
      // index_zh.html only redirects old links to the Chinese page.
      input: ["index.html", "index_zh.html"],
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
