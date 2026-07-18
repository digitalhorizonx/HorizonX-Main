import { useI18n } from "../i18n";
import { useTheme, type ThemeSetting } from "../lib/theme";

const ICONS: Record<ThemeSetting, JSX.Element> = {
  system: (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  light: (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19" />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5z" />
    </svg>
  ),
};

/**
 * Accessible System / Light / Dark control: a labeled radiogroup of three
 * buttons, keyboard operable, with pressed state exposed to AT.
 */
export function ThemeToggle() {
  const { t } = useI18n();
  const [setting, setSetting] = useTheme();

  const options: Array<{ value: ThemeSetting; label: string }> = [
    { value: "system", label: t.a11y.themeSystem },
    { value: "light", label: t.a11y.themeLight },
    { value: "dark", label: t.a11y.themeDark },
  ];

  return (
    <div
      className="themetoggle"
      role="group"
      aria-label={t.a11y.themeSelector}
      data-testid="theme-toggle"
    >
      {options.map((option) => (
        <button
          key={option.value}
          className={`themetoggle__option ${setting === option.value ? "is-active" : ""}`}
          aria-label={option.label}
          title={option.label}
          aria-pressed={setting === option.value}
          data-theme-option={option.value}
          onClick={() => setSetting(option.value)}
        >
          {ICONS[option.value]}
        </button>
      ))}
    </div>
  );
}
