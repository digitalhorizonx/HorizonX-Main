import { FLAGSHIP, PRODUCTS } from "../lib/ecosystem";
import { WORLDS } from "../lib/worlds";
import type { Messages } from "../i18n/types";
import type { Locale } from "../i18n";

/**
 * Centralized JSON-LD builders. Only truthful, verifiable facts: the real
 * organization name, URL, logo, and product relationships. No ratings,
 * reviews, prices, offers, funding, employee counts, or addresses — none of
 * those are published facts of this company.
 */

const ORG_ID = `${FLAGSHIP.url}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "HorizonX",
    url: `${FLAGSHIP.url}/`,
    logo: `${FLAGSHIP.url}/icon-512.png`,
  };
}

export function webSiteSchema(locale: Locale, t: Messages) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HorizonX",
    url: `${FLAGSHIP.url}/`,
    description: t.meta.home.description,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

/** The five products as a truthful ItemList of minimal SoftwareApplication entries. */
export function productNetworkSchema(t: Messages) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "HorizonX product network",
    itemListElement: WORLDS.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: w.name,
        url: PRODUCTS[w.id].landingUrl,
        description: t.worlds[w.id].role,
        applicationCategory: "BusinessApplication",
        creator: { "@id": ORG_ID },
      },
    })),
  };
}

export function webPageSchema(opts: {
  title: string;
  description: string;
  url: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.title,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.locale,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
