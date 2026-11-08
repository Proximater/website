import { useSyncExternalStore, type ReactNode } from "react";
import ReactSlick, { type Settings } from "react-slick";

// react-slick is CommonJS; depending on the bundler its default export can arrive wrapped.
const Slider = (ReactSlick as unknown as { default?: typeof ReactSlick }).default ?? ReactSlick;

export type Breakpoint = { breakpoint: number; settings: Settings };

const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};

/** Window width without the scrollbar, which is what jQuery slick compared breakpoints to. */
const useWindowWidth = () =>
  useSyncExternalStore(
    subscribe,
    () => document.documentElement.clientWidth,
    () => Number.POSITIVE_INFINITY,
  );

type CarouselProps = {
  className: string;
  settings: Settings;
  /** As in slick 1.6: a breakpoint's settings apply while the window is narrower than it. */
  responsive?: Breakpoint[];
  children: ReactNode;
};

/**
 * react-slick with slick 1.6's breakpoint handling. (react-slick 0.31 only applies its own
 * `responsive` settings when a media query changes, not on first load, so a phone gets the
 * desktop carousel.) Like slick, it rebuilds the carousel when the breakpoint changes.
 */
export function Carousel({ className, settings, responsive = [], children }: CarouselProps) {
  const width = useWindowWidth();
  const active = [...responsive].sort((a, b) => a.breakpoint - b.breakpoint).find((r) => width < r.breakpoint);
  const merged: Settings = active ? { ...settings, ...active.settings } : settings;
  // slick added slick-dotted (30px of room for the dots, in slick-theme.css) when dots were on.
  const classes = merged.dots ? `${className} slick-dotted` : className;

  return (
    <Slider key={active?.breakpoint ?? "default"} className={classes} {...merged}>
      {children}
    </Slider>
  );
}
