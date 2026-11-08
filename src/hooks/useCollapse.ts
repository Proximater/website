import { useCallback, useRef, useState } from "react";

/** Bootstrap's `.collapsing` height transition is 0.35s; this is the fallback if transitionend never fires. */
const TRANSITION_MS = 400;

/**
 * Bootstrap 4's collapse (used for the mobile menu) without jQuery: toggles the same
 * `collapse` / `collapsing` / `show` classes and animates the height the same way, so the
 * theme CSS behaves exactly as before. Render the element with className "collapse …".
 */
export function useCollapse<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [open, setOpen] = useState(false);
  const busy = useRef(false);

  const transition = useCallback((show: boolean) => {
    const el = ref.current;
    if (!el || busy.current) return;
    busy.current = true;
    setOpen(show);

    const finish = () => {
      clearTimeout(timer);
      el.removeEventListener("transitionend", onEnd);
      el.classList.remove("collapsing");
      el.classList.add("collapse");
      el.classList.toggle("show", show);
      el.style.height = "";
      busy.current = false;
    };
    // Only the menu's own height transition counts, not ones bubbling up from its links.
    const onEnd = (e: TransitionEvent) => e.target === el && finish();
    const timer = setTimeout(finish, TRANSITION_MS);
    el.addEventListener("transitionend", onEnd);

    if (show) {
      el.classList.remove("collapse");
      el.classList.add("collapsing");
      el.style.height = "0px";
      void el.offsetHeight; // apply the start height before animating
      el.style.height = `${el.scrollHeight}px`;
    } else {
      el.style.height = `${el.getBoundingClientRect().height}px`;
      void el.offsetHeight;
      el.classList.add("collapsing");
      el.classList.remove("collapse", "show");
      el.style.height = "";
    }
  }, []);

  const toggle = useCallback(() => transition(!ref.current?.classList.contains("show")), [transition]);

  /** Closes at once, without the animation (what tapping a menu link did). */
  const closeNow = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("show", "collapsing");
    el.classList.add("collapse");
    el.style.height = "";
    busy.current = false;
    setOpen(false);
  }, []);

  return { ref, open, toggle, closeNow };
}
