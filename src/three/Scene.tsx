import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { IndexSphere } from "./IndexSphere";
import { Starfield } from "./Starfield";
import { journey } from "../lib/progressStore";

/**
 * Camera rig: scroll travels the camera through the ecosystem,
 * pointer adds parallax so the world feels inhabited, not rendered.
 */
function CameraRig() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const p = journey.state.progress;
    // journey path: pull back slightly, drift sideways in a slow arc
    const angle = p * Math.PI * 0.5;
    target.current.set(
      Math.sin(angle) * 1.4 + pointer.x * 0.55,
      -p * 0.7 + pointer.y * 0.4,
      6.4 - p * 0.9
    );
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.current.x, 2.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.current.y, 2.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.current.z, 2.2, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function Scene() {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <Starfield />
          <IndexSphere />
          <EffectComposer>
            <Bloom
              intensity={0.65}
              luminanceThreshold={0.32}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
