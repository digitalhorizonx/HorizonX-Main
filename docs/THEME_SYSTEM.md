# Theme System

Three settings: **System** (default), **Light**, **Dark**.

## Behavior

- First-time visitors follow the OS preference (`prefers-color-scheme`).
- An explicit choice persists in `localStorage("hx-theme")` and overrides
  the OS until changed.
- While System is selected, OS theme changes apply live (media-query
  listener).
- A small inline script in `index.html` — allow-listed in the CSP **by
  SHA-256 hash**, not `'unsafe-inline'` — applies the resolved theme to
  `<html data-theme>` and `color-scheme` before first paint, eliminating
  theme flashing. If you edit that script, recompute its hash for the CSP
  meta tag.
- Runtime logic lives in `src/lib/theme.ts` (`useTheme()`); the control is
  `src/components/ThemeToggle.tsx` — a labeled, keyboard-operable group of
  three `aria-pressed` buttons, present in desktop and mobile navigation.

## Token architecture

Themes are semantic token layers in `src/styles/tokens.css`, not
overrides scattered through components:

- Base (dark) tokens: environment, ink, glass, shadows, and semantic
  surfaces (`--hx-menu-bg`, `--hx-overlay-bg`, `--hx-nav-fade`,
  `--hx-scrim`, `--hx-btn-ghost-bg`, `--hx-dial-track`, `--hx-scene-*`,
  `--hx-btn-primary-fg`, …).
- `[data-theme="light"]` redefines the same tokens as a **designed daylight
  counterpart**: paper surfaces, ink typography, the five stage hues
  deepened for AA contrast on light backgrounds, tinted ambience instead of
  black shadows. It is not a color inversion.
- Components consume tokens only; no component knows which theme is active.

## The WebGL scene and themes

The particle journey is composited with **additive blending** — light
accumulating against darkness. On a light background the physics of that
blend washes out to near-invisibility, and duplicating the scene with a
second shader/tuning path would double the GPU surface for one page style.

Decision: **dark theme runs the full WebGL journey; light theme renders the
designed static atmosphere** (`SceneFallback`, driven by the same theme
tokens). `SceneLoader` observes `data-theme` and swaps live. Reduced-motion,
WebGL-unavailable, and scene-crash paths all use the same fallback, so no
critical content ever depends on the canvas. Revisit only if a properly
art-directed light scene is commissioned.

## Contrast

- Body text on both themes meets WCAG AA (light ink `#10122b` on `#f5f6fb`;
  dark ink `#f4f5ff` on `#030309`).
- Dimmed/faint ink is reserved for large or non-essential text.
- Stage-colored text on light uses the deepened palette variants.
- Focus outlines use `--hx-xsite`, visible on both themes.
