import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Animated } from "../components/Animated";
import { RichText } from "../components/RichText";

const GROUPS = ["usability", "security", "realTime"] as const;

const headingStyle = { fontWeight: 400, marginTop: 25, marginBottom: 5 };

export function TechStack() {
  const { t } = useTranslation();
  return (
    <section id="js-tech-stack" className="bg-fixed wide-100 bg-scroll bg-dark tech-stack-bg-inner division">
      <div className="container white-color">
        <div className="row">
          <div className="col-md-10 offset-md-1 section-title hero-section">
            <Animated as="h2" className="h2-xs" animation="fadeInLeft" delay={300}>
              {t("tech.title")}
            </Animated>
            <Animated className="h2-xs" animation="fadeInLeft" delay={500} style={{ paddingTop: 30 }}>
              {GROUPS.map((group) => (
                <Fragment key={group}>
                  <h4 style={headingStyle}>
                    <strong>{t(`tech.${group}.title`)}</strong>
                  </h4>
                  <p>
                    <RichText k={`tech.${group}.text`} />
                  </p>
                </Fragment>
              ))}
            </Animated>
          </div>
        </div>
      </div>
    </section>
  );
}
