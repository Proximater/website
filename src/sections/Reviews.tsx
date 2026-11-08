import type { Settings } from "react-slick";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import avatarGiftShop from "../../new-screenshots/small/IMG_3906.jpg";
import avatarFrenchToast from "../../new-screenshots/small/IMG_3908.jpg";
import avatarKori from "../../new-screenshots/small/IMG_3911.PNG";
import avatarPradThai from "../../new-screenshots/small/IMG_3909.jpg";
import avatarLionVibes from "../../new-screenshots/small/IMG_3905.jpg";
import { Carousel, type Breakpoint } from "../components/Carousel";
import { RichText } from "../components/RichText";

/** Same settings the jQuery slick carousel used. */
const SETTINGS: Settings = {
  centerMode: true,
  autoplay: true,
  centerPadding: "0px",
  speed: 800,
  slidesToShow: 3,
  dots: true,
};

const RESPONSIVE: Breakpoint[] = [
  { breakpoint: 1199, settings: { arrows: false, centerMode: true, centerPadding: "0px", slidesToShow: 3 } },
  { breakpoint: 991, settings: { arrows: false, centerMode: true, centerPadding: "0px", slidesToShow: 3 } },
  { breakpoint: 800, settings: { arrows: false, centerMode: true, centerPadding: "0px", slidesToShow: 1 } },
  { breakpoint: 767, settings: { arrows: false, centerMode: true, centerPadding: "0px", slidesToShow: 1 } },
  { breakpoint: 648, settings: { arrows: false, centerMode: true, centerPadding: "0px", slidesToShow: 1 } },
];

type Review = {
  id: "giftShop" | "frenchToast" | "kori" | "pradThai" | "lionVibes";
  avatar: string;
  /** Business name, or a translation key when it is a description rather than a name. */
  author: string | ParseKeys;
  translatedAuthor?: boolean;
  place: string;
  /** Quote contains markup. */
  rich: boolean;
};

const REVIEWS: Review[] = [
  {
    id: "giftShop",
    avatar: avatarGiftShop,
    author: "reviews.giftShop.author",
    translatedAuthor: true,
    place: "Brixton Village",
    rich: true,
  },
  { id: "frenchToast", avatar: avatarFrenchToast, author: "Le French Toast", place: "Pop Brixton", rich: true },
  { id: "kori", avatar: avatarKori, author: "Kori Hair and Beauty", place: "Brixton", rich: true },
  { id: "pradThai", avatar: avatarPradThai, author: "Prad Thai", place: "Pop Brixton", rich: true },
  { id: "lionVibes", avatar: avatarLionVibes, author: "Lion Vibes", place: "Brixton Village", rich: false },
];

export function Reviews() {
  const { t } = useTranslation();
  return (
    <section id="reviews-2" className="wide-100 bg-lightgrey reviews-section division">
      <div className="container">
        <div className="row">
          <div className="col-md-10 offset-md-1 download-section section-title">
            <h2 className="h2-lg">{t("reviews.title")}</h2>
            <p>
              <RichText k="reviews.intro" />
            </p>
          </div>
        </div>
        <div className="reviews-carousel">
          <Carousel className="center slider" settings={SETTINGS} responsive={RESPONSIVE}>
            {REVIEWS.map((r) => (
              <div key={r.id} className="review-2">
                <div className="review-txt">
                  <h5 className="h5-lg">{t(`reviews.${r.id}.title`)}</h5>
                  <p>{r.rich ? <RichText k={`reviews.${r.id}.quote`} /> : t(`reviews.${r.id}.quote`)}</p>
                </div>
                <div className="testimonial-avatar clearfix">
                  <img src={r.avatar} alt="review-author-avatar" />
                  <p className="testimonial-autor">
                    {r.translatedAuthor ? t(r.author as ParseKeys) : r.author}
                  </p>
                  <span>{r.place}</span>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
