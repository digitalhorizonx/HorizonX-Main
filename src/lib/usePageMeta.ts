import { useEffect } from "react";
import { FLAGSHIP } from "./ecosystem";

interface PageMeta {
  title: string;
  description: string;
  /** route path, e.g. "/investors" — used for the canonical + og:url */
  path: string;
}

function setAttr(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/**
 * Per-route document metadata. The static tags in index.html carry the
 * homepage defaults (what crawlers without JavaScript see on every route —
 * a documented GitHub Pages SPA limitation); this hook specializes them for
 * client-side navigation and JS-rendering crawlers.
 */
export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const url = FLAGSHIP.url + (path === "/" ? "/" : path);
    document.title = title;
    setAttr('meta[name="description"]', "content", description);
    setAttr('link[rel="canonical"]', "href", url);
    setAttr('meta[property="og:title"]', "content", title);
    setAttr('meta[property="og:description"]', "content", description);
    setAttr('meta[property="og:url"]', "content", url);
    setAttr('meta[name="twitter:title"]', "content", title);
    setAttr('meta[name="twitter:description"]', "content", description);
  }, [title, description, path]);
}
