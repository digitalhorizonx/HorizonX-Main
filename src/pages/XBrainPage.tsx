import { usePageMeta } from "../lib/usePageMeta";
import { FLAGSHIP } from "../lib/ecosystem";
import { useI18n } from "../i18n";
import { XBrainNetwork, XBrainNetworkList } from "../components/XBrainNetwork";

export function XBrainPage() {
  const { t, href } = useI18n();

  usePageMeta({
    title: t.meta.xbrain.title,
    description: t.meta.xbrain.description,
    path: FLAGSHIP.routes.xbrain,
  });

  return (
    <main className="subpage" id="xbrain">
      <section className="subpage__hero">
        <div className="hx-container subpage__hero-inner">
          <p className="hx-kicker">{t.xbrainPage.kicker}</p>
          <h1 className="subpage__title">
            XBrain<span className="subpage__title-dot">.</span>
          </h1>
          <p className="subpage__lead">{t.xbrainPage.lead}</p>
        </div>
      </section>

      <section className="hx-container subpage__section" aria-labelledby="xbrain-net-title">
        <h2 id="xbrain-net-title" className="subpage__h2">
          {t.xbrainPage.netTitle}
        </h2>
        <div className="xbrain__viz">
          <XBrainNetwork />
        </div>
        <XBrainNetworkList />
      </section>

      <section className="hx-container subpage__section" aria-labelledby="xbrain-pillars-title">
        <h2 id="xbrain-pillars-title" className="subpage__h2">
          {t.xbrainPage.pillarsTitle}
        </h2>
        <div className="subpage__cards">
          {t.xbrainPage.pillars.map((p, i) => (
            <article key={p.title} className="subpage__card">
              <span className="subpage__card-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hx-container subpage__section" aria-labelledby="xbrain-distinct-title">
        <h2 id="xbrain-distinct-title" className="subpage__h2">
          {t.xbrainPage.distinctTitle}
        </h2>
        <div className="subpage__split">
          <div className="subpage__split-item" style={{ ["--w-color" as string]: "#7c6cff" }}>
            <h3>XBrain</h3>
            <p>{t.xbrainPage.xbrainCard}</p>
          </div>
          <div className="subpage__split-item" style={{ ["--w-color" as string]: "#39ffc5" }}>
            <h3>XAI</h3>
            <p>{t.xbrainPage.xaiCard}</p>
          </div>
        </div>
      </section>

      <section className="hx-container subpage__section subpage__cta-row">
        <a className="hx-btn hx-btn--primary" href={href(FLAGSHIP.routes.investors)}>
          {t.xbrainPage.investorCta} <span className="hx-btn__arrow">→</span>
        </a>
        <a className="hx-btn hx-btn--ghost" href={href("/#index")}>
          {t.xbrainPage.backCta}
        </a>
      </section>
    </main>
  );
}
