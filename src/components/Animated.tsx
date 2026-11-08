import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type AnimatedProps = {
  /** Element to render. */
  as?: "div" | "h2" | "h4" | "p" | "ul";
  /** animate.css animation, e.g. "fadeInUp". */
  animation: string;
  /** Delay in ms after the element scrolls into view. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Plays an animate.css entrance animation the first time the element scrolls into view, as the
 * jQuery `.animated` + appear plugin did: the theme hides `.animated` until `.visible` is added.
 */
export function Animated({ as = "div", animation, delay, className, style, children }: AnimatedProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      timer = setTimeout(() => setShown(true), delay ?? 0);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  const classes = [className, "animated", shown && `${animation} visible`].filter(Boolean).join(" ");
  return createElement(as, { ref, className: classes, style }, children);
}
