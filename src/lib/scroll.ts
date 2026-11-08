// Eased window scrolling with the same timings and curves the jQuery version used.

export type Easing = (progress: number) => number;

/** jquery.easing's easeInSine (in-page navigation links). */
export const easeInSine: Easing = (p) => 1 - Math.cos((p * Math.PI) / 2);
/** jQuery's default "swing" easing (back-to-top button). */
export const swing: Easing = (p) => 0.5 - Math.cos(p * Math.PI) / 2;

let frame = 0;

/** Scrolls the window to `top` over `duration` ms; a new call cancels one in progress. */
export function animateScrollTo(top: number, duration: number, easing: Easing): void {
  cancelAnimationFrame(frame);
  const start = window.scrollY;
  const distance = top - start;
  const startTime = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, start + distance * easing(progress));
    if (progress < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
}

/** Header height the in-page links leave above the target section. */
const NAV_OFFSET = 60;

/** Smooth-scrolls to an in-page anchor such as "#faqs-1" ("slow" = 600 ms in jQuery). */
export function scrollToSection(hash: string): void {
  const target = hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  animateScrollTo(top, 600, easeInSine);
}
