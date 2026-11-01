# CLAUDE.md

## Project overview
This repository contains the Proximater marketing website. It is a mostly static site built with plain HTML, CSS, and JavaScript (jQuery plugins, no framework). Vite builds it into `dist/`, bundling the CSS and optimising images (see `build/` and the README); the source tree must keep working as a static site without the build.

## Working conventions
- Prefer small, focused edits to existing files rather than introducing new frameworks or tooling.
- Keep the site style consistent with the existing branding, typography, and color palette.
- Preserve relative asset paths for images, CSS, and JavaScript.
- When updating shared styling, prefer the existing files in css/ rather than creating duplicate styles.
- If a change affects page content, update the relevant page file(s) such as index.html, index_zh.html, single-post.html, and terms.html.
- Avoid removing or renaming IDs, classes, or data attributes that may be used by existing JavaScript.

## File guide
- index.html: main English landing page
- index_zh.html: Chinese landing page
- single-post.html: blog/article page template
- terms.html: legal/terms page
- css/: site-wide stylesheets
- js/: front-end scripts
- images/, new-screenshots/: original images (the build converts and resizes them; don't commit pre-optimised copies)
- vite.config.js, build/: build config and the plugin that copies runtime assets and optimises images
- _unused/: unreferenced assets, local only (gitignored)

## Editing workflow
- Make changes directly in the relevant HTML/CSS/JS file.
- Preview with `npm run dev`; check the deployable output with `npm run build && npm run preview`.
- Verify the result in both desktop and mobile-sized views when changing layout or content.
- If a page change should also appear in the Chinese version, apply the same update there when appropriate.

## Notes
- .github/workflows/deploy.yml builds and deploys dist/ to GitHub Pages on every push to main. There are no automated tests.
- Keep content polished and concise, since this is a marketing site.
- Be careful with image replacements and ensure they still fit the layout and performance expectations.
