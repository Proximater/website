/// <reference types="vite/client" />

// vite/client covers lower-case extensions; some screenshots are named *.PNG.
declare module "*.PNG" {
  const src: string;
  export default src;
}

// Images imported with ?localized carry every language version (build/localized-images.js).
declare module "*?localized" {
  const image: import("./hooks/useImageTranslation").LocalizedImage;
  export default image;
}
