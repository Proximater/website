import type { ParseKeys } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import phone3 from "../../images/_phone/phone-3.png?localized";
import { useImageTranslation } from "../hooks/useImageTranslation";
import { Animated } from "../components/Animated";
import { RichText } from "../components/RichText";
import { faCheck } from "../icons";
import { useTranslation } from "react-i18next";

const POINTS: ParseKeys[] = [
  "why.points.live",
  "why.points.realTime",
  "why.points.secure",
  "why.points.noNoise",
  "why.points.free",
];

export function WhyProximater() {
  const { t } = useTranslation();
  const { img } = useImageTranslation();
  return (
    <section id="content-2" className="bg-scroll bg-lightgrey wide-60 content-section division">
      <div className="container">
        <div className="row d-flex align-items-center">
          <Animated className="col-md-6" animation="fadeInRight" delay={500}>
            <div className="content-img">
              <img className="img-fluid" src={img(phone3)} alt="content-image" />
            </div>
          </Animated>
          <div className="col-md-6">
            <div className="content-txt ind-45">
              <Animated as="h2" className="h2-xs" animation="fadeInLeft" delay={300}>
                <RichText k="why.title" />
              </Animated>
              <Animated as="h4" className="h2-xs" animation="fadeInLeft" delay={400}>
                {t("why.intro")}
              </Animated>
              <Animated as="ul" className="features" animation="fadeInLeft" delay={600}>
                {POINTS.map((key) => (
                  <li key={key}>
                    <FontAwesomeIcon icon={faCheck} className="tick-icon green-colour" />
                    <RichText k={key} />
                  </li>
                ))}
              </Animated>
              <Animated as="p" animation="fadeInLeft" delay={700}>
                <RichText k="why.keptLive" />
              </Animated>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
