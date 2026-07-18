import { usePageMeta } from "../lib/usePageMeta";
import { FLAGSHIP } from "../lib/ecosystem";
import { useI18n } from "../i18n";

export function NotFoundPage() {
  const { t, href } = useI18n();

  usePageMeta({
    title: t.meta.notFound.title,
    description: t.meta.notFound.description,
    path: window.location.pathname,
  });

  return (
    <main className="subpage notfound">
      <div className="hx-container subpage__hero-inner notfound__inner">
        <p className="hx-kicker">{t.notFound.kicker}</p>
        <h1 className="subpage__title">
          4<span className="subpage__title-gradient">0</span>4
        </h1>
        <p className="subpage__lead">{t.notFound.lead}</p>
        <div className="subpage__cta-row">
          <a className="hx-btn hx-btn--primary" href={href(FLAGSHIP.routes.home)}>
            {t.notFound.home} <span className="hx-btn__arrow">→</span>
          </a>
          <a className="hx-btn hx-btn--ghost" href={href(FLAGSHIP.routes.investors)}>
            {t.notFound.investors}
          </a>
        </div>
      </div>
    </main>
  );
}
