# Proximater Website

Marketing website for [Proximater](https://proximater.github.io/website/) — a real-time location discovery app that lets businesses and individuals broadcast their presence instantly.

Live site: https://proximater.github.io/website/

## Stack

React 19 + TypeScript, built with [Vite](https://vite.dev). [MUI](https://mui.com) provides the theme and the interactive pieces (language menu, lightbox, fades), [react-i18next](https://react.i18next.com) the translations, [react-slick](https://react-slick.neostack.com) the carousels, and [sharp](https://sharp.pixelplumbing.com) optimises images at build time. No jQuery.

The page's look comes from the original theme stylesheets in `css/` (Bootstrap 4 grid, `style.css`, `responsive.css`, animate.css). The components render the same markup and classes, so the layout, backgrounds and animations are exactly what they were before the move to React. Change the look in `css/`; change content and behaviour in `src/`.

## Languages

English, Traditional Chinese (`zh-Hant`) and Simplified Chinese (`zh-Hans`). All page text lives in one file per language:

```
src/locales/en.json
src/locales/zh-Hant.json
src/locales/zh-Hans.json
```

The language comes from `?lng=` in the URL, then the visitor's last choice (remembered in the browser), then the browser's language: zh-TW, zh-HK and zh-MO get Traditional, other Chinese variants Simplified, everything else English. The selector is at the top right of the header.

- **Edit copy** in the JSON files. Strings can use `<br/>`, `<strong>`, `<em>` and `<red>` (brand red).
- **Keys are type-checked** against `en.json`: a missing or mistyped key fails `npm run build`.
- **Add a language**: add `src/locales/<code>.json` with the same keys, then add it to `LANGUAGES` in [src/i18n.ts](src/i18n.ts).

`index_zh.html` only redirects old links to `index.html?lng=zh-Hant`.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Page shell: head metadata, fonts, the React root |
| `src/main.tsx`, `src/App.tsx` | Entry point and page assembly |
| `src/sections/` | One component per page section (hero, features, carousel, FAQs, footer…) |
| `src/components/` | Header, language selector, preloader, carousel, lightbox, store badges, animation helpers |
| `src/locales/` | Translations, one JSON file per language |
| `src/styles/` | The preloader and hero-image styles, and small bridges between the theme CSS and the components |
| `css/` | Theme stylesheets (Bootstrap 4, theme, responsive, animate.css, slick, Magnific Popup look) |
| `images/`, `new-screenshots/` | Original images, imported by the components (optimised by the build) |
| `public/` | Files served unchanged at the site root (favicon, Google verification, link-preview image) |
| `vite.config.ts`, `build/` | Build configuration and the image optimiser |
| `.github/workflows/deploy.yml` | Builds and deploys to GitHub Pages on every push to `main` |
| `dist/` | Build output (not committed) |
| `_unused/` | Files no page uses, kept locally only (not committed) |

## Local development

Requires Node.js 20.19+ or 22.12+.

```
npm install
npm run dev        # live-reloading dev server
npm run typecheck  # TypeScript only
npm run build      # type-check, then build the deployable site into dist/
npm run preview    # serve dist/ to check the build
```

The build output in `dist/` is plain static files with relative paths, so it can be uploaded to any web host, in the root or a subfolder.

## Images

Add images at full quality and import them in the component that uses them (`import pic from "../../images/foo.png"`). CSS references (`url(../images/foo.png)`) work too. The build optimises them in `dist/` and rewrites the references:

- **Photos and screenshots** (anything without transparency) become WebP at quality 85, scaled down to fit 2560×2000 px. A file is only replaced if WebP is at least 10% smaller.
- **PNGs with transparency** (logos, badges, phone mock-ups) stay PNG with identical pixels; they are only recompressed losslessly.
- **Link-preview images** (`og:image`, `twitter:image`) are left untouched, since not every crawler accepts WebP.

The settings are in `vite.config.ts`; `exclude` there leaves specific files untouched. The build log lists every image with its before/after size.

## Editing conventions

- Keep styling in `css/` (or `src/styles/` for component bridges) rather than inline or duplicate styles.
- Keep the theme's classes and IDs on the markup: the CSS and in-page links depend on them.
- Check both desktop and mobile-sized views for layout changes, and each language for text changes.

See [CLAUDE.md](CLAUDE.md) for the full set of working conventions.

## Deployment

Hosted on GitHub Pages. Every push to `main` runs [deploy.yml](.github/workflows/deploy.yml), which builds the site and publishes `dist/`. You can also run it manually from the Actions tab.

This requires **Settings → Pages → Build and deployment → Source: GitHub Actions**.
