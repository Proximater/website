import Fade from "@mui/material/Fade";
import { useScrolledPast } from "../hooks/useScrolledPast";
import { animateScrollTo, swing } from "../lib/scroll";

/** jQuery's "swing" curve as CSS, for the fade. */
const SWING = "cubic-bezier(0.37, 0, 0.63, 1)";

/** Back-to-top button: fades in (200 ms) past 600px and glides to the top in 800 ms. */
export function ScrollUp() {
  const visible = useScrolledPast(600);
  return (
    <Fade in={visible} timeout={200} easing={SWING} unmountOnExit>
      <a
        id="scrollUp"
        href="#top"
        title=""
        style={{ display: "block", position: "fixed", zIndex: 2147483647 }}
        onClick={(e) => {
          e.preventDefault();
          animateScrollTo(0, 800, swing);
        }}
      ></a>
    </Fade>
  );
}
