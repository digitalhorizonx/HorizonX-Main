import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey } from "../lib/progressStore";

const COUNT = 2600;

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vSeed;

  void main() {
    vSeed = aSeed;
    vec3 pos = position;
    pos.y += sin(uTime * 0.05 + aSeed * 40.0) * 0.4;
    pos.x += cos(uTime * 0.04 + aSeed * 30.0) * 0.4;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.5 + aSeed * 1.4) * uPixelRatio * (26.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uTint;
  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float alpha = smoothstep(0.5, 0.08, length(uv));
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + vSeed) + vSeed * 50.0);
    vec3 base = mix(vec3(0.62, 0.65, 0.9), uTint, 0.35);
    gl_FragColor = vec4(base, alpha * twinkle * 0.5);
  }
`;

export function Starfield() {
  const group = useRef<THREE.Group>(null);
  const shader = useRef<THREE.ShaderMaterial>(null);
  const tint = useMemo(() => new THREE.Color("#5a5e8a"), []);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // hollow shell so stars never collide with the sphere
      const radius = 7 + ((i * 48271) % 1000) / 1000 * 22;
      const u = ((i * 16807) % 1000) / 1000;
      const v = ((i * 69621) % 1000) / 1000;
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = radius * Math.cos(phi);
      seeds[i] = ((i * 39916801) % 1000) / 1000;
    }
    return { positions, seeds };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uTint: { value: tint },
    }),
    [tint]
  );

  useFrame((state, delta) => {
    if (shader.current) {
      shader.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.008 + journey.state.progress * 0.6;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={shader}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
