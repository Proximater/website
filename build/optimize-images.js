// Optimises the images in the built site (dist/) and rewrites references to them.
//
// - Opaque PNG/JPEG (screenshots, photos, slides) -> WebP, scaled down to fit maxWidth x maxHeight.
// - PNGs with real transparency (logos, badges, phone mock-ups) keep their format and pixels;
//   they are only recompressed losslessly, and only if the result is pixel-identical.
// - Images used for link previews (og:image, twitter:image) are left untouched.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { findRefs, listFiles, resolveRef } from "./asset-refs.js";

export const IMAGE_DEFAULTS = {
  quality: 85, // WebP quality for opaque images
  maxWidth: 2560, // enough for a full-width retina banner
  maxHeight: 2000, // enough for a tall phone screenshot on a retina screen
  minSavings: 0.1, // keep the original unless WebP is at least 10% smaller
  exclude: [], // site-relative paths or RegExps to leave untouched
};

/** Vite plugin: optimises the images in the build output once the bundle is written. */
export function imageOptimizer(options = {}) {
  let outDir;
  let logger;
  return {
    name: "optimize-images",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      logger = config.logger;
    },
    async closeBundle() {
      await optimizeImages(outDir, { ...options, logger });
    },
  };
}

export async function optimizeImages(outDir, options = {}) {
  const { logger = console, ...rest } = options;
  const opts = { ...IMAGE_DEFAULTS, ...rest };
  const files = listFiles(outDir);
  const texts = files.filter((f) => /\.(html|css|js)$/i.test(f));
  const previewImages = findPreviewImages(outDir, texts);
  const taken = new Set(files);
  const renames = new Map();
  const report = [];

  for (const file of files.filter((f) => /\.(png|jpe?g)$/i.test(f))) {
    const excluded = opts.exclude.some((e) => (e instanceof RegExp ? e.test(file) : e === file));
    if (excluded || previewImages.has(file)) continue;

    const abs = path.join(outDir, file);
    const input = fs.readFileSync(abs);
    const transparent = await isTransparent(input);
    let output = null;
    let target = file;
    if (transparent) {
      if (/\.png$/i.test(file)) output = await losslessPng(input);
    } else {
      target = file.replace(/\.(png|jpe?g)$/i, ".webp");
      if (taken.has(target)) {
        logger.warn(`  images: skipped ${file}, ${target} already exists`);
        continue;
      }
      output = await toWebp(input, opts);
    }
    if (!output) continue;

    fs.writeFileSync(path.join(outDir, target), output);
    if (target !== file) {
      fs.unlinkSync(abs);
      taken.add(target);
      renames.set(file, target);
    }
    report.push({ file, target, before: input.length, after: output.length });
  }

  rewriteRefs(outDir, texts, renames);
  logReport(report, logger);
}

async function isTransparent(input) {
  const { hasAlpha } = await sharp(input).metadata();
  if (!hasAlpha) return false;
  const { channels } = await sharp(input).stats();
  return channels[channels.length - 1].min < 255;
}

async function losslessPng(input) {
  const output = await sharp(input)
    .keepIccProfile()
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
    .toBuffer();
  if (output.length >= input.length) return null;
  const pixels = (buf) => sharp(buf).ensureAlpha().raw().toBuffer();
  const [a, b] = await Promise.all([pixels(input), pixels(output)]);
  return a.equals(b) ? output : null;
}

async function toWebp(input, opts) {
  const output = await sharp(input)
    .autoOrient()
    .resize({ width: opts.maxWidth, height: opts.maxHeight, fit: "inside", withoutEnlargement: true })
    .removeAlpha()
    .keepIccProfile()
    .webp({ quality: opts.quality, effort: 6, smartSubsample: true })
    .toBuffer();
  return output.length <= input.length * (1 - opts.minSavings) ? output : null;
}

// Crawlers don't all accept WebP, so og:image / twitter:image files keep their format.
function findPreviewImages(outDir, texts) {
  const found = new Set();
  for (const file of texts.filter((f) => f.endsWith(".html"))) {
    const html = fs.readFileSync(path.join(outDir, file), "utf8");
    for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
      if (!/(?:property|name)\s*=\s*["'](?:og|twitter):image/i.test(tag)) continue;
      const content = /content\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
      if (content && !/^[a-z]+:|^\/\//i.test(content)) found.add(resolveRef(content, file));
    }
  }
  return found;
}

function rewriteRefs(outDir, texts, renames) {
  if (!renames.size) return;
  for (const file of texts) {
    const abs = path.join(outDir, file);
    const text = fs.readFileSync(abs, "utf8");
    let out = "";
    let last = 0;
    for (const ref of findRefs(text)) {
      if (!renames.has(resolveRef(ref.value, file))) continue;
      out += text.slice(last, ref.start) + ref.value.replace(/\.(png|jpe?g)$/i, ".webp");
      last = ref.end;
    }
    if (last) fs.writeFileSync(abs, out + text.slice(last));
  }
}

function logReport(report, logger) {
  const kb = (n) => `${Math.round(n / 1024)} kB`;
  for (const r of report) {
    const what = r.target === r.file ? "lossless" : `-> ${path.posix.basename(r.target)}`;
    logger.info(`  images: ${r.file} ${what}  ${kb(r.before)} -> ${kb(r.after)}`);
  }
  const before = report.reduce((n, r) => n + r.before, 0);
  const after = report.reduce((n, r) => n + r.after, 0);
  logger.info(`images: optimised ${report.length} files, ${kb(before)} -> ${kb(after)}`);
}
