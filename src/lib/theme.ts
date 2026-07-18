import { useEffect, useState } from "react";

/**
 * Theme system: System / Light / Dark.
 *
 * - First-time visitors follow the operating system preference.
 * - An explicit choice persists in localStorage ("hx-theme").
 * - While "system" is selected, OS theme changes apply live.
 * - The resolved theme is exposed as `data-theme` on <html> plus the
 *   matching `color-scheme`, and a small hashed inline script in index.html
 *   applies it before first paint to prevent flashing.
 */

export type ThemeSetting = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "hx-theme";

export function readStoredTheme(): ThemeSetting | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" || value === "system" ? value : null;
  } catch {
    return null;
  }
}

function storeTheme(setting: ThemeSetting) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, setting);
  } catch {
    /* storage unavailable — the choice still applies for this visit */
  }
}

export function systemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function resolveTheme(setting: ThemeSetting): ResolvedTheme {
  return setting === "system" ? systemTheme() : setting;
}

export function applyTheme(setting: ThemeSetting) {
  const resolved = resolveTheme(setting);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.dataset.themeSetting = setting;
  root.style.colorScheme = resolved;
}

export function useTheme(): [ThemeSetting, (next: ThemeSetting) => void] {
  const [setting, setSetting] = useState<ThemeSetting>(() => readStoredTheme() ?? "system");

  useEffect(() => {
    applyTheme(setting);
    if (setting !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [setting]);

  const update = (next: ThemeSetting) => {
    storeTheme(next);
    setSetting(next);
  };

  return [setting, update];
}
