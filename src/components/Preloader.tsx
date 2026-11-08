import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logoLight from "../../images/_logo/proximater-logo-square-light.png";

/** Frames of the glitch intro; `effect` is a class from styles/preloader.css. */
const FRAMES = [
  { src: logoLight, textKey: "preloader.waitIsOver", effect: "glitch4" },
  { src: logoLight, textKey: "preloader.waitIsOver", effect: "glitchNone" },
] as const;

const randomStaticMode = () => Math.random() > 0.5;

type Phase = "showing" | "fading" | "gone";

/**
 * Full-screen glitch intro shown until the page has loaded, then faded out over 1s.
 * The text stays hidden until the visitor's language has loaded, so it never flashes English.
 */
export function Preloader({ pageReady }: { pageReady: boolean }) {
  const { t, ready } = useTranslation(undefined, { useSuspense: false });
  const [frame, setFrame] = useState(0);
  const [staticMode, setStaticMode] = useState(randomStaticMode);
  const [phase, setPhase] = useState<Phase>("showing");
  const [spinner, setSpinner] = useState<Phase>("showing");

  // Next frame after a random 400–1000 ms, switching the static noise at random.
  useEffect(() => {
    if (frame >= FRAMES.length - 1) return;
    const timer = setTimeout(() => {
      setFrame((f) => f + 1);
      setStaticMode(randomStaticMode());
    }, Math.random() * 600 + 400);
    return () => clearTimeout(timer);
  }, [frame]);

  // Once loaded: fade the intro (1s CSS animation) and the white spinner layer behind it
  // (100 ms delay, 200 ms fade), as the jQuery version did on window load.
  useEffect(() => {
    if (!pageReady) return;
    setPhase("fading");
    const timers = [
      setTimeout(() => setPhase("gone"), 1000),
      setTimeout(() => setSpinner("fading"), 100),
      setTimeout(() => setSpinner("gone"), 300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [pageReady]);

  const current = FRAMES[frame] ?? FRAMES[0];
  return (
    <>
      {phase !== "gone" && (
        <div id="preloader" className={phase === "fading" ? "fade-out" : undefined}>
          <div id="glitch-container" className={staticMode ? "static-mode" : undefined}>
            <div id="staticNoise"></div>
            <img className={`glitch-img ${current.effect}`} id="glitchImage" src={current.src} alt="Glitchy Image" />
          </div>
          <p id="glitchText" style={ready ? undefined : { visibility: "hidden" }}>
            {ready ? t(current.textKey) : " "}
          </p>
        </div>
      )}
      {spinner !== "gone" && (
        <div
          id="loader-wrapper"
          style={{ opacity: spinner === "fading" ? 0 : 1, transition: "opacity 200ms ease-in-out" }}
        >
          <div id="loader">
            <ul className="cssload-flex-container"></ul>
          </div>
        </div>
      )}
    </>
  );
}
