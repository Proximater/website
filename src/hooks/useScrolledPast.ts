import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};

/** True once the window has scrolled further than `offset` pixels. */
export function useScrolledPast(offset: number): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > offset,
    () => false,
  );
}
