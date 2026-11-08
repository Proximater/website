import { useTranslation } from "react-i18next";
import { Animated } from "../components/Animated";
import { RichText } from "../components/RichText";

export function Faqs() {
  const { t } = useTranslation();
  return (
    <section id="faqs-1" className="bg-fixed bg-lightgrey wide-60 faqs-section division">
      <div className="container">
        <div className="row">
          <div className="col-md-10 offset-md-1 section-title">
            <h2 className="h2-lg">{t("faq.title")}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="questions-holder ind-30">
              <Animated className="question" animation="fadeInUp" delay={300}>
                <h5 className="h5-sm">{t("faq.broadcast.question")}</h5>
                <p>{t("faq.broadcast.answer")}</p>
              </Animated>
              <Animated className="question" animation="fadeInUp" delay={400}>
                <h5 className="h5-sm">{t("faq.account.question")}</h5>
                <p>
                  <RichText k="faq.account.answer" />
                </p>
              </Animated>
              <Animated className="question" animation="fadeInUp" delay={500}>
                <h5 className="h5-sm">{t("faq.dataSecurity.question")}</h5>
                <p>
                  <RichText k="faq.dataSecurity.answer" />
                </p>
              </Animated>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="questions-holder ind-30">
              <Animated className="question" animation="fadeInUp" delay={300}>
                <h5 className="h5-sm">{t("faq.download.question")}</h5>
                <p>{t("faq.download.answer")}</p>
              </Animated>
              <Animated className="question" animation="fadeInUp" delay={600}>
                <h5 className="h5-sm">{t("faq.privacy.question")}</h5>
                <p>{t("faq.privacy.answer")}</p>
              </Animated>
              <Animated className="question" animation="fadeInUp" delay={700}>
                <h5 className="h5-sm">{t("faq.responsibility.question")}</h5>
                <h6 className="grey-color">{t("faq.responsibility.contentTitle")}</h6>
                <p>
                  <RichText k="faq.responsibility.contentText" />
                </p>
                <h6 className="grey-color">{t("faq.responsibility.environmentTitle")}</h6>
                <p>{t("faq.responsibility.environmentText")}</p>
              </Animated>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
