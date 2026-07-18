import { usePageMeta } from "../lib/usePageMeta";
import {
  EXTERNAL_LINK_REL,
  FLAGSHIP,
  INVESTOR_CONTACT,
  XVERSE,
} from "../lib/ecosystem";
import { XBrainNetwork, XBrainNetworkList } from "../components/XBrainNetwork";

/**
 * Public investor gateway. Frontend-only by design: there is no data room,
 * no form processing, and no private metrics in this repository. Traction
 * figures are deliberately gated behind investor access rather than invented.
 */

type MilestoneStatus = "completed" | "in-progress" | "planned";

const MILESTONES: Array<{ title: string; detail: string; status: MilestoneStatus }> = [
  {
    title: "Flagship ecosystem experience",
    detail: "Public Digitalization Index journey, XBrain narrative, and investor gateway.",
    status: "completed",
  },
  {
    title: "Xability market validation",
    detail: "First SaaS platform live with early businesses; the network's first data-entry point.",
    status: "in-progress",
  },
  {
    title: "Unified account & business-memory layer",
    detail: "One business profile shared across products — the foundation XBrain reasons over.",
    status: "planned",
  },
  {
    title: "XBrain MVP",
    detail: "Rules-based digitalization engine over unified business data, with human-governed recommendations.",
    status: "planned",
  },
  {
    title: "XSite integration",
    detail: "Websites and conversion infrastructure reusing approved business and brand data.",
    status: "planned",
  },
  {
    title: "XAuto workflow engine",
    detail: "Cross-product automations: lead routing, CRM sync, messaging, reporting.",
    status: "planned",
  },
  {
    title: "XApps reusable modules",
    detail: "CRM, booking, portals, and dashboards assembled from shared operational modules.",
    status: "planned",
  },
  {
    title: "Governed XAI agent deployment",
    detail: "Client-facing agents grounded in each business's own connected data.",
    status: "planned",
  },
  {
    title: "GCC pilot & seed readiness",
    detail: "Regional expansion on validated playbooks, with metrics prepared for institutional review.",
    status: "planned",
  },
];

const STATUS_LABEL: Record<MilestoneStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  planned: "Planned",
};

const TRACTION_METRICS = [
  "Active paying businesses",
  "Monthly recurring revenue",
  "Retention",
  "Projects digitized",
  "Websites launched",
  "Content published",
  "Automations executed",
  "Operational hours saved",
];

