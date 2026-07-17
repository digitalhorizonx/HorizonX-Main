import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey } from "../lib/progressStore";
import { STAGE_STOPS } from "../lib/worlds";

const PARTICLES = 15000;

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;

  attribute float aSeed;
  attribute vec3 aDirection;

  varying float vEnergy;
  varying float vSeed;

  // Simplex-ish cheap noise
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  void main() {
    vSeed = aSeed;

    // Dormant state: particles hover loosely. Energized: tight radiant shell.
    float energize = smoothstep(0.0, 1.0, uProgress);

    // breathing + turbulence, calmer as the sphere gains coherence
    float turbulence = noise(aDirection * 3.0 + uTime * 0.12 + aSeed * 7.0);
    float breathe = sin(uTime * 0.6 + aSeed * 6.2831) * 0.5 + 0.5;

    float baseRadius = 1.85;
    float scatter = (1.0 - energize) * (turbulence - 0.5) * 1.4;
    float shimmer = energize * (turbulence - 0.5) * 0.22;
    float radius = baseRadius + scatter + shimmer + breathe * 0.04;

    // energy bursts travel from pole to pole as progress rises
    float wave = sin(aDirection.y * 6.0 - uTime * 1.4);
    radius += energize * wave * 0.05;

    vec3 pos = aDirection * radius;

    // slow rotation, faster with energy
    float spin = uTime * (0.04 + energize * 0.06);
    float c = cos(spin), s = sin(spin);
    pos.xz = mat2(c, -s, s, c) * pos.xz;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    vEnergy = energize * (0.55 + 0.45 * turbulence);

    float size = (0.7 + aSeed * 1.5) * (0.55 + energize * 0.9);
    gl_PointSize = size * uPixelRatio * (36.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uProgress;

  varying float vEnergy;
  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.05, d);

    vec3 dormant = vec3(0.24, 0.25, 0.4);
    vec3 live = mix(uColorA, uColorB, vSeed);
    vec3 color = mix(dormant, live, clamp(uProgress * 1.6, 0.0, 1.0));

    float brightness = 0.3 + vEnergy * 0.85;
    gl_FragColor = vec4(color * brightness, alpha * (0.28 + vEnergy * 0.45));
  }
`;

const coreVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const coreFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform float uProgress;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 2.6);
    float intensity = 0.12 + uProgress * 0.85;
    gl_FragColor = vec4(uColorA * fresnel * intensity, fresnel * (0.25 + uProgress * 0.5));
  }
`;

function stageColor(t: number, out: THREE.Color) {
  for (let i = 1; i < STAGE_STOPS.length; i++) {
    const [t1, c1] = STAGE_STOPS[i];
    const [t0, c0] = STAGE_STOPS[i - 1];
    if (t <= t1 || i === STAGE_STOPS.length - 1) {
      const local = THREE.MathUtils.clamp((t - t0) / (t1 - t0), 0, 1);
      out.set(c0).lerp(new THREE.Color(c1), local);
      return out;
    }
  }
  return out;
}

export function IndexSphere() {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const shader = useRef<THREE.ShaderMaterial>(null);
  const coreShader = useRef<THREE.ShaderMaterial>(null);
  const smoothed = useRef(0);
  const colorA = useMemo(() => new THREE.Color("#3d4066"), []);
  const colorB = useMemo(() => new THREE.Color("#5a5e8a"), []);

  const { directions, seeds } = useMemo(() => {
    const directions = new Float32Array(PARTICLES * 3);
    const seeds = new Float32Array(PARTICLES);
    for (let i = 0; i < PARTICLES; i++) {
      // Fibonacci sphere for even coverage
      const y = 1 - (i / (PARTICLES - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * 2.399963229728653;
      directions[i * 3] = Math.cos(theta) * r;
      directions[i * 3 + 1] = y;
      directions[i * 3 + 2] = Math.sin(theta) * r;
      seeds[i] = (i * 16807) % 2147483647 / 2147483647;
    }
    return { directions, seeds };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
    }),
    [colorA, colorB]
  );

  const coreUniforms = useMemo(
    () => ({
      uColorA: { value: colorA },
      uProgress: { value: 0 },
    }),
    [colorA]
  );

  useFrame((state, delta) => {
    const target = journey.state.progress;
    smoothed.current = THREE.MathUtils.damp(smoothed.current, target, 3, delta);
    const p = smoothed.current;

    if (shader.current) {
      shader.current.uniforms.uTime.value = state.clock.elapsedTime;
      shader.current.uniforms.uProgress.value = p;
      stageColor(p, colorA);
      stageColor(Math.min(p + 0.12, 1), colorB);
    }
    if (coreShader.current) {
      coreShader.current.uniforms.uProgress.value = p;
    }
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.06;
    }
    if (group.current) {
      // The sphere recedes into deep space while the visitor walks the
      // worlds, then returns — fully energized — for the final stages.
      const recede = Math.sin(Math.min(p, 0.94) * Math.PI);
      group.current.position.z = -recede * 9;
      group.current.position.x = recede * 2.2;
      const scale = 1 - recede * 0.25;
      group.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[directions, 3]} />
          <bufferAttribute attach="attributes-aDirection" args={[directions, 3]} />
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
      <mesh scale={1.78}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          ref={coreShader}
          vertexShader={coreVertex}
          fragmentShader={coreFragment}
          uniforms={coreUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
