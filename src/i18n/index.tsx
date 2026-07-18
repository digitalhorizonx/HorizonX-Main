import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Messages } from "./types";
import { en } from "./en";

/**
 * HorizonX internationalization core.
 *
 * A deliberately small, typed system instead of an i18n library: the custom
 * path router already owns locale routing, and the `Messages` interface gives
 * compile-time completeness checking across every locale — a missing key in
 * any language fails `tsc`. English ships in the main bundle as the always-
 * available fallback; other locales load on demand via dynamic import so the
 * initial bundle carries exactly one language.
 */

export type Locale = "en" | "ar" | "fr" | "es" | "de" | "tr";

export interface LocaleDef {
  code: Locale;
  /** the language's own name — shown in the selector */
  nativeName: string;
  englishName: string;
  dir: "ltr" | "rtl";
  /** Open Graph locale identifier */
  ogLocale: string;
}

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: Record<Locale, LocaleDef> = {
  en: { code: "en", nativeName: "English", englishName: "English", dir: "ltr", ogLocale: "en_US" },
  ar: { code: "ar", nativeName: "العربية", englishName: "Arabic", dir: "rtl", ogLocale: "ar_AR" },
  fr: { code: "fr", nativeName: "Français", englishName: "French", dir: "ltr", ogLocale: "fr_FR" },
  es: { code: "es", nativeName: "Español", englishName: "Spanish", dir: "ltr", ogLocale: "es_ES" },
  de: { code: "de", nativeName: "Deutsch", englishName: "German", dir: "ltr", ogLocale: "de_DE" },
  tr: { code: "tr", nativeName: "Türkçe", englishName: "Turkish", dir: "ltr", ogLocale: "tr_TR" },
};

export const LOCALE_CODES = Object.keys(LOCALES) as Locale[];

export function isLocale(value: string): value is Locale {
  return (LOCALE_CODES as string[]).includes(value);
}

/** Non-default locales load on demand; en is the statically bundled fallback. */
const loaders: Record<Exclude<Locale, "en">, () => Promise<Messages>> = {
  ar: () => import("./ar").then((m) => m.ar),
  fr: () => import("./fr").then((m) => m.fr),
  es: () => import("./es").then((m) => m.es),
  de: () => import("./de").then((m) => m.de),
  tr: () => import("./tr").then((m) => m.tr),
};

const cache = new Map<Locale, Messages>([["en", en]]);

export async function loadMessages(locale: Locale): Promise<Messages> {
  const hit = cache.get(locale);
  if (hit) return hit;
  const messages = await loaders[locale as Exclude<Locale, "en">]();
  cache.set(locale, messages);
  return messages;
}

/** Replace {placeholders} in a translated string. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? String(values[key]) : `{${key}}`
  );
}

/* ---------------- storage (safe when unavailable) ---------------- */

const STORAGE_KEY = "hx-locale";

export function readStoredLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value && isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* storage unavailable — selection still applies for this visit */
  }
}

/* ---------------- path helpers ---------------- */

/** "/ar/xbrain" → { locale: "ar", path: "/xbrain" }; "/xbrain" → en */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (match && isLocale(match[1])) {
    return { locale: match[1], path: match[2] || "/" };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/** Build a locale-prefixed href. English is canonical at the bare path. */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/* ---------------- React context ---------------- */

interface I18nValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Messages;
  /** localize an internal path for the ACTIVE locale */
  href: (path: string) => string;
}

const I18nContext = createContext<I18nValue>({
  locale: "en",
  dir: "ltr",
  t: en,
  href: (p) => p,
});

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [t, setT] = useState<Messages>(() => cache.get(locale) ?? en);

  useEffect(() => {
    let cancelled = false;
    if (cache.has(locale)) {
      setT(cache.get(locale)!);
    } else {
      // English renders as the fallback until the locale chunk arrives
      loadMessages(locale).then((messages) => {
        if (!cancelled) setT(messages);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const def = LOCALES[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = def.dir;
    // Arabic needs a script-capable premium face; load it only when used.
    if (locale === "ar") {
      // CSS side-effect import; the package ships styles, not types
      // @ts-expect-error -- no type declarations for the css entry
      import("@fontsource-variable/cairo");
    }
  }, [locale, def.dir]);

  return (
    <I18nContext.Provider
      value={{ locale, dir: def.dir, t, href: (p) => localePath(locale, p) }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
