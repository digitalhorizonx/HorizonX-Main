import { useEffect, useRef, useState } from "react";
import {
  LOCALES,
  LOCALE_CODES,
  localePath,
  splitLocalePath,
  storeLocale,
  useI18n,
  type Locale,
} from "../i18n";
import { navigate } from "../lib/router";

/**
 * Accessible language selector: a button opening a listbox of native
 * language names (no flags). Switching preserves the current page,
 * persists the choice, and navigates via the SPA router.
 */
export function LanguageSelector() {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    storeLocale(next);
    const { path } = splitLocalePath(window.location.pathname);
    navigate(localePath(next, path));
  };

  return (
    <div className="langsel" ref={rootRef} data-testid="language-selector">
      <button
        className="langsel__button"
        aria-label={t.a11y.languageSelector}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.6 2.5 4 5.6 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.6-4-9s1.4-6.5 4-9z" />
        </svg>
        <span className="langsel__code">{locale.toUpperCase()}</span>
      </button>
      {open && (
        <ul className="langsel__menu" role="listbox" aria-label={t.a11y.languageSelector}>
          {LOCALE_CODES.map((code) => (
            <li key={code} role="presentation">
              <button
                role="option"
                aria-selected={code === locale}
                className={`langsel__option ${code === locale ? "is-active" : ""}`}
                lang={code}
                onClick={() => choose(code)}
              >
                <span>{LOCALES[code].nativeName}</span>
                <span className="langsel__option-code">{code.toUpperCase()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
