import { Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "./components/Header";
import { LightboxProvider } from "./components/Lightbox";
import { Preloader } from "./components/Preloader";
import { ScrollUp } from "./components/ScrollUp";
import { waitForPageAssets } from "./lib/pageAssets";
import { Business } from "./sections/Business";
import { Faqs } from "./sections/Faqs";
import { Features } from "./sections/Features";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Reviews } from "./sections/Reviews";
import { Screens } from "./sections/Screens";
import { Social } from "./sections/Social";
import { TechStack } from "./sections/TechStack";
import { WhyProximater } from "./sections/WhyProximater";

/** Keeps the document title and description in the visitor's language. */
function useTranslatedDocumentMeta() {
  const { t, i18n, ready } = useTranslation(undefined, { useSuspense: false });
  useEffect(() => {
    if (!ready) return;
    document.title = t("meta.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));
    document.querySelector('meta[name="keywords"]')?.setAttribute("content", t("meta.keywords"));
  }, [t, i18n.resolvedLanguage, ready]);
}

function Page({ onLoaded }: { onLoaded: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) void waitForPageAssets(ref.current).then(onLoaded);
  }, [onLoaded]);

  return (
    <div id="page" className="page" ref={ref}>
      <Header />
      <Hero />
      <Features />
      <Screens />
      <WhyProximater />
      <Business />
      <Social />
      <Reviews />
      <TechStack />
      <Faqs />
      <Footer />
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [onLoaded] = useState(() => () => setLoaded(true));
  useTranslatedDocumentMeta();

  return (
    <LightboxProvider>
      <Preloader pageReady={loaded} />
      {/* The page renders once the visitor's language has loaded; the preloader covers it. */}
      <Suspense fallback={null}>
        <Page onLoaded={onLoaded} />
      </Suspense>
      <ScrollUp />
    </LightboxProvider>
  );
}
