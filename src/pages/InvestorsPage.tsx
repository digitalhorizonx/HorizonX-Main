import { usePageMeta } from "../lib/usePageMeta";
import {
  EXTERNAL_LINK_REL,
  FLAGSHIP,
  INVESTOR_CONTACT,
  XVERSE,
} from "../lib/ecosystem";
import { useI18n } from "../i18n";
import { XBrainNetwork, XBrainNetworkList } from "../components/XBrainNetwork";

/**
 * Public investor gateway. Frontend-only by design: there is no data room,
 * no form processing, and no private metrics in this repository. Traction
 * figures are deliberately gated behind investor access rather than invented.
 * Milestone statuses stay in code (not translations) because they are facts.
 */

type MilestoneStatus = "completed" | "in-progress" | "planned";

/** status per milestone, index-aligned with t.investors.milestones */
const MILESTONE_STATUS: MilestoneStatus[] = [
  "completed",
  "in-progress",
  "planned",
  "planned",
  "planned",
  "planned",
  "planned",
  "planned",
  "planned",
];

export function InvestorsPage() {
  const { t, href } = useI18n();

  usePageMeta({
    title: t.meta.investors.title,
    description: t.meta.investors.description,
    path: FLAGSHIP.routes.investors,
  });

  const statusLabel: Record<MilestoneStatus, string> = {
    completed: t.investors.statusCompleted,
    "in-progress": t.investors.statusInProgress,
    planned: t.investors.statusPlanned,
  };

  return (
    <main className="subpage" id="investors">
      {/* ---------- Thesis ---------- */}
      <section className="subpage__hero">
        <div className="hx-container subpage__hero-inner">
          <p className="hx-kicker">{t.investors.kicker}</p>
          <h1 className="subpage__title">
            {t.investors.titleA}
            <br />
            <span className="subpage__title-gradient">{t.investors.titleB}</span>
          </h1>
          <p className="subpage__lead">{t.investors.lead}</p>
          <div className="subpage__cta-row subpage__cta-row--hero">
            <a className="hx-btn hx-btn--primary" href={INVESTOR_CONTACT.href}>
              {t.investors.requestAccess} <span className="hx-btn__arrow">→</span>
            </a>
            <a className="hx-btn hx-btn--ghost" href={href(FLAGSHIP.routes.xbrain)}>
              {t.investors.understandXbrain}
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Problem ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-problem">
        <h2 id="inv-problem" className="subpage__h2">{t.investors.problemTitle}</h2>
        <p className="subpage__body">{t.investors.problemBody}</p>
      </section>

      {/* ---------- Solution ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-solution">
        <h2 id="inv-solution" className="subpage__h2">{t.investors.solutionTitle}</h2>
        <p className="subpage__body">{t.investors.solutionBody}</p>
        <div className="xbrain__viz">
          <XBrainNetwork interactive={false} />
        </div>
        <XBrainNetworkList />
      </section>

      {/* ---------- Market approach ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-market">
        <h2 id="inv-market" className="subpage__h2">{t.investors.marketTitle}</h2>
        <ol className="subpage__steps">
          {t.investors.marketSteps.map((step) => (
            <li key={step.strong}>
              <strong>{step.strong}</strong> {step.body}
            </li>
          ))}
        </ol>
        <p className="subpage__note">{t.investors.marketNote}</p>
      </section>

      {/* ---------- Traction ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-traction">
        <h2 id="inv-traction" className="subpage__h2">{t.investors.tractionTitle}</h2>
        <p className="subpage__body">{t.investors.tractionBody}</p>
        <ul className="subpage__metric-grid">
          {t.investors.metrics.map((metric) => (
            <li key={metric} className="subpage__metric">
              <span className="subpage__metric-value" aria-hidden>—</span>
              <span className="subpage__metric-label">{metric}</span>
            </li>
          ))}
        </ul>
        <p className="subpage__note">{t.investors.tractionNote}</p>
      </section>

      {/* ---------- Founder vision ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-vision">
        <h2 id="inv-vision" className="subpage__h2">{t.investors.visionTitle}</h2>
        <p className="subpage__body">{t.investors.visionBody}</p>
      </section>

      {/* ---------- Milestones ---------- */}
      <section className="hx-container subpage__section" aria-labelledby="inv-milestones">
        <h2 id="inv-milestones" className="subpage__h2">{t.investors.milestonesTitle}</h2>
        <ol className="subpage__milestones">
          {t.investors.milestones.map((m, i) => (
            <li key={m.title} className={`subpage__milestone is-${MILESTONE_STATUS[i]}`}>
              <span className="subpage__milestone-status">{statusLabel[MILESTONE_STATUS[i]]}</span>
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
        <h2 id="inv-updates" className="subpage__h2">{t.investors.updatesTitle}</h2>
        <p className="subpage__body">{t.investors.updatesBody}</p>
      </section>

      {/* ---------- Access ---------- */}
      <section className="hx-container subpage__section subpage__access" aria-labelledby="inv-access">
        <h2 id="inv-access" className="subpage__h2">{t.investors.accessTitle}</h2>
        <p className="subpage__body">{t.investors.accessBody}</p>
        <div className="subpage__cta-row">
          <a className="hx-btn hx-btn--primary" href={INVESTOR_CONTACT.href}>
            {t.investors.requestAccess} <span className="hx-btn__arrow">→</span>
          </a>
          <a
            className="hx-btn hx-btn--ghost"
            href={XVERSE.url}
            target="_blank"
            rel={EXTERNAL_LINK_REL}
          >
            {t.investors.seeWork}
          </a>
        </div>
      </section>
    </main>
  );
}
