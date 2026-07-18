import { useEffect } from "react";
import { FLAGSHIP } from "./ecosystem";
import { DEFAULT_LOCALE, LOCALES, LOCALE_CODES, localePath, useI18n } from "../i18n";

interface PageMeta {
  title: string;
  description: string;
  /** locale-agnostic route path, e.g. "/investors" — the hook localizes it */
  path: string;
  /**
   * Whether this route exists in every locale (drives hreflang alternates).
   * English-only routes (sector pages) emit canonical + x-default only.
   */
  localized?: boolean;
}

function setAttr(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

function clearManaged() {
  document.head
    .querySelectorAll('link[data-hx-managed], meta[data-hx-managed]')
    .forEach((el) => el.remove());
}

function addLink(rel: string, href: string, hreflang?: string) {
  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  if (hreflang) link.hreflang = hreflang;
  link.setAttribute("data-hx-managed", "");
  document.head.appendChild(link);
}

function addMeta(property: string, content: string) {
  const meta = document.createElement("meta");
  meta.setAttribute("property", property);
  meta.content = content;
  meta.setAttribute("data-hx-managed", "");
  document.head.appendChild(meta);
}

/**
 * Per-route, per-locale document metadata: title, description, canonical,
 * hreflang alternates with x-default, og:locale (+ alternates), and og/
 * twitter text. The static tags in index.html carry the English homepage
 * defaults — what non-JS crawlers see on every route (a documented GitHub
 * Pages SPA limitation); JS-rendering crawlers receive the specialized set.
 */
export function usePageMeta({ title, description, path, localized = true }: PageMeta) {
  const { locale } = useI18n();

  useEffect(() => {
    const url = FLAGSHIP.url + localePath(locale, path);

    document.title = title;
    setAttr('meta[name="description"]', "content", description);
    setAttr('link[rel="canonical"]', "href", url);
    setAttr('meta[property="og:title"]', "content", title);
    setAttr('meta[property="og:description"]', "content", description);
    setAttr('meta[property="og:url"]', "content", url);
    setAttr('meta[property="og:locale"]', "content", LOCALES[locale].ogLocale);
    setAttr('meta[name="twitter:title"]', "content", title);
    setAttr('meta[name="twitter:description"]', "content", description);

    clearManaged();
    if (localized) {
      for (const code of LOCALE_CODES) {
        addLink("alternate", FLAGSHIP.url + localePath(code, path), code);
        if (code !== locale) addMeta("og:locale:alternate", LOCALES[code].ogLocale);
      }
      addLink("alternate", FLAGSHIP.url + localePath(DEFAULT_LOCALE, path), "x-default");
    } else {
      addLink("alternate", url, "en");
      addLink("alternate", url, "x-default");
    }

    return clearManaged;
  }, [title, description, path, localized, locale]);
}