export function InvestorsPage() {
  usePageMeta({
    title: "Investors — HorizonX",
    description:
      "HorizonX is building the intelligence and execution infrastructure that moves SMEs from fragmented digital tools into one connected digital operating network. Investment thesis, XBrain, product network, methodology, and roadmap.",
    path: FLAGSHIP.routes.investors,
  });

  return (
    <main className="subpage" id="investors">
      {/* ---------- Thesis ---------- */}
      <section className="subpage__hero">
        <div className="hx-container subpage__hero-inner">
          <p className="hx-kicker">Investors</p>
          <h1 className="subpage__title">
            The digitalization
            <br />
            <span className="subpage__title-gradient">infrastructure for SMEs.</span>
          </h1>
          <p className="subpage__lead">
            HorizonX is building the intelligence and execution infrastructure
            that moves small and medium businesses from fragmented digital
            tools into one connected digital operating network.
          </p>
          <div className="subpage__cta-row subpage__cta-row--hero">
            <a className="hx-btn hx-btn--primary" href={INVESTOR_CONTACT.href}>
              {INVESTOR_CONTACT.label} <span className="hx-btn__arrow">→</span>
            </a>
            <a className="hx-btn hx-btn--ghost" href={FLAGSHIP.routes.xbrain}>
              Understand XBrain
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Problem ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-problem">
        <h2 id="inv-problem" className="subpage__h2">The problem</h2>
        <p className="subpage__body">
          SMEs today buy marketing from one provider, websites from another,
          applications from a third, and automation and AI — if at all — from
          a fourth. Every system holds a different copy of the business.
          Nothing compounds: data is fragmented, work is repeated, and there
          is no measurable path from digital activity to business outcomes.
        </p>
      </section>

      {/* ---------- Solution ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-solution">
        <h2 id="inv-solution" className="subpage__h2">The solution: XBrain + the product network</h2>
        <p className="subpage__body">
          HorizonX replaces disconnected providers with one network. XBrain —
          the central intelligence layer — understands each business,
          evaluates its digitalization state, and activates the right product
          at the right stage. Every product feeds structured outcomes back
          into the layer, so the network's recommendations improve through
          measured results and human-governed feedback, not guesswork.
        </p>
        <div className="xbrain__viz">
          <XBrainNetwork interactive={false} />
        </div>
        <XBrainNetworkList />
      </section>

      {/* ---------- Market approach ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-market">
        <h2 id="inv-market" className="subpage__h2">Market approach</h2>
        <ol className="subpage__steps">
          <li>
            <strong>Jordan — validation market.</strong> Prove the model with
            real SMEs: acquisition, retention, and digitalization outcomes.
          </li>
          <li>
            <strong>GCC expansion.</strong> Take validated playbooks to the
            region's larger SME economies.
          </li>
          <li>
            <strong>Wider MENA.</strong> Position HorizonX as SME
            digitalization infrastructure across the region.
          </li>
        </ol>
        <p className="subpage__note">
          Market sizing figures are provided with evidence in investor
          materials, not published as headline claims.
        </p>
      </section>

      {/* ---------- Traction ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-traction">
        <h2 id="inv-traction" className="subpage__h2">Traction</h2>
        <p className="subpage__body">
          HorizonX reports verified operating metrics to approved investors:
        </p>
        <ul className="subpage__metric-grid">
          {TRACTION_METRICS.map((m) => (
            <li key={m} className="subpage__metric">
              <span className="subpage__metric-value" aria-hidden>—</span>
              <span className="subpage__metric-label">{m}</span>
            </li>
          ))}
        </ul>
        <p className="subpage__note">
          Current figures are available in the investor data room. Metrics on
          this public page are intentionally withheld rather than estimated.
        </p>
      </section>

      {/* ---------- Founder vision ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-vision">
        <h2 id="inv-vision" className="subpage__h2">Founder vision</h2>
        <p className="subpage__body">
          HorizonX exists because the agency model doesn't scale: expertise
          leaves with every delivered project, and every client starts from
          zero. The founder's digitization methodology — how a business moves
          from offline to intelligent, stage by stage — is being converted
          into company-owned infrastructure: a unified business data model, a
          digitalization decision engine, and an execution network whose
          results compound. SMEs are the starting market because they feel
          fragmentation hardest and are structurally underserved — and because
          their operating data, connected properly, is where the durable
          advantage lives.
        </p>
      </section>

      {/* ---------- Milestones ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-milestones">
        <h2 id="inv-milestones" className="subpage__h2">Milestones</h2>
        <ol className="subpage__milestones">
          {MILESTONES.map((m) => (
            <li key={m.title} className={`subpage__milestone is-${m.status}`}>
              <span className="subpage__milestone-status">{STATUS_LABEL[m.status]}</span>
              <div>
                <h3>{m.title}</h3>
                <p>{m.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Investor updates ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-updates">
        <h2 id="inv-updates" className="subpage__h2">Investor updates</h2>
        <p className="subpage__body">
          Approved investors receive periodic updates covering revenue,
          growth, product milestones, major wins, risks, hiring, and
          fundraising asks.
        </p>
      </section>

      {/* ---------- Access ---------- */}
      <section className="hx-container subpage__section subpage__access" aria-labelledby="inv-access">
        <h2 id="inv-access" className="subpage__h2">Request access</h2>
        <p className="subpage__body">
          For the investment thesis in full — verified metrics, roadmap
          detail, and the data room — request investor access. Authenticated
          data-room access and NDA handling are managed outside this website.
        </p>
        <div className="subpage__cta-row">
          <a className="hx-btn hx-btn--primary" href={INVESTOR_CONTACT.href}>
            {INVESTOR_CONTACT.label} <span className="hx-btn__arrow">→</span>
          </a>
          <a
            className="hx-btn hx-btn--ghost"
            href={XVERSE.url}
            target="_blank"
            rel={EXTERNAL_LINK_REL}
          >
            See the work in XVerse
          </a>
        </div>
      </section>
    </main>
  );
}
