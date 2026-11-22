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

Each language has its own page, so you can link to it directly:

| Address | Language |
|---|---|
| `https://proximater.com/` | English (and the default) |
| `https://proximater.com/zh-hant/` | Traditional Chinese |
| `https://proximater.com/zh-hans/` | Simplified Chinese |

The build makes the language pages from `index.html`, with the page title, description and link-preview text (`meta` in each JSON file) in that language, so shared links preview in the right language. Every page also tells search engines about the other language versions. The mechanism is in [build/language-pages.js](build/language-pages.js); the site address it uses is `SITE_URL` in [vite.config.ts](vite.config.ts).

A language page always shows its language. The root page uses `?lng=` if present, then the visitor's last choice (remembered in the browser), then the browser's language: zh-TW, zh-HK and zh-MO get Traditional, other Chinese variants Simplified, everything else English. Whatever language is shown, the address moves to that language's page (without reloading), so a copied link keeps the language. The selector is at the top right of the header.

- **Edit copy** in the JSON files. Strings can use `<br/>`, `<strong>`, `<em>` and `<red>` (brand red).
- **Keys are type-checked** against `en.json`: a missing or mistyped key fails `npm run build`.
- **Add a language**: add `src/locales/<code>.json` with the same keys, then add it to `LANGUAGES` in [src/i18n.ts](src/i18n.ts). Its page appears at `/<code in lower case>/`.

### Translated images

Images with words in them can have a version per language. Put the translation next to the original, with the language code before the extension:

```
images/_deck/Slide8.png           used for English, and for any language without its own version
images/_deck/Slide8.zh-Hant.png   Traditional Chinese
images/_deck/Slide8.zh-Hans.png   Simplified Chinese
```

That's all: the page picks it up (the dev server too, without a restart). A file named `Slide8.zh.png` serves both Chinese scripts. The translation can be a different format (`Slide8.zh-Hant.jpg`) but should have the same proportions, since the layout reserves the original's size.

In a component, import the original with `?localized` and pass it through `img()`, the image counterpart of `t()`:

```tsx
import slide from "../../images/_deck/Slide8.png?localized";
const { img } = useImageTranslation();   // src/hooks/useImageTranslation.ts
<img src={img(slide)} />
```

It follows i18next's current language and fallback, and switches with the language selector. The screenshots, deck slides, social images and store badges are already imported this way. The mechanism is in [build/localized-images.js](build/localized-images.js).

Translated so far: the deck slides, the social images, the Google Play badge and the link-preview image (`public/images/website.zh-Hant.jpg` etc., 1200×630 screenshots of each language's hero; picked per language page by [build/language-pages.js](build/language-pages.js)). The App Store badge and the app screenshots are still English. Apple's localised badges are at [Apple's marketing tools](https://tools.applemarketingtools.com/), and screenshots taken with the app set to 繁體中文 or 简体中文 can be dropped in under the same file names.

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
| `vite.config.ts`, `build/` | Build configuration, the image optimiser, translated-image imports and the language pages |
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
