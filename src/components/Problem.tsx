import { useI18n } from "../i18n";

/**
 * The core business problem — why the network exists.
 * Kept intentionally short: this is a beat in the journey, not a brochure.
 */
export function Problem() {
  const { t } = useI18n();

  return (
    <section id="problem" className="problem" aria-labelledby="problem-title">
      <div className="hx-container problem__inner">
        <p className="hx-kicker hx-reveal">{t.problem.kicker}</p>
        <h2 id="problem-title" className="problem__title hx-reveal" data-delay="0.08">
          {t.problem.titleA}
          <br />
          <span className="problem__title-dim">{t.problem.titleB}</span>
        </h2>
        <ul className="problem__list hx-reveal" data-delay="0.16">
          {t.problem.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="problem__resolution hx-reveal" data-delay="0.24">
          {t.problem.resolutionPre}
          <strong>{t.problem.resolutionChain}</strong>
          {t.problem.resolutionPost}
        </p>
      </div>
    </section>
  );
}
