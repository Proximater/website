// Vite plugin for this plain HTML/jQuery site.
//
// Vite bundles and minifies the local stylesheets only. Every other asset keeps its original
// path: classic <script>s, images (including lightbox links and paths inside inline scripts),
// php/ endpoints and og:image are copied into dist/ as-is, then images are optimised.
import fs from "node:fs";
import path from "node:path";
import { HTML_COMMENT, findRefs, listFiles, resolveRef, stripHtmlComments } from "./asset-refs.js";
import { optimizeImages } from "./optimize-images.js";

const CSS_MARKER = "<!-- static-site:css -->";
// Elements Vite would otherwise rewrite to hashed copies (and strips `vite-ignore` from).
const ASSET_TAG_RE = /<(img|source|video|audio|track|embed|object|input|image|use|link|meta|script)\b[^>]*>/gi;
const SKIP_DIRS = new Set(["node_modules", "dist", "_unused", "build", ".git", ".github"]);

export default function staticSite({ extraFiles = [], images = {} } = {}) {
  let root;
  let outDir;
  let logger;
  return [
    {
      name: "static-site:html",
      apply: "build",
      transformIndexHtml: { order: "pre", handler: markAssets },
    },
    {
      name: "static-site:css-position",
      apply: "build",
      transformIndexHtml: { order: "post", handler: placeCss },
    },
    {
      name: "static-site:emit",
      apply: "build",
      configResolved(config) {
        root = config.root;
        outDir = path.resolve(config.root, config.build.outDir);
        logger = config.logger;
      },
      async closeBundle() {
        copyReferencedFiles(root, outDir, extraFiles, logger);
        await optimizeImages(outDir, { ...images, logger });
      },
    },
  ];
}

// Tag every asset element except local stylesheets with `vite-ignore`, and mark where the
// stylesheets were so the bundled CSS goes back there (before the inline <style> overrides).
function markAssets(html) {
  let marked = false;
  // split() with a capture group puts the comments at odd indexes; leave those alone
  const parts = html.split(new RegExp(`(${HTML_COMMENT})`));
  return parts
    .map((part, i) => {
      if (i % 2) return part;
      return part.replace(ASSET_TAG_RE, (tag, name) => {
      if (/\svite-ignore\b/i.test(tag)) return tag;
      if (name.toLowerCase() === "script" && !/\ssrc\s*=/i.test(tag)) return tag;
        if (isLocalStylesheet(tag)) {
          if (marked) return tag;
          marked = true;
          return `${CSS_MARKER}\n    ${tag}`;
        }
        return tag.replace(/^<\w+/, (open) => `${open} vite-ignore`);
      });
    })
    .join("");
}

function isLocalStylesheet(tag) {
  if (!/^<link\b/i.test(tag) || !/\srel\s*=\s*["']?stylesheet/i.test(tag)) return false;
  const href = /\shref\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1] ?? "";
  return !/^([a-z]+:)?\/\//i.test(href);
}

function placeCss(html) {
  if (!html.includes(CSS_MARKER)) return html;
  const links = [];
  const rest = html.replace(/[ \t]*<link rel="stylesheet"[^>]*href="[^"]*\.css"[^>]*>\n?/g, (tag) => {
    if (/https?:|\/\//.test(tag)) return tag;
    links.push(tag.trim());
    return "";
  });
  return rest.replace(CSS_MARKER, links.join("\n    "));
}

// Copy every local file the built pages still reference (and, for scripts and stylesheets,
// what those reference in turn) from the source tree into dist/.
function copyReferencedFiles(root, outDir, extraFiles, logger) {
  let count = 0;
  const copy = (rel) => {
    const from = path.join(root, rel);
    const to = path.join(outDir, rel);
    if (SKIP_DIRS.has(rel.split("/")[0]) || fs.existsSync(to)) return false;
    if (!fs.existsSync(from) || !fs.statSync(from).isFile()) return false;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    count++;
    return true;
  };
  extraFiles.forEach(copy);
  const queue = listFiles(outDir).filter((f) => /\.(html|css|js)$/i.test(f));
  while (queue.length) {
    const file = queue.pop();
    let text = fs.readFileSync(path.join(outDir, file), "utf8");
    if (file.endsWith(".html")) text = stripHtmlComments(text);
    for (const { value } of findRefs(text)) {
      const rel = resolveRef(value, file);
      if (rel && copy(rel) && /\.(html|css|js)$/i.test(rel)) queue.push(rel);
    }
  }
  logger.info(`static-site: copied ${count} referenced files into ${path.basename(outDir)}/`);
}
