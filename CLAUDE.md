# CLAUDE.md

## Project overview
This repository contains the Proximater marketing website. It is a mostly static site built with plain HTML, CSS, and JavaScript, with no build step or package manager.

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
- images/, new-screenshots/, blog/: static assets

## Editing workflow
- Make changes directly in the relevant HTML/CSS/JS file.
- Preview the site locally with a simple static server if needed, for example:
  - python3 -m http.server 8000
- Verify the result in both desktop and mobile-sized views when changing layout or content.
- If a page change should also appear in the Chinese version, apply the same update there when appropriate.

## Notes
- There is no automated build or test pipeline for this project.
- Keep content polished and concise, since this is a marketing site.
- Be careful with image replacements and ensure they still fit the layout and performance expectations.
