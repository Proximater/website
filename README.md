# Proximater Website

Marketing website for [Proximater](https://proximater.github.io/website/) — a real-time location discovery app that lets businesses and individuals broadcast their presence instantly.

Live site: https://proximater.github.io/website/

## Stack

Static HTML/CSS/JS with jQuery plugins, built with [Vite](https://vite.dev) and [sharp](https://sharp.pixelplumbing.com). No framework.

The source files are still a working static site on their own. The build produces an optimised copy in `dist/`: one minified stylesheet per page and web-optimised images.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Main English landing page |
| `index_zh.html` | Chinese landing page |
| `single-post.html` | Blog/article page template |
| `blog-listing.html` | Blog index page |
| `terms.html` | Legal/terms page |
| `website-template.html` | Internal reference page holding site sections that aren't currently live (dev server only, not deployed) |
| `css/` | Site-wide stylesheets (bundled and minified by the build) |
| `js/` | Front-end scripts (copied as-is) |
| `images/`, `new-screenshots/` | Original images (optimised by the build) |
| `vite.config.js`, `build/` | Build configuration and the plugin that copies assets and optimises images |
| `.github/workflows/deploy.yml` | Builds and deploys to GitHub Pages on every push to `main` |
| `dist/` | Build output (not committed) |
| `_unused/` | Assets no page references, kept locally only (not committed) |

## Local development

Requires Node.js 20.19+ or 22.12+.

```
npm install
npm run dev       # live-reloading dev server on the source files
npm run build     # build the deployable site into dist/
npm run preview   # serve dist/ to check the build
```

## Images

Add images at full quality and reference them by their normal path (e.g. `images/foo.png`). The build optimises them in `dist/` and rewrites references in HTML, CSS and inline scripts:

- **Photos and screenshots** (anything without transparency) become WebP at quality 85, scaled down to fit 2560×2000 px. A file is only replaced if WebP is at least 10% smaller.
- **PNGs with transparency** (logos, badges, phone mock-ups) stay PNG with identical pixels; they are only recompressed losslessly.
- **Link-preview images** (`og:image`, `twitter:image`) are left untouched, since not every crawler accepts WebP.

The settings are in `vite.config.js`; `exclude` there leaves specific files untouched. The build log lists every image with its before/after size.

Name files without spaces (or write them as `%20` in references). Images referenced only from commented-out HTML aren't deployed.

## Editing conventions

- Make changes directly in the relevant HTML/CSS/JS file, and check them with `npm run dev`.
- Keep styling in `css/` rather than adding inline or duplicate styles.
- Preserve relative asset paths and existing IDs/classes/data attributes, since they're referenced by JS.
- If a change affects page content, update it consistently across `index.html`, `index_zh.html`, and any other relevant page.
- Check both desktop and mobile-sized views for layout changes.

See [CLAUDE.md](CLAUDE.md) for the full set of working conventions.

## Deployment

Hosted on GitHub Pages. Every push to `main` runs [deploy.yml](.github/workflows/deploy.yml), which builds the site and publishes `dist/`. You can also run it manually from the Actions tab.

This requires **Settings → Pages → Build and deployment → Source: GitHub Actions**. While the source is still "Deploy from a branch", Pages serves the unoptimised source files from `main` and the workflow's deploy step fails.
