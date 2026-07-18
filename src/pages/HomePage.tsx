import { useCallback, useState } from "react";
import { SceneLoader } from "../three/SceneLoader";
import { useJourney } from "../lib/useJourney";
import { usePageMeta } from "../lib/usePageMeta";
import { useI18n } from "../i18n";
import { WORLDS } from "../lib/worlds";
import { Preloader } from "../components/Preloader";
import { ProgressRail } from "../components/ProgressRail";
import { Hero } from "../components/Hero";
import { Problem } from "../components/Problem";
import { IndexDial } from "../components/IndexDial";
import { WorldSection } from "../components/WorldSection";
import { XBrainSection } from "../components/XBrainSection";
import { Calculator } from "../components/Calculator";
import { XVerse } from "../components/XVerse";
import { JsonLd } from "../components/JsonLd";
import { organizationSchema, productNetworkSchema, webSiteSchema } from "../seo/schema";

/** The opening beat plays once per session, not on every return to "/". */
let preloaderPlayed = false;

export function HomePage() {
  const { t, locale } = useI18n();
  const [ready, setReady] = useState(preloaderPlayed);
  const onPreloaderDone = useCallback(() => {
    preloaderPlayed = true;
    setReady(true);
  }, []);

  usePageMeta({
    title: t.meta.home.title,
    description: t.meta.home.description,
    path: "/",
  });

  useJourney(ready);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema(locale, t)} />
      <JsonLd data={productNetworkSchema(t)} />
      {!preloaderPlayed && <Preloader onDone={onPreloaderDone} />}
      <SceneLoader />
      <ProgressRail />
      <main className="page">
        <Hero />
        <Problem />
        <IndexDial />
        <div id="journey">
          {WORLDS.map((world, i) => (
            <WorldSection key={world.id} world={world} order={i} />
          ))}
        </div>
        <XBrainSection />
        <Calculator />
        <XVerse />
      </main>
    </>
  );
}
