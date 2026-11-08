import { useEffect, useRef, useState } from "react";

/**
 * Bootstrap 4 dropdown behaviour: the toggle opens and closes it; any other click (including
 * on a menu item) or Escape closes it.
 */
export function useDropdown<T extends HTMLElement>() {
  const toggleRef = useRef<T>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!toggleRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return { toggleRef, open, toggle: () => setOpen((o) => !o) };
}
