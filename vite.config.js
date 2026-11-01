import { defineConfig } from "vite";
import staticSite from "./build/static-site.js";

export default defineConfig({
  // Relative URLs, so the build works under /website/ on GitHub Pages and on a custom domain.
  base: "./",
  build: {
    outDir: "dist",
    rolldownOptions: {
      // website-template.html is an internal reference page: available in `npm run dev`, not deployed.
      input: ["index.html", "index_zh.html", "terms.html", "blog-listing.html", "single-post.html"],
    },
  },
  plugins: [
    staticSite({
      // Not referenced by any page, but must be served from the site root.
      extraFiles: ["google112de7698f317b7e.html", "favicon.ico"],
      // See build/optimize-images.js for what each option does.
      images: { quality: 85, maxWidth: 2560, maxHeight: 2000 },
    }),
  ],
});
