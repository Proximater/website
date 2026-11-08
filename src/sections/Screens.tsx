import type { Settings } from "react-slick";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";
import heroPicNoBorder from "../../new-screenshots/hero-pic-noborder.png?localized";
import img8754 from "../../new-screenshots/IMG_8754.PNG?localized";
import img8758 from "../../new-screenshots/IMG_8758.PNG?localized";
import img8742 from "../../new-screenshots/IMG_8742.PNG?localized";
import img8744 from "../../new-screenshots/IMG_8744.PNG?localized";
import imgP1 from "../../new-screenshots/img-p1.PNG?localized";
import imgP2 from "../../new-screenshots/img-p2.PNG?localized";
import imgP3 from "../../new-screenshots/img-p3.PNG?localized";
import imgP4 from "../../new-screenshots/img-p4.PNG?localized";
import img8767 from "../../new-screenshots/IMG_8767.PNG?localized";
import img8765 from "../../new-screenshots/IMG_8765.PNG?localized";
import img8768 from "../../new-screenshots/IMG_8768.PNG?localized";
import img3889 from "../../images/_phone/small/IMG_3889.jpg?localized";
import iphoneFrame from "../../images/iphone2.png";
import { Carousel, type Breakpoint } from "../components/Carousel";
import { RichText } from "../components/RichText";
import { useImageTranslation, type LocalizedImage } from "../hooks/useImageTranslation";

/** Same settings the jQuery slick carousel used. */
const SETTINGS: Settings = {
  infinite: true,
  autoplay: true,
  centerMode: true,
  dots: true,
  autoplaySpeed: 3000,
  speed: 600,
  slidesToShow: 5,
  variableWidth: true,
  arrows: true,
};

const RESPONSIVE: Breakpoint[] = [
  { breakpoint: 769, settings: { slidesToShow: 3 } },
  {
    breakpoint: 480,
    settings: { dots: false, slidesToShow: 1, variableWidth: false, fade: true, cssEase: "linear" },
  },
];

type Slide = {
  image: LocalizedImage;
  /** Heading; "Pick up" slides share screens.pickUp. */
  title: ParseKeys;
  subtitle?: ParseKeys;
  /** Step number shown after the subtitle (the "& Publish" slides). */
  step?: number;
  caption: ParseKeys;
  /** Caption contains markup. */
  richCaption?: boolean;
};

const SLIDES: Slide[] = [
  { image: heroPicNoBorder, title: "screens.pickUp", subtitle: "screens.play.subtitle", caption: "screens.play.caption" },
  {
    image: img8754,
    title: "screens.pickUp",
    subtitle: "screens.go.subtitle",
    caption: "screens.go.caption",
    richCaption: true,
  },
  { image: img8758, title: "screens.arrive.title", caption: "screens.arrive.caption" },
  { image: img8742, title: "screens.pickUp", subtitle: "screens.publish.subtitle", step: 1, caption: "screens.publish.step1" },
  { image: img8744, title: "screens.pickUp", subtitle: "screens.publish.subtitle", step: 2, caption: "screens.publish.step2" },
  { image: imgP1, title: "screens.pickUp", subtitle: "screens.publish.subtitle", step: 3, caption: "screens.publish.step3" },
  { image: imgP2, title: "screens.pickUp", subtitle: "screens.publish.subtitle", step: 4, caption: "screens.publish.step4" },
  { image: imgP3, title: "screens.control.title", subtitle: "screens.control.subtitle", caption: "screens.control.caption" },
  {
    image: imgP4,
    title: "screens.engagement.title",
    subtitle: "screens.engagement.subtitle",
    caption: "screens.engagement.caption",
  },
  { image: img8767, title: "screens.share.title", subtitle: "screens.share.subtitle", caption: "screens.share.caption" },
  {
    image: img8765,
    title: "screens.navigate.title",
    subtitle: "screens.navigate.subtitle",
    caption: "screens.navigate.caption",
  },
  {
    image: img8768,
    title: "screens.travelModes.title",
    subtitle: "screens.travelModes.subtitle",
    caption: "screens.travelModes.caption",
  },
  { image: img3889, title: "screens.privacy.title", subtitle: "screens.privacy.subtitle", caption: "screens.privacy.caption" },
];

export function Screens() {
  const { t } = useTranslation();
  const { img } = useImageTranslation();
  return (
    <section id="screens-1" className="bg-scroll bg-green screens-section division">
      <div className="container">
        <div className="row">
          <div className="col-md-10 offset-md-1 white-color section-title">
            <h2 className="h2-lg">{t("screens.title")}</h2>
            <p>{t("screens.intro")}</p>
          </div>
        </div>
      </div>
      <div className="screenshots-wrap">
        <Carousel className="screens-carousel" settings={SETTINGS} responsive={RESPONSIVE}>
          {SLIDES.map((slide) => (
            <div key={slide.image.default} className="carousel-item">
              <img src={img(slide.image)} height="595" width="306" alt="screenshot" />
              <h4>{t(slide.title)}</h4>
              <h5>
                {slide.subtitle && t(slide.subtitle)}
                {slide.step && (
                  <>
                    {" "}
                    <sup>{slide.step}</sup>
                  </>
                )}
              </h5>
              <h6>{slide.richCaption ? <RichText k={slide.caption} /> : t(slide.caption)}</h6>
            </div>
          ))}
        </Carousel>
        <div className="iphone-frame" style={{ pointerEvents: "none" }}>
          <img src={iphoneFrame} alt="iphone-image" />
        </div>
      </div>
    </section>
  );
}
