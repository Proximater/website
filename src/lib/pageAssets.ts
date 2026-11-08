// The old page hid its preloader on window "load", i.e. once every image, background and font
// had arrived. React renders the page after the scripts run, so wait for those explicitly.

const loaded = (el: HTMLImageElement) =>
  el.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        el.addEventListener("load", () => resolve(), { once: true });
        el.addEventListener("error", () => resolve(), { once: true });
      });

function backgroundImageUrls(root: HTMLElement): string[] {
  const urls = new Set<string>();
  for (const el of root.querySelectorAll<HTMLElement>("*")) {
    const bg = getComputedStyle(el).backgroundImage;
    for (const [, url] of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) if (url) urls.add(url);
  }
  return [...urls];
}

function preload(url: string): Promise<void> {
  const img = new Image();
  img.src = url;
  return loaded(img);
}

/** Resolves when the window has loaded and everything visible in `root` has been fetched. */
export function waitForPageAssets(root: HTMLElement): Promise<void> {
  const windowLoaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
  return Promise.all([
    windowLoaded,
    document.fonts.ready,
    ...Array.from(root.querySelectorAll("img"), loaded),
    ...backgroundImageUrls(root).map(preload),
  ]).then(() => undefined);
}
