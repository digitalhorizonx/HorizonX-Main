import { useCallback, useState } from "react";
import { Scene } from "./three/Scene";
import { useJourney } from "./lib/useJourney";
import { WORLDS } from "./lib/worlds";
import { Preloader } from "./components/Preloader";
import { Nav } from "./components/Nav";
import { ProgressRail } from "./components/ProgressRail";
import { Hero } from "./components/Hero";
import { Problem } from "./components/Problem";
import { IndexDial } from "./components/IndexDial";
import { WorldSection } from "./components/WorldSection";
import { XBrainSection } from "./components/XBrainSection";
import { Calculator } from "./components/Calculator";
import { XVerse } from "./components/XVerse";
import { Footer } from "./components/Footer";

export default function App() {
  const [ready, setReady] = useState(false);
  const onPreloaderDone = useCallback(() => setReady(true), []);

  useJourney(ready);

  return (
    <>
      <Preloader onDone={onPreloaderDone} />
      <Scene />
      <Nav />
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
      <Footer />
    </>
  );
}
