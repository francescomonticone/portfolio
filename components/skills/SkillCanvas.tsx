"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Stars, useTexture } from "@react-three/drei";
import { orbitConfig, skills3d, type OrbitId, type Skill3D } from "@/lib/skills3d";


/** Carica un SVG garantendo dimensioni intrinseche (molti loghi hanno solo viewBox). */
async function loadLogoTexture(path: string): Promise<THREE.Texture> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`logo ${res.status}`);
  let svg = await res.text();
  const vb = svg.match(/viewBox="([\d.\- ]+)"/);
  let w = 256;
  let h = 256;
  if (vb) {
    const [, , , vw, vh] = vb[1].trim().split(/\s+/).map(Number);
    if (vw > 0 && vh > 0) {
      const s = 256 / Math.max(vw, vh);
      w = Math.round(vw * s);
      h = Math.round(vh * s);
    }
  }
  if (!/width=/.test(svg)) {
    svg = svg.replace(/<svg([^>]*)>/, `<svg$1 width="${w}" height="${h}">`);
  }
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const tex = await new THREE.TextureLoader().loadAsync(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function useLogoTexture(logo: string | null): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!logo) return;
    let live = true;
    loadLogoTexture(logo)
      .then((t) => {
        if (live) setTex(t);
      })
      .catch(() => {
        if (live) setTex(null);
      });
    return () => {
      live = false;
    };
  }, [logo]);

  return tex;
}

/* ---------- satellite ---------- */
function Satellite({
  skill,
  radius,
  speed,
  index,
  total,
  hovered,
  selected,
  dimmed,
  onHover,
  onSelect,
}: {
  skill: Skill3D;
  radius: number;
  speed: number;
  index: number;
  total: number;
  hovered: boolean;
  selected: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  onSelect: (s: Skill3D) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const angle = useRef((index / total) * Math.PI * 2);
  const scale = useRef(1);
  const tex = useLogoTexture(skill.logo || null);
  const active = hovered || selected;

  useFrame((state, delta) => {
    angle.current += speed * delta * (selected ? 0.15 : 1);
    const m = mesh.current;
    if (!m) return;
    m.position.set(Math.cos(angle.current) * radius, 0, Math.sin(angle.current) * radius);
    const target = selected ? 1.6 : hovered ? 1.35 : 1;
    scale.current = THREE.MathUtils.lerp(scale.current, target, 1 - Math.exp(-10 * delta));
    m.scale.setScalar(scale.current);
    // logo sempre frontale: il +z locale punta la camera
    m.lookAt(state.camera.position);
    if (mat.current) {
      const t = dimmed && !selected ? 0.18 : 1;
      mat.current.opacity = THREE.MathUtils.lerp(mat.current.opacity, t, 1 - Math.exp(-6 * delta));
    }
  });

  return (
    <mesh
      ref={mesh}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(skill.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(skill);
      }}
    >
      <icosahedronGeometry args={[0.32, 1]} />
      <meshStandardMaterial
        ref={mat}
        color="#2e2e36"
        roughness={0.22}
        metalness={0.55}
        transparent
        emissive={active ? "#00a3ff" : "#0d2036"}
        emissiveIntensity={active ? 0.6 : 0.5}
      />
      {/* logo su plane con depth test: la luna lo copre davvero */}
      {tex && (
        <mesh position={[0, 0, 0.335]}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <planeGeometry args={[0.42, 0.42]} />
          <meshBasicMaterial
            map={tex}
            transparent
            toneMapped={false}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      )}
    </mesh>
  );
}

