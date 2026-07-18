import { FLAGSHIP } from "../lib/ecosystem";
import { XBrainNetwork, XBrainNetworkList } from "./XBrainNetwork";

const LOOP_STEPS = [
  { label: "Business data", detail: "Structured signals from your presence, site, and operations" },
  { label: "XBrain intelligence layer", detail: "Understands the business and its current digital state" },
  { label: "Digitalization Index & roadmap", detail: "Identifies the next highest-impact action" },
  { label: "Product activation", detail: "Xability · XSite · XApps · XAuto · XAI" },
  { label: "Measured outcomes", detail: "Results return as structured data" },
  { label: "Governed feedback", detail: "Approved experiments and human-reviewed improvement" },
];

/**
 * XBrain — the intelligence layer operating across all five stages.
 * XBrain is NOT a sixth index stage and never alters the 30/30/20/10/10 model.
 */
export function XBrainSection() {
  return (
    <section id="xbrain-network" className="xbrain" aria-labelledby="xbrain-title">
      <div className="hx-container">
        <div className="xbrain__head">
          <p className="hx-kicker hx-reveal">XBrain · HorizonX Intelligence Layer</p>
          <h2 id="xbrain-title" className="xbrain__title hx-reveal" data-delay="0.08">
            One intelligence layer.
            <br />
            <span className="xbrain__title-accent">Five connected products.</span>
          </h2>
          <p className="xbrain__lead hx-reveal" data-delay="0.16">
            The five stages aren't separate services — they're one network.
            XBrain understands your business, evaluates its digital state,
            identifies the next highest-impact step, and activates the right
            HorizonX product. Outcomes flow back as structured data, and
            recommendations improve through measured results and
            human-governed feedback.
          </p>
        </div>

        <div className="xbrain__viz hx-reveal" data-delay="0.2">
          <XBrainNetwork />
        </div>
        <XBrainNetworkList />

        <ol className="xbrain__loop hx-reveal" data-delay="0.24" aria-label="How the intelligence loop works">
          {LOOP_STEPS.map((step, i) => (
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
            <strong>XBrain vs XAI:</strong> XBrain is HorizonX's central
            intelligence layer — company infrastructure that orchestrates the
            network. XAI deploys AI capabilities for <em>your</em> business.
          </p>
          <a className="hx-btn hx-btn--ghost" href={FLAGSHIP.routes.xbrain}>
            Inside XBrain <span className="hx-btn__arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
