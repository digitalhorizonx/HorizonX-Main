import { usePageMeta } from "../lib/usePageMeta";
import { WORLDS } from "../lib/worlds";
import { EXTERNAL_LINK_REL, XVERSE } from "../lib/ecosystem";
import { SECTOR_BASE, publishedSectors, type SectorContent } from "../content/sectors";
import { JsonLd } from "../components/JsonLd";
import { FLAGSHIP } from "../lib/ecosystem";

/**
 * Data-driven sector landing page — one template renders every published
 * sector from the typed content model. English-only for now (the model is
 * localization-ready; see docs/CONTENT_SEO_ROADMAP.md).
 */
export function SectorPage({ sector }: { sector: SectorContent }) {
  const path = `${SECTOR_BASE}/${sector.slug}`;

  usePageMeta({
    title: sector.metaTitle,
    description: sector.metaDescription,
    path,
  });

  return (
    <main className="subpage sector" id={`sector-${sector.slug}`} lang="en" dir="ltr">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: sector.metaTitle,
          description: sector.metaDescription,
          url: `${FLAGSHIP.url}${path}`,
          inLanguage: "en",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "HorizonX", item: `${FLAGSHIP.url}/` },
            { "@type": "ListItem", position: 2, name: sector.name, item: `${FLAGSHIP.url}${path}` },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: sector.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      <section className="subpage__hero">
        <div className="hx-container subpage__hero-inner">
          <p className="hx-kicker">{sector.kicker}</p>
          <h1 className="subpage__title subpage__title--sector">{sector.title}</h1>
          <p className="subpage__lead">{sector.lead}</p>
          <div className="subpage__cta-row subpage__cta-row--hero">
            <a className="hx-btn hx-btn--primary" href="/#calculator">
              Assess your Digitalization Index <span className="hx-btn__arrow">→</span>
            </a>
            <a className="hx-btn hx-btn--ghost" href={XVERSE.url} target="_blank" rel={EXTERNAL_LINK_REL}>
              See examples in XVerse
            </a>
          </div>
        </div>
      </section>

      <section className="hx-container subpage__section" aria-labelledby={`sp-${sector.slug}`}>
        <h2 id={`sp-${sector.slug}`} className="subpage__h2">{sector.problemTitle}</h2>
        <ul className="sector__problems">
          {sector.problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="hx-container subpage__section" aria-labelledby={`sj-${sector.slug}`}>
        <h2 id={`sj-${sector.slug}`} className="subpage__h2">{sector.journeyTitle}</h2>
        <p className="subpage__body">{sector.journeyIntro}</p>
        <ol className="sector__journey">
          {WORLDS.map((w) => (
            <li key={w.id} style={{ ["--w-color" as string]: w.color }}>
              <span className="sector__journey-pct">{w.index}%</span>
              <p>
                {sector.productRoles[w.id]}{" "}
                <a href={w.url} target="_blank" rel={EXTERNAL_LINK_REL} className="sector__product-link">
                  {w.name} →
                </a>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="hx-container subpage__section" aria-labelledby={`sw-${sector.slug}`}>
        <h2 id={`sw-${sector.slug}`} className="subpage__h2">{sector.workflowTitle}</h2>
        <ol className="subpage__steps">
          {sector.workflow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="subpage__note">{sector.xbrainNote} <a href="/xbrain">About XBrain →</a></p>
      </section>

      <section className="hx-container subpage__section" aria-labelledby={`sf-${sector.slug}`}>
        <h2 id={`sf-${sector.slug}`} className="subpage__h2">{sector.faqTitle}</h2>
        <dl className="sector__faqs">
          {sector.faqs.map((f) => (
            <div key={f.q} className="sector__faq">
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
        <p className="subpage__note">{sector.statusNote}</p>
      </section>

      <section className="hx-container subpage__section" aria-label="Other sectors">
        <div className="sector__others">
          {publishedSectors()
            .filter((s) => s.slug !== sector.slug)
            .map((s) => (
              <a key={s.slug} className="hx-btn hx-btn--ghost" href={`${SECTOR_BASE}/${s.slug}`}>
                {s.name}
              </a>
            ))}
          <a className="hx-btn hx-btn--ghost" href="/#journey">
            The full journey
          </a>
        </div>
      </section>
    </main>
  );
}
