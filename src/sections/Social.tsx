import { useTranslation } from "react-i18next";
import social1 from "../../images/_deck/proximater-social-1.png?localized";
import social2 from "../../images/_deck/proximater-social-2.png?localized";
import social3 from "../../images/_deck/proximater-social-3.png?localized";
import { Animated } from "../components/Animated";
import { RichText } from "../components/RichText";
import { useImageTranslation } from "../hooks/useImageTranslation";

const SCREENSHOTS = [
  { src: social1, delay: 600 },
  { src: social2, delay: 700 },
  { src: social3, delay: 800 },
];

export function Social() {
  const { t } = useTranslation();
  const { img } = useImageTranslation();
  return (
    <section id="social-1" className="bg-lightgrey download-section">
      <div className="bg-scroll bg-inner bg-dark division">
        <div className="container white-color">
          <div className="row d-flex align-items-center">
            <div className="col-md-6">
              <Animated as="h2" className="h2-lg" animation="fadeInLeft" delay={300}>
                {t("social.title")}
              </Animated>
              <Animated as="h4" className="h2-xs" animation="fadeInLeft" delay={400}>
                {t("social.subtitle")}
              </Animated>
              <br />
              <Animated as="p" animation="fadeInLeft" delay={500}>
                <RichText k="social.text" />
              </Animated>
              <Animated as="h4" className="h2-xs" animation="fadeInLeft" delay={600}>
                <RichText k="social.comingSoon" />
              </Animated>
            </div>
            <div className="col-md-6">
              <div style={{ padding: 50 }}>
                {SCREENSHOTS.map(({ src, delay }) => (
                  <Animated key={src.default} className="social-item" animation="fadeInRight" delay={delay}>
                    <img src={img(src)} alt="screenshot" />
                  </Animated>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
