/**
 * A tiny frame-rate-friendly store for the global journey progress.
 * The WebGL scene reads `current` every frame without triggering React;
 * UI components subscribe for throttled updates.
 */

export interface JourneyState {
  /** 0..1 — how far the visitor has travelled through the ecosystem */
  progress: number;
  /** 0..100 — the Digitalization Index currently reached */
  index: number;
  /** index of the active world (-1 = hero / before first world) */
  world: number;
}

type Listener = (state: JourneyState) => void;

const state: JourneyState = { progress: 0, index: 0, world: -1 };
const listeners = new Set<Listener>();

export const journey = {
  get state() {
    return state;
  },
  set(partial: Partial<JourneyState>) {
    let changed = false;
    for (const key of Object.keys(partial) as Array<keyof JourneyState>) {
      const value = partial[key];
      if (value !== undefined && state[key] !== value) {
        (state[key] as number) = value;
        changed = true;
      }
    }
    if (changed) listeners.forEach((l) => l(state));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
