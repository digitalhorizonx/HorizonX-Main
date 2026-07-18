import { Router, useRoute } from "./lib/router";
import { FLAGSHIP } from "./lib/ecosystem";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { InvestorsPage } from "./pages/InvestorsPage";
import { XBrainPage } from "./pages/XBrainPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function Shell() {
  const path = useRoute();

  let page: JSX.Element;
  switch (path) {
    case FLAGSHIP.routes.home:
      page = <HomePage />;
      break;
    case FLAGSHIP.routes.investors:
      page = <InvestorsPage />;
      break;
    case FLAGSHIP.routes.xbrain:
      page = <XBrainPage />;
      break;
    default:
      page = <NotFoundPage />;
  }

  return (
    <>
      <Nav />
      {page}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Shell />
    </Router>
  );
}
