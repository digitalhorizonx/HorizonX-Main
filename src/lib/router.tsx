import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Minimal dependency-free client-side router.
 *
 * Works with the GitHub Pages SPA fallback: unknown paths are served the app
 * shell via 404.html (a copy of index.html created at deploy time), then this
 * router reads location.pathname and renders the matching page. Direct
 * navigation and refresh on /investors and /xbrain therefore work in
 * production; `vite preview` provides the same fallback locally.
 */

const RouteContext = createContext<string>("/");

export function normalizePath(p: string): string {
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

/**
 * Programmatic SPA navigation. Pushes history state and notifies the Router
 * via a synthetic popstate event, so any caller (e.g. the language selector)
 * can navigate without new wiring.
 */
export function navigate(path: string) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  // Sticky language preference: an explicit earlier choice re-applies when
  // the visitor lands on the bare root. Exact "/" only — deep links, crawler
  // requests, and every other path are never rewritten.
  useEffect(() => {
    if (window.location.pathname !== "/") return;
    // avoid a static import cycle with the i18n module
    import("../i18n").then(({ readStoredLocale, localePath }) => {
      const stored = readStoredLocale();
      if (stored && stored !== "en" && window.location.pathname === "/") {
        const target = localePath(stored, "/");
        window.history.replaceState(null, "", target);
        setPath(normalizePath(target));
      }
    });
  }, []);

  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);

    // Intercept same-origin path links (href="/...") for SPA navigation.
    // Hash-only links (href="#..." / same-path "/#...") are left to the
    // journey's smooth-scroll handler or native behavior.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement).closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      const nextPath = normalizePath(url.pathname);
      const currentPath = normalizePath(window.location.pathname);
      if (nextPath === currentPath) return; // same page — hash handling owns it

      e.preventDefault();
      window.history.pushState(null, "", url.pathname + url.hash);
      setPath(nextPath);
      if (url.hash) {
        // let the destination page mount before jumping to its anchor
        window.setTimeout(() => {
          document.querySelector(url.hash)?.scrollIntoView();
        }, 60);
      } else {
        window.scrollTo(0, 0);
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return <RouteContext.Provider value={path}>{children}</RouteContext.Provider>;
}

export function useRoute(): string {
  return useContext(RouteContext);
}
