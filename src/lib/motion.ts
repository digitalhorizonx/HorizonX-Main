/**
 * ============================================================
 * MOTION SYSTEM — JavaScript-side tokens
 * ============================================================
 *
 * The single source for scripted motion values (GSAP, Lenis, preloader).
 * CSS-side motion lives in tokens.css (--hx-ease-*, --hx-dur-*); the two
 * layers share the same design intent:
 *
 *   - entrances use expo-out, ~1s, rising ~42px
 *   - camera/scroll moves use longer, even easing
 *   - nothing blocks access to content: reveals trigger at 88% viewport,
 *     reduced-motion collapses every duration to zero
 */

export const MOTION = {
  /** Lenis smooth-scroll feel */
  scroll: {
    lenisDuration: 1.15,
    anchorDuration: 1.6,
  },

  /** .hx-reveal entrances */
  reveal: {
    duration: 1.1,
    distancePx: 42,
    ease: "expo.out",
    /** trigger when the element's top passes this viewport line */
    start: "top 88%",
  },

  /** opening beat (Preloader) */
  preloader: {
    logoAtMs: 350,
    pulseAtMs: 1500,
    doneAtMs: 2450,
  },

  /** cross-page anchor jump settle time (router) */
  anchorSettleMs: 60,
} as const;
