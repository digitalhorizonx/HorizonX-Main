import { Component, Suspense, lazy, type ReactNode } from "react";

/**
 * Deferred entry point for the WebGL layer.
 *
 * The Three.js bundle (~280 kB gz) is loaded via dynamic import AFTER the
 * app shell has rendered, so first paint and all text content never wait on
 * it. If WebGL is unavailable or the scene crashes at runtime, a static
 * brand backdrop takes its place — the journey remains fully usable because
 * no critical information lives only in the canvas.
 */

const Scene = lazy(() =>
  import("./Scene").then((m) => ({ default: m.Scene }))
);

/** Static, zero-cost stand-in: deep space rendered with CSS gradients. */
export function SceneFallback() {
  return <div className="scene-fallback" aria-hidden data-testid="scene-fallback" />;
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("WebGL scene failed — using static backdrop.", error);
  }

  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

export function SceneLoader() {
  if (!webglAvailable()) {
    return <SceneFallback />;
  }
  return (
    <SceneErrorBoundary>
      <Suspense fallback={<SceneFallback />}>
        <Scene />
      </Suspense>
    </SceneErrorBoundary>
  );
}
