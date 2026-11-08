import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Animated } from "../components/Animated";
import { RichText } from "../components/RichText";
import { StoreBadgesStacked } from "../components/StoreBadges";
import { faCheck } from "../icons";

const PLAN_FEATURES: ParseKeys[] = [
  "business.plan.unlimited",
  "business.plan.promotions",
  "business.plan.audience",
];

export function Business() {
  const { t } = useTranslation();
  return (
    <section id="pricing-1" className="bg-grey wide-100 pricing-section division">
      <div className="container">
        <div className="row">
          <Animated className="col-md-10 offset-md-1 section-title" animation="fadeInUp" delay={200}>
            <Animated as="h2" className="h2-lg" animation="fadeInUp" delay={300}>
              {t("business.title")}
            </Animated>
            <br />
            <h4 style={{ fontWeight: 600 }}>
              {t("business.pitch")}
              <br />
              <br />
            </h4>
            <h5 style={{ fontWeight: 500 }}>
              <RichText k="business.idea" />
            </h5>
            <p>{t("business.audience")}</p>
          </Animated>
        </div>
        <div>
          <div className="col">
            <Animated
              className="col-md"
              animation="fadeInUp"
              delay={400}
              style={{
                alignContent: "center",
                alignSelf: "center",
                maxWidth: 400,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div className="pricing-table m-bottom-40">
                <div className="pricing-plan m-bottom-10">
                  <h4 className="h4-md">
                    Proximater
                    <br />
                    <span style={{ fontSize: "0.9em" }} className="proximater-red">
                      {t("business.plan.name")}
                    </span>
                  </h4>
                </div>
                <h6>{t("business.plan.available")}</h6>
                <ul className="features">
                  {PLAN_FEATURES.map((key) => (
                    <li key={key}>
                      <FontAwesomeIcon icon={faCheck} className="tick-icon green-colour" />
                      {t(key)}
                    </li>
                  ))}
                </ul>
                <br />
                <span className="price">{t("business.plan.price")}</span>
                <br />
                <br />
                <StoreBadgesStacked className="stores-badge centered" />
              </div>
            </Animated>
          </div>
        </div>
      </div>
    </section>
  );
}
