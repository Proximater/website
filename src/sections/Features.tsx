import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import slide8 from "../../images/_deck/Slide8.png";
import slide9 from "../../images/_deck/Slide9.png";
import slide10 from "../../images/_deck/Slide10.png";
import { Animated } from "../components/Animated";
import { useLightbox } from "../components/Lightbox";
import { RichText } from "../components/RichText";

const FEATURES = [
  {
    key: "broadcast",
    icon: "https://icongr.am/octicons/broadcast.svg?size=80&color=cc0033",
    image: slide8,
    imageClass: "img-fluid",
    delay: 300,
    breaks: 2,
  },
  {
    key: "explore",
    icon: "https://icongr.am/octicons/search.svg?size=80&color=cc0033",
    image: slide9,
    imageClass: "deck-img",
    delay: 400,
    breaks: 2,
  },
  {
    key: "connect",
    icon: "https://icongr.am/octicons/heart.svg?size=80&color=cc0033",
    image: slide10,
    imageClass: "img-fluid",
    imageStyle: { borderBottom: "1px silver solid" },
    delay: 500,
    breaks: 3,
  },
] as const;

export function Features() {
  const { t } = useTranslation();
  const openLightbox = useLightbox();

  const openImage = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openLightbox({ type: "image", src: e.currentTarget.href });
  };

  return (
    <section id="features-2" className="bg-lightgrey p-top-60 p-bottom-60 featuress-section division">
      <div className="container">
        <div className="row">
          <div className="col-md-10 offset-md-1 section-title">
            <h2 className="h2-lg">
              <RichText k="features.title" />
            </h2>
            <p>
              <strong>{t("features.intro")}</strong>
            </p>
          </div>
        </div>
        <div className="row" style={{ justifyContent: "center" }}>
          {FEATURES.map((f) => (
            <Animated key={f.key} className="col-md-6 col-lg-3" animation="fadeInUp" delay={f.delay}>
              <div className="fbox-2 box-icon-lg green-icon">
                <img className="deck-icon" src={f.icon} />
                <h3 className="feature-title">{t(`features.${f.key}.title`)}</h3>
                <p className="grey-color">
                  {t(`features.${f.key}.text`)}
                  {Array.from({ length: f.breaks }, (_, i) => (
                    <br key={i} />
                  ))}
                </p>
                <a className="image-popup" href={f.image} onClick={openImage}>
                  <img
                    className={f.imageClass}
                    src={f.image}
                    alt="content-image"
                    style={"imageStyle" in f ? f.imageStyle : undefined}
                  />
                </a>
              </div>
            </Animated>
          ))}
        </div>
        <div className="row">
          <div className="col-md-10 offset-md-1 section-title">
            <p>
              {t("features.realContent")}
              <br />
              <br />
              <strong>{t("features.crossPlatform")}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
