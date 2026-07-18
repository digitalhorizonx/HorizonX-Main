import { usePageMeta } from "../lib/usePageMeta";
import { FLAGSHIP } from "../lib/ecosystem";
import { XBrainNetwork, XBrainNetworkList } from "../components/XBrainNetwork";

const PILLARS = [
  {
    title: "Understands the business",
    body: "A unified business data model — brand, audience, operations, and outcomes — built up as a business moves through the network.",
  },
  {
    title: "Evaluates digital state",
    body: "The Digitalization Index locates a business on the 0–100% journey and identifies what is present, missing, or fragmented.",
  },
  {
    title: "Identifies the next action",
    body: "The digitalization methodology ranks the next highest-impact step — presence, conversion, operations, automation, or intelligence.",
  },
  {
    title: "Activates the right product",
    body: "Work is executed through the product network: Xability, XSite, XApps, XAuto, and XAI.",
  },
  {
    title: "Measures outcomes",
    body: "Product results return as structured data — reach, conversion, throughput, saved hours — not anecdotes.",
  },
  {
    title: "Improves under governance",
    body: "Recommendations improve through measured results, approved experiments, and human-governed feedback loops.",
  },
];

export function XBrainPage() {
  usePageMeta({
    title: "XBrain — The HorizonX Intelligence Layer",
    description:
      "XBrain is the central intelligence layer of the HorizonX network: it understands a business, evaluates its digital state, identifies the next highest-impact action, and activates the right HorizonX product — improving through measured outcomes and human-governed feedback.",
    path: FLAGSHIP.routes.xbrain,
  });

  return (
    <main className="subpage" id="xbrain">
      <section className="subpage__hero">
        <div className="hx-container subpage__hero-inner">
          <p className="hx-kicker">HorizonX Intelligence Layer</p>
          <h1 className="subpage__title">
            XBrain<span className="subpage__title-dot">.</span>
          </h1>
          <p className="subpage__lead">
            The central intelligence layer of the Digitalization Intelligence
            Network. XBrain connects business data, the Digitalization Index,
            and the five-product execution network into one continuously
            improving system — company infrastructure, built from HorizonX's
            digitalization methodology.
          </p>
        </div>
      </section>

      <section className="hx-container subpage__section" aria-labelledby="xbrain-net-title">
        <h2 id="xbrain-net-title" className="subpage__h2">
          One layer across the whole network
        </h2>
        <div className="xbrain__viz">
          <XBrainNetwork />
        </div>
        <XBrainNetworkList />
      </section>

      <section className="hx-container subpage__section" aria-labelledby="xbrain-pillars-title">
        <h2 id="xbrain-pillars-title" className="subpage__h2">
          What XBrain does
        </h2>
        <div className="subpage__cards">
          {PILLARS.map((p, i) => (
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
          XBrain is not XAI
        </h2>
        <div className="subpage__split">
          <div className="subpage__split-item" style={{ ["--w-color" as string]: "#7c6cff" }}>
            <h3>XBrain</h3>
            <p>
              HorizonX's central intelligence layer. Company-owned
              infrastructure that orchestrates the network, evaluates
              digitalization state, and governs recommendations across every
              client journey. It does not rewrite or deploy itself — it
              improves through structured data, measured outcomes, and
              human-approved feedback.
            </p>
          </div>
          <div className="subpage__split-item" style={{ ["--w-color" as string]: "#39ffc5" }}>
            <h3>XAI</h3>
            <p>
              The client-facing deployment layer. XAI puts AI capabilities to
              work inside <em>your</em> business — marketing analysts, sales
              follow-up agents, support agents, operations intelligence —
              grounded in your own data.
            </p>
          </div>
        </div>
      </section>

      <section className="hx-container subpage__section subpage__cta-row">
        <a className="hx-btn hx-btn--primary" href={FLAGSHIP.routes.investors}>
          The investor narrative <span className="hx-btn__arrow">→</span>
        </a>
        <a className="hx-btn hx-btn--ghost" href="/#index">
          Back to the Digitalization Index
        </a>
      </section>
    </main>
  );
}
