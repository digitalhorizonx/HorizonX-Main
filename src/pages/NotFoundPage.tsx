import { usePageMeta } from "../lib/usePageMeta";
import { FLAGSHIP } from "../lib/ecosystem";

export function NotFoundPage() {
  usePageMeta({
    title: "Page not found — HorizonX",
    description: "This coordinate doesn't exist in the HorizonX network.",
    path: window.location.pathname,
  });

  return (
    <main className="subpage notfound">
      <div className="hx-container subpage__hero-inner notfound__inner">
        <p className="hx-kicker">Signal lost</p>
        <h1 className="subpage__title">
          4<span className="subpage__title-gradient">0</span>4
        </h1>
        <p className="subpage__lead">
          This coordinate doesn't exist in the HorizonX network. The journey
          from 0% to 100% starts back at the beginning.
        </p>
        <div className="subpage__cta-row">
          <a className="hx-btn hx-btn--primary" href={FLAGSHIP.routes.home}>
            Return to the journey <span className="hx-btn__arrow">→</span>
          </a>
          <a className="hx-btn hx-btn--ghost" href={FLAGSHIP.routes.investors}>
            Investors
          </a>
        </div>
      </div>
    </main>
  );
}
