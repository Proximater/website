# CLAUDE.md

## Project overview
This repository contains the Proximater marketing website: a single-page React 19 + TypeScript app built with Vite, using MUI (theme and interactive components), react-i18next (translations) and react-slick (carousels). There is no jQuery. The look comes from the original theme stylesheets in `css/`; the components reproduce the original markup and classes so the layout and effects stay exactly as they were. Vite builds into `dist/`, bundling code and CSS and optimising images (see `build/` and the README).

## Working conventions
- Prefer small, focused edits to existing components and files over new libraries or tooling.
- Keep the site style consistent with the existing branding, typography, and color palette (brand values are mirrored in `src/theme.ts`).
- Layout and effects (backgrounds, animations, carousels, preloader) must stay identical: change them through `css/`, and keep the theme's classes, IDs and markup structure on the components.
- When updating shared styling, prefer the existing files in `css/` rather than creating duplicate styles; `src/styles/react-compat.css` is only for bridges between the theme CSS and the React components.
- All user-facing text goes in `src/locales/<language>.json` (en, zh-Hant, zh-Hans), never hard-coded in components. Change every language when changing copy; keys are type-checked against `en.json`.
- Import images in the component that uses them so the build can optimise them.
- Images containing words are imported with `?localized` and rendered with `img()` from `useImageTranslation()`; translations sit beside the original as `name.<language>.ext` (e.g. `Slide8.zh-Hant.png`), keeping the original's proportions. When changing such an image, update or remove its translations too.

## File guide
- index.html: page shell (head metadata, fonts, React root)
- index_zh.html: redirect from the old Chinese page to index.html?lng=zh-Hant
- src/sections/: one component per page section
- src/components/: header, language selector, preloader, carousel, lightbox, shared helpers
- src/locales/: translations, one JSON file per language; src/i18n.ts lists the languages
- src/styles/: preloader and hero-image styles, theme/React bridges
- css/: theme stylesheets (Bootstrap 4, style.css, responsive.css, animate.css, slick, Magnific Popup look)
- images/, new-screenshots/: original images (the build converts and resizes them; don't commit pre-optimised copies)
- public/: files served unchanged at the site root
- vite.config.ts, build/: build config, the image optimiser plugin and the ?localized image plugin
- _unused/: unreferenced files, local only (gitignored); the old jQuery pages and scripts are in _unused/legacy-site/

## Editing workflow
- Preview with `npm run dev`; check the deployable output with `npm run build && npm run preview`.
- `npm run build` type-checks first; fix TypeScript errors rather than loosening the config.
- Verify the result in both desktop and mobile-sized views when changing layout or content, and in each language when changing text.

## Notes
- .github/workflows/deploy.yml builds and deploys dist/ to GitHub Pages on every push to main. There are no automated tests.
- Keep content polished and concise, since this is a marketing site.
- Be careful with image replacements and ensure they still fit the layout and performance expectations.
