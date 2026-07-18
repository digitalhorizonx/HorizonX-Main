import { useEffect, useState } from "react";
import { journey } from "../lib/progressStore";
import { useI18n } from "../i18n";

export function Hero() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);

  useEffect(() => journey.subscribe((s) => setIndex(s.index)), []);

  return (
    <section id="hero" className="hero">
      <div className="hero__inner">
        <p className="hx-kicker hero__kicker hx-reveal">{t.hero.kicker}</p>
        <h1 className="hero__title hx-reveal" data-delay="0.1">
          {t.hero.titleA}
          <br />
          {t.hero.titleZeroPrefix}
          <span className="hero__zero">{t.hero.titleZero}</span>
          {t.hero.titleZeroSuffix}
        </h1>
        <p className="hero__lead hx-reveal" data-delay="0.2">
          {t.hero.lead1}
          <strong>{t.hero.leadStrong}</strong>
          {t.hero.lead2}
        </p>
      </div>

      <div className="hero__sphere-label" aria-live="polite">
        <span className="hero__sphere-kicker">{t.hero.sphereKicker}</span>
        <span className="hero__sphere-value">{String(index).padStart(2, "0")}%</span>
      </div>

      <div className="hero__scroll">
        <span className="hero__scroll-line" />
        <span>{t.hero.scrollHint}</span>
      </div>
    </section>
  );
}
