/// <reference types="vite/client" />

// vite/client covers lower-case extensions; some screenshots are named *.PNG.
declare module "*.PNG" {
  const src: string;
  export default src;
}
