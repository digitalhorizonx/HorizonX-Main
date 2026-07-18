import { Router, useRoute } from "./lib/router";
import { I18nProvider, splitLocalePath } from "./i18n";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { InvestorsPage } from "./pages/InvestorsPage";
import { XBrainPage } from "./pages/XBrainPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SectorPage } from "./pages/SectorPage";
import { SECTOR_BASE, getSector } from "./content/sectors";

function Shell() {
  const fullPath = useRoute();
  const { locale, path } = splitLocalePath(fullPath);

  let page: JSX.Element;
  if (path === "/") {
    page = <HomePage />;
  } else if (path === "/investors") {
    page = <InvestorsPage />;
  } else if (path === "/xbrain") {
    page = <XBrainPage />;
  } else if (locale === "en" && path.startsWith(`${SECTOR_BASE}/`)) {
    // sector pages are English-only for now (docs/CONTENT_SEO_ROADMAP.md)
    const sector = getSector(path.slice(SECTOR_BASE.length + 1));
    page = sector ? <SectorPage sector={sector} /> : <NotFoundPage />;
  } else {
    page = <NotFoundPage />;
  }

  return (
    <I18nProvider locale={locale}>
      <Nav />
      {page}
      <Footer />
    </I18nProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Shell />
    </Router>
  );
}
