import { useCallback, useState } from "react";
import { SceneLoader } from "../three/SceneLoader";
import { useJourney } from "../lib/useJourney";
import { usePageMeta } from "../lib/usePageMeta";
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

/** The opening beat plays once per session, not on every return to "/". */
let preloaderPlayed = false;

export function HomePage() {
  const [ready, setReady] = useState(preloaderPlayed);
  const onPreloaderDone = useCallback(() => {
    preloaderPlayed = true;
    setReady(true);
  }, []);

  usePageMeta({
    title: "HorizonX — The Digitalization Intelligence Network",
    description:
      "HorizonX connects marketing, websites, business applications, automation, and AI through one digitalization intelligence network for growing businesses. From 0% to 100% digitalization.",
    path: "/",
  });

  useJourney(ready);

  return (
    <>
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
