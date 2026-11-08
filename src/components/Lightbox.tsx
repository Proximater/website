import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";

export type LightboxItem = { type: "image" | "iframe"; src: string };

const LightboxContext = createContext<(item: LightboxItem) => void>(() => {});

/** Opens an image or video in the lightbox. */
export const useLightbox = () => useContext(LightboxContext);

/** Magnific Popup leaves the image's 40px top and bottom padding inside the window height. */
const IMAGE_VERTICAL_PADDING = 80;

function useWindowHeight() {
  const [height, setHeight] = useState(() => window.innerHeight);
  useEffect(() => {
    const onResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return height;
}

/**
 * Lightbox for screenshots and the video. MUI's Modal handles focus, Escape and scroll locking;
 * inside it renders Magnific Popup's markup, so css/magnific-popup.css styles it as before.
 * Like Magnific, a click outside the image or on × closes it.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
  // Wraps the whole app, so it must not suspend while the language loads.
  const { t } = useTranslation(undefined, { useSuspense: false });
  const [item, setItem] = useState<LightboxItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const windowHeight = useWindowHeight();

  const open = useCallback((next: LightboxItem) => {
    setLoaded(next.type === "iframe");
    setItem(next);
  }, []);
  const close = () => setItem(null);

  // Magnific shows a zoom-out cursor over the backdrop while an image is open.
  useEffect(() => {
    if (item?.type !== "image") return;
    document.body.classList.add("mfp-zoom-out-cur");
    return () => document.body.classList.remove("mfp-zoom-out-cur");
  }, [item]);

  const onWrapClick = (e: MouseEvent) => {
    if (!content.current?.contains(e.target as Node)) close();
  };

  const closeButton = (
    <button title={t("lightbox.close")} type="button" className="mfp-close" onClick={close}>
      ×
    </button>
  );

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <Modal open={item !== null} onClose={close} hideBackdrop>
        <div>
          <div className="mfp-bg mfp-ready"></div>
          <div
            className="mfp-wrap mfp-close-btn-in mfp-auto-cursor mfp-ready"
            tabIndex={-1}
            style={{ overflowX: "hidden", overflowY: "auto" }}
            onClick={onWrapClick}
          >
            {item && (
              <div className={`mfp-container mfp-s-${loaded ? "ready" : "loading"} mfp-${item.type}-holder`}>
                <div className="mfp-content" ref={content}>
                  {item.type === "image" ? (
                    <div className="mfp-figure">
                      {closeButton}
                      <figure>
                        <img
                          className="mfp-img"
                          src={item.src}
                          alt=""
                          style={{ maxHeight: windowHeight - IMAGE_VERTICAL_PADDING }}
                          onLoad={() => setLoaded(true)}
                        />
                        <figcaption>
                          <div className="mfp-bottom-bar">
                            <div className="mfp-title"></div>
                            <div className="mfp-counter"></div>
                          </div>
                        </figcaption>
                      </figure>
                    </div>
                  ) : (
                    <div className="mfp-iframe-scaler">
                      {closeButton}
                      <iframe className="mfp-iframe" src={item.src} frameBorder="0" allowFullScreen></iframe>
                    </div>
                  )}
                </div>
                {!loaded && <div className="mfp-preloader">{t("lightbox.loading")}</div>}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </LightboxContext.Provider>
  );
}
