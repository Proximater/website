// Translated images.
//
// Importing an image with ?localized gives every language version of it:
//
//   import screenshot from "../../images/foo.png?localized";
//   const { img } = useImageTranslation();   // src/i18n-images.ts
//   <img src={img(screenshot)} />
//
// Translations sit next to the original, with the language code before the extension (the
// same codes as src/locales/):
//
//   foo.png          default, used for any language without its own version
//   foo.zh-Hant.png  Traditional Chinese
//   foo.zh-Hans.png  Simplified Chinese
//
// A translation may have a different extension from the original (foo.zh-Hant.jpg). The module
// exports { default: url, "zh-Hant": url, ... }. Each version is an ordinary image import, so
// the build optimises it like any other image.
import { readdirSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const QUERY = "?localized";
const PREFIX = "\0localized:";
const IMAGE_EXT = /^\.(png|jpe?g|webp|avif|gif|svg)$/i;
const LANGUAGE = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

/** Language versions of `file` in its folder, as [language, path] pairs. */
function findTranslations(file) {
  const dir = dirname(file);
  const stem = basename(file, extname(file));
  return readdirSync(dir).flatMap((name) => {
    const ext = extname(name);
    if (!IMAGE_EXT.test(ext) || !name.startsWith(stem + ".")) return [];
    const language = name.slice(stem.length + 1, -ext.length);
    return LANGUAGE.test(language) ? [[language, join(dir, name)]] : [];
  });
}

/** Is `file` a language version of some image (foo.zh-Hant.png)? */
function isTranslation(file) {
  const ext = extname(file);
  const language = extname(basename(file, ext)).slice(1);
  return IMAGE_EXT.test(ext) && LANGUAGE.test(language);
}

export function localizedImages() {
  const loaded = new Set();

  return {
    name: "localized-images",
    enforce: "pre",

    async resolveId(source, importer) {
      if (!source.endsWith(QUERY)) return null;
      const resolved = await this.resolve(source.slice(0, -QUERY.length), importer, { skipSelf: true });
      return resolved && PREFIX + resolved.id;
    },

    load(id) {
      if (!id.startsWith(PREFIX)) return null;
      const file = id.slice(PREFIX.length);
      loaded.add(id);
      const versions = [["default", file], ...findTranslations(file)];
      const imports = versions.map(([, path], i) => `import v${i} from ${JSON.stringify(path)};`);
      const entries = versions.map(([language], i) => `${JSON.stringify(language)}: v${i}`);
      return `${imports.join("\n")}\nexport default { ${entries.join(", ")} };\n`;
    },

    // Dev server: pick up a translation added or removed while it is running.
    configureServer(server) {
      const refresh = (file) => {
        if (!isTranslation(file)) return;
        const graph = server.environments.client.moduleGraph;
        for (const id of loaded) {
          if (dirname(id.slice(PREFIX.length)) !== dirname(file)) continue;
          const mod = graph.getModuleById(id);
          if (mod) graph.invalidateModule(mod);
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", refresh);
      server.watcher.on("unlink", refresh);
    },
  };
}
