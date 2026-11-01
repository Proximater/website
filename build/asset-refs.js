// Finds local file references in built HTML/CSS/JS, so the build can copy what pages
// load at runtime and rewrite file names after image conversion.
import fs from "node:fs";
import path from "node:path";

const EXT = "png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|mov|css|js|woff2?|ttf|eot|otf|php|pdf|json|xml|txt|html";
// Spaces in file names must be written as %20 in references.
const REF_RE = new RegExp(String.raw`[\w@%~.\/+-]+\.(?:${EXT})(?![\w-])`, "gi");

export function* findRefs(text) {
  for (const m of text.matchAll(REF_RE)) {
    // skip the path part of external URLs (https://host/x.png, //host/x.png)
    if (m[0].startsWith("//") || text[m.index - 1] === ":") continue;
    yield { value: m[0], start: m.index, end: m.index + m[0].length };
  }
}

// Site-relative path for a reference ("images/a.png"), or null if it points outside the site.
// HTML and CSS resolve against their own folder; JS strings resolve against the page (site root).
export function resolveRef(value, fromFile) {
  let ref = value;
  try {
    ref = decodeURIComponent(value);
  } catch {}
  const baseDir = /\.(html|css)$/i.test(fromFile) ? path.posix.dirname(fromFile) : "";
  const resolved = ref.startsWith("/") ? path.posix.normalize(ref.slice(1)) : path.posix.join(baseDir, ref);
  return resolved.startsWith("..") ? null : resolved;
}

// A whole HTML comment; `<!-->` and `<!--->` are complete (empty) comments, as browsers parse them.
export const HTML_COMMENT = String.raw`<!--(?:-?>|[\s\S]*?-->)`;

// Commented-out markup isn't loaded, except IE conditional comments.
export const stripHtmlComments = (html) =>
  html.replace(new RegExp(HTML_COMMENT, "g"), (c) => (/^<!--\s*\[if/.test(c) ? c : ""));

export function listFiles(dir, prefix = "") {
  return fs.readdirSync(path.join(dir, prefix), { withFileTypes: true }).flatMap((entry) => {
    const rel = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? listFiles(dir, rel) : [rel];
  });
}
