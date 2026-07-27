# Proximater Website

Marketing website for [Proximater](https://proximater.github.io/website/) — a real-time location discovery app that lets businesses and individuals broadcast their presence instantly.

Live site: https://proximater.github.io/website/

## Stack

Static HTML/CSS/JS. No build step, no package manager, no framework.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Main English landing page |
| `index_zh.html` | Chinese landing page |
| `single-post.html` | Blog/article page template |
| `blog-listing.html` | Blog index page |
| `terms.html` | Legal/terms page |
| `website-template.html` | Internal reference page holding site sections that aren't currently live (not linked from the site) |
| `css/` | Site-wide stylesheets |
| `js/` | Front-end scripts |
| `images/`, `new-screenshots/`, `blog/` | Static assets |

## Local preview

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Editing conventions

- Make changes directly in the relevant HTML/CSS/JS file — no build step required.
- Keep styling in `css/` rather than adding inline or duplicate styles.
- Preserve relative asset paths and existing IDs/classes/data attributes, since they're referenced by JS.
- If a change affects page content, update it consistently across `index.html`, `index_zh.html`, and any other relevant page.
- Check both desktop and mobile-sized views for layout changes.

See [CLAUDE.md](CLAUDE.md) for the full set of working conventions.

## Deployment

Hosted via GitHub Pages directly from this repo (see `.nojekyll`). Changes pushed to `main` go live automatically.
