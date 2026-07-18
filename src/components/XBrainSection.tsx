import { useI18n } from "../i18n";
import { FLAGSHIP } from "../lib/ecosystem";
import { XBrainNetwork, XBrainNetworkList } from "./XBrainNetwork";

/**
 * XBrain — the intelligence layer operating across all five stages.
 * XBrain is NOT a sixth index stage and never alters the 30/30/20/10/10 model.
 */
export function XBrainSection() {
  const { t, href } = useI18n();

  return (
    <section id="xbrain-network" className="xbrain" aria-labelledby="xbrain-title">
      <div className="hx-container">
        <div className="xbrain__head">
          <p className="hx-kicker hx-reveal">{t.xbrainSection.kicker}</p>
          <h2 id="xbrain-title" className="xbrain__title hx-reveal" data-delay="0.08">
            {t.xbrainSection.titleA}
            <br />
            <span className="xbrain__title-accent">{t.xbrainSection.titleB}</span>
          </h2>
          <p className="xbrain__lead hx-reveal" data-delay="0.16">
            {t.xbrainSection.lead}
          </p>
        </div>

        <div className="xbrain__viz hx-reveal" data-delay="0.2">
          <XBrainNetwork />
        </div>
        <XBrainNetworkList />

        <ol className="xbrain__loop hx-reveal" data-delay="0.24" aria-label={t.xbrainSection.loopAria}>
          {t.xbrainSection.loop.map((step, i) => (
            <li key={step.label} className="xbrain__loop-step">
              <span className="xbrain__loop-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <strong>{step.label}</strong>
                <span>{step.detail}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="xbrain__notes hx-reveal" data-delay="0.3">
          <p className="xbrain__distinction">
            <strong>{t.xbrainSection.distinctionLabel}</strong>{" "}
            {t.xbrainSection.distinction}
          </p>
          <a className="hx-btn hx-btn--ghost" href={href(FLAGSHIP.routes.xbrain)}>
            {t.xbrainSection.insideCta} <span className="hx-btn__arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