/* ---------- orbita ---------- */
function Orbit({
  id,
  skills,
  hoveredId,
  selectedId,
  focused,
  onHover,
  onSelect,
}: {
  id: OrbitId;
  skills: Skill3D[];
  hoveredId: string | null;
  selectedId: string | null;
  focused: OrbitId | null;
  onHover: (id: string | null) => void;
  onSelect: (s: Skill3D) => void;
}) {
  const cfg = orbitConfig[id];
  const expanded = focused === id;
  const dimmed = focused !== null && !expanded;
  const g = useRef<THREE.Group>(null);
  const lineMat = useRef<{ opacity: number } | null>(null);

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-4 * delta);
    if (g.current) {
      const t = expanded ? cfg.radius + 1.0 : cfg.radius;
      const s = t / cfg.radius;
      g.current.scale.setScalar(THREE.MathUtils.lerp(g.current.scale.x, s, k));
    }
    if (lineMat.current) {
      const t = dimmed ? 0.15 : 0.9;
      lineMat.current.opacity = THREE.MathUtils.lerp(lineMat.current.opacity, t, k);
    }
  });
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      pts.push([Math.cos(a) * cfg.radius, 0, Math.sin(a) * cfg.radius]);
    }
    return pts;
  }, [cfg.radius]);

  return (
    <group rotation={[cfg.inclination, 0, 0]}>
      <group ref={g}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <Line
          ref={(o) => {
            lineMat.current = o ? (o.material as unknown as { opacity: number }) : null;
          }}
          points={points} color={expanded ? "#00a3ff" : "#4b4b52"} lineWidth={2.5} transparent opacity={0.9}
        />
        {skills.map((s, i) => (
          <Satellite
            key={s.id}
            skill={s}
            radius={cfg.radius}
            speed={cfg.speed}
            index={i}
            total={skills.length}
            hovered={hoveredId === s.id}
            selected={selectedId === s.id}
            dimmed={dimmed && selectedId !== s.id}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </group>
    </group>
  );
}

/* ---------- sistema ---------- */
function System({
  onHover,
  onSelect,
  hoveredId,
  selected,
  focused,
}: {
  onHover: (id: string | null) => void;
  onSelect: (s: Skill3D) => void;
  hoveredId: string | null;
  selected: Skill3D | null;
  focused: OrbitId | null;
}) {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const byCat = useMemo(() => {
    const m = new Map<OrbitId, Skill3D[]>();
    for (const s of skills3d) {
      const arr = m.get(s.category) ?? [];
      arr.push(s);
      m.set(s.category, arr);
    }
    return m;
  }, []);

  useFrame((state, delta) => {
    if (root.current) root.current.rotation.y += delta * 0.04;
    if (core.current) core.current.rotation.y += delta * 0.25;
  });

  const moon = useTexture("/skills/moon.jpg");
  useMemo(() => {
    moon.colorSpace = THREE.SRGBColorSpace;
    moon.anisotropy = 4;
  }, [moon]);

  return (
    <>
      <group ref={root}>
        {/* luna centrale (-15%) */}
        <mesh ref={core}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <sphereGeometry args={[0.89, 48, 48]} />
          <meshStandardMaterial map={moon} roughness={1} metalness={0} />
        </mesh>
      {(Object.keys(orbitConfig) as OrbitId[]).map((id) => (
        <Orbit
          key={id}
          id={id}
          skills={byCat.get(id) ?? []}
          hoveredId={hoveredId}
          selectedId={selected?.id ?? null}
          focused={focused}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
      </group>
    </>
  );
}


/* ---------- scena ---------- */
export function SkillCanvas() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Skill3D | null>(null);
  const [focused, setFocused] = useState<OrbitId | null>(null);

  const goProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden rounded-bento border border-line bg-abyss">
      <div className="h-[560px] w-full lg:h-[640px]">
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 4.6, 11.5], fov: 50 }}
          gl={{ antialias: true }}
          onPointerMissed={() => setSelected(null)}
        >
          <color attach="background" args={["#0a0a0f"]} />
          {/* stelle sobrie sullo sfondo */}
          <Stars radius={45} depth={25} count={1300} factor={2.4} saturation={0} fade speed={0.5} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 8, 5]} intensity={2.1} />
          <directionalLight position={[-6, 3, -6]} intensity={0.5} color="#7dd3fc" />
          <pointLight position={[-6, 2, -4]} intensity={12} color="#00a3ff" />
          <Suspense fallback={null}>
            <System onHover={setHoveredId} onSelect={setSelected} hoveredId={hoveredId} selected={selected} focused={focused} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.12} maxPolarAngle={Math.PI / 1.7} minPolarAngle={Math.PI / 4} />
        </Canvas>
      </div>

      {/* slider verticale livelli: All + un livello per orbita */}
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1 rounded-full border border-line bg-carddeep/90 p-1.5 backdrop-blur-xl">
        {([null, "languages", "frameworks", "platforms"] as (OrbitId | null)[]).map((id) => {
          const active = focused === id;
          return (
            <button
              key={id ?? "all"}
              onClick={() => setFocused(active ? null : id)}
              title={id ? orbitConfig[id].label : "All levels"}
              aria-label={id ? orbitConfig[id].label : "All levels"}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-200 ${
                active
                  ? "bg-primary text-white shadow-[0_0_16px_rgba(0,163,255,0.5)]"
                  : "text-muted hover:bg-white/[0.06] hover:text-ink"
              }`}
            >
              {id ? orbitConfig[id].label.slice(0, 2) : "✦"}
            </button>
          );
        })}
      </div>

      {/* pannello info laterale */}
      {selected && (
        <div className="absolute right-3 top-3 w-[240px] rounded-bento border border-line bg-carddeep/95 p-4 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {orbitConfig[selected.category].label}
              </p>
              <h3 className="mt-1 text-lg font-bold text-ink">{selected.name}</h3>
            </div>
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="rounded-full border border-line px-2 py-0.5 text-xs text-muted hover:text-ink"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{selected.blurb}</p>
          {selected.projects.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {selected.projects.map((p) => (
                <button
                  key={p}
                  onClick={goProjects}
                  className="rounded-full border border-line bg-card px-3 py-1.5 text-left text-xs font-medium text-ink transition-colors hover:border-primary/60"
                >
                  {p} →
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

