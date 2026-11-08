import { useEffect, useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import heroPic1 from "../../new-screenshots/hero-pic.png";
import heroPic2 from "../../new-screenshots/hero-pic2.png";
import heroPic3 from "../../new-screenshots/hero-pic3.png";
import { Animated } from "../components/Animated";
import { useLightbox } from "../components/Lightbox";
import { RichText } from "../components/RichText";
import { StoreBadgesInline } from "../components/StoreBadges";

const HERO_IMAGES = [heroPic1, heroPic2, heroPic3];
const VIDEO_URL = "https://player.vimeo.com/video/941916041?badge=0&autopause=0&player_id=0&app_id=58479";

/** Cross-fades the hero phone screenshots every 4 seconds (styles/hero-images.css). */
function useRotatingIndex(count: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(timer);
  }, [count, intervalMs]);
  return index;
}

export function Hero() {
  const { t } = useTranslation();
  const openLightbox = useLightbox();
  const activeImage = useRotatingIndex(HERO_IMAGES.length, 4000);

  const openVideo = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openLightbox({ type: "iframe", src: VIDEO_URL });
  };

  return (
    <section id="hero-10" className="bg-fixed bg-lightgrey hero-section division">
      <div className="container">
        <div className="row d-flex align-items-center">
          <div className="col-md-7 col-lg-6">
            <div className="hero-txt">
              <Animated as="h2" className="h2-xs" animation="fadeInUp" delay={300}>
                <RichText k="hero.title" />
              </Animated>
              <h3></h3>
              <Animated as="h4" className="h2-xs" animation="fadeInUp" delay={400}>
                <RichText k="hero.subtitle" />
              </Animated>
              <Animated as="p" animation="fadeInUp" delay={450} style={{ fontWeight: 400 }}>
                {t("hero.intro")}
              </Animated>
              <Animated className="h2-xs" animation="fadeInUp" delay={500}>
                <br />
                <StoreBadgesInline />
                <p style={{ fontWeight: 300 }}>
                  <br />
                  <RichText k="hero.availability" />
                </p>
              </Animated>
              {/* Video link: hidden on the old page too; remove display:none to show it. */}
              <div className="hero-link-2" style={{ display: "none" }}>
                <Animated className="modal-video grey-color" animation="fadeInUp" delay={500}>
                  <div className="play-icon"></div>
                  <a className="video-popup" href={VIDEO_URL} onClick={openVideo}>
                    {t("hero.video")}
                  </a>
                </Animated>
              </div>
            </div>
          </div>
          <Animated className="col-md-5 col-lg-4 offset-lg-2" animation="fadeInRight" delay={500}>
            <div className="hero-img img-fluid">
              <div className="hero-img-container">
                {HERO_IMAGES.map((src, i) => (
                  <div key={src} className={`hero-img-layer${i === activeImage ? " active" : ""}`} data-index={i}>
                    <img className="img-fluid" src={src} alt={`hero-image-${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </Animated>
        </div>
      </div>
    </section>
  );
}
