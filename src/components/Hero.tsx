import { useEffect, useState } from "react";
import { journey } from "../lib/progressStore";

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => journey.subscribe((s) => setIndex(s.index)), []);

  return (
    <section id="hero" className="hero">
      <div className="hero__inner">
        <p className="hx-kicker hero__kicker hx-reveal">The HorizonX Ecosystem</p>
        <h1 className="hero__title hx-reveal" data-delay="0.1">
          Every business begins
          <br />
          at <span className="hero__zero">zero</span>.
        </h1>
        <p className="hero__lead hx-reveal" data-delay="0.2">
          HorizonX is an ecosystem of specialized AI-powered platforms that carries
          any business from <strong>0% to 100% digitalization</strong> — one stage at a time.
        </p>
      </div>

      <div className="hero__sphere-label" aria-live="polite">
        <span className="hero__sphere-kicker">Digitalization Index</span>
        <span className="hero__sphere-value">{String(index).padStart(2, "0")}%</span>
      </div>

      <div className="hero__scroll">
        <span className="hero__scroll-line" />
        <span>Scroll to begin the journey</span>
      </div>
    </section>
  );
}
