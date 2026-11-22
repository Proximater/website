// A page per language.
//
// English is the site root; every other language in src/locales/ gets a folder named after its
// code in lower case (src/i18n.ts follows the same rule):
//
//   index.html          English, and the default for search engines
//   zh-hant/index.html  Traditional Chinese
//   zh-hans/index.html  Simplified Chinese
//
// Each page is index.html with its <head> text (title, description, keywords, link-preview title
// and description) taken from the language's "meta" strings, so link previews and search engines
// see the right language without running the app. Every page also links to all the language
// versions (hreflang), names its own address as canonical, and uses an absolute link-preview image.
//
// The language pages are not files in the repo: the build generates them, and the dev server
// serves them at /zh-hant/ and /zh-hans/.
import { readFileSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const DEFAULT_LANGUAGE = "en";

function readLanguages(localesDir) {
  return readdirSync(localesDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const code = basename(name, ".json");
      const strings = JSON.parse(readFileSync(join(localesDir, name), "utf8"));
      return { code, folder: code === DEFAULT_LANGUAGE ? "" : `${code.toLowerCase()}/`, meta: strings.meta };
    })
    .sort((a, b) => (a.folder === "" ? -1 : b.folder === "" ? 1 : a.code.localeCompare(b.code)));
}

const escapeAttr = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** Sets the content of the <meta> whose `attr` is `key`; fails loudly if index.html lost the tag. */
function setMeta(html, attr, key, value) {
  const tag = new RegExp(`(<meta\\b[^>]*\\b${attr}="${key}"[^>]*?\\bcontent=")[^"]*(")`);
  if (!tag.test(html)) throw new Error(`language-pages: index.html has no <meta ${attr}="${key}">`);
  return html.replace(tag, (_, start, end) => start + escapeAttr(value) + end);
}

/** Relative URLs in index.html point from the site root; a page one folder down needs ../ */
const fromSubfolder = (html) =>
  html.replace(/\b(src|href)="(?![a-z][a-z0-9+.-]*:|\/|#)/gi, (_, attr) => `${attr}="../`);

/**
 * @param {{ siteUrl: string, localesDir?: string }} options
 *   siteUrl: the public address of the site root, ending in "/" (for canonical and hreflang links,
 *   which must be absolute).
 */
export function languagePages({ siteUrl, localesDir = "src/locales" }) {
  if (!siteUrl.endsWith("/")) throw new Error("language-pages: siteUrl must end with /");
  let root = process.cwd();
  let languages = [];
  const pageId = (lang) => join(root, lang.folder, "index.html");
  const subPages = () => languages.filter((l) => l.folder !== "");

  /** The language whose page `urlPath` is (/zh-hant/index.html -> zh-Hant; anything else -> en). */
  const languageOfPath = (urlPath) => {
    const folder = /^\/?([^/]+\/)index\.html$/.exec(urlPath)?.[1];
    return languages.find((l) => l.folder !== "" && l.folder === folder?.toLowerCase()) ?? languages[0];
  };

  const localise = (html, lang) => {
    const { meta } = lang;
    const pageUrl = siteUrl + lang.folder;
    html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang.code}"`);
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(meta.title)}</title>`);
    html = setMeta(html, "name", "description", meta.description);
    html = setMeta(html, "name", "keywords", meta.keywords);
    html = setMeta(html, "property", "og:title", meta.ogTitle);
    html = setMeta(html, "property", "og:description", meta.ogDescription);
    // Crawlers need the preview image's full address; index.html gives it from the site root.
    html = html.replace(/(<meta\b[^>]*\bproperty="og:image"[^>]*?\bcontent=")\/?([^"]*)"/, (_, start, path) =>
      /^[a-z]+:/i.test(path) ? `${start}${path}"` : `${start}${siteUrl}${path}"`,
    );
    const links = [
      `<link rel="canonical" href="${pageUrl}" />`,
      `<meta property="og:url" content="${pageUrl}" />`,
      ...languages.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${siteUrl + l.folder}" />`),
      `<link rel="alternate" hreflang="x-default" href="${siteUrl}" />`,
    ];
    return html.replace("</head>", `  ${links.join("\n    ")}\n  </head>`);
  };

  const subPageHtml = () => fromSubfolder(readFileSync(join(root, "index.html"), "utf8"));

  return {
    name: "language-pages",

    config(config) {
      root = resolve(config.root ?? process.cwd());
      languages = readLanguages(resolve(root, localesDir));
      // Added to the build's pages alongside index.html (vite.config.ts).
      return { build: { rolldownOptions: { input: subPages().map(pageId) } } };
    },

    resolveId(id) {
      return subPages().some((l) => pageId(l) === id) ? id : null;
    },

    load(id) {
      return subPages().some((l) => pageId(l) === id) ? subPageHtml() : null;
    },

    // "pre": before Vite rewrites the page's links, so the preview image is still root-relative.
    transformIndexHtml: {
      order: "pre",
      handler: (html, ctx) => localise(html, languageOfPath(ctx.path)),
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = new URL(req.url ?? "/", "http://localhost").pathname;
        const lang = subPages().find((l) => path.toLowerCase() === "/" + l.folder.slice(0, -1));
        if (lang) {
          // Like a static host: /zh-hant -> /zh-hant/, so the page's relative links work.
          res.writeHead(301, { Location: path + "/" });
          return res.end();
        }
        const page = subPages().find((l) => [`/${l.folder}`, `/${l.folder}index.html`].includes(path));
        if (!page) return next();
        try {
          const html = await server.transformIndexHtml(`/${page.folder}index.html`, subPageHtml(), req.originalUrl);
          res.setHeader("Content-Type", "text/html");
          res.end(html);
        } catch (e) {
          next(e);
        }
      });
    },
  };
}
