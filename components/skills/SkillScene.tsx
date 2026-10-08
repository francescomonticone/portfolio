"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { orbitConfig } from "@/lib/skills3d";
import { skillGroups } from "@/lib/content";
import { Eyebrow, Reveal } from "@/components/motion";

const SkillCanvas = dynamic(() => import("./SkillCanvas").then((m) => m.SkillCanvas), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] w-full items-center justify-center rounded-bento border border-line bg-abyss lg:h-[640px]">
      <p className="text-sm text-faint">Loading 3D…</p>
    </div>
  ),
});

/* ---------- fallback chip grid (mobile / no WebGL) ---------- */
export function SkillsGrid() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {skillGroups.map((g, i) => (
        <Reveal key={g.title} delay={(i % 4) * 0.08}>
          <div className="h-full rounded-bento border border-line bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{g.title}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span key={s} className="rounded-full border border-line bg-carddeep px-3 py-1 text-[13px] text-ink">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- sezione: 3D su desktop, chip su mobile ---------- */
export function SkillsSection() {
  const [mode, setMode] = useState<"3d" | "grid">("grid");

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    if (desktop && webgl) setMode("3d");
  }, []);

  return (
    <section id="skills" className="mt-24 scroll-mt-24">
      <Reveal>
        <Eyebrow>Tech Stack</Eyebrow>
        <h2 className="mt-2 text-4xl font-bold leading-tight tracking-[-1.2px] md:text-[60px] md:leading-[72px]">
          My <span className="text-muted">Skills</span>
        </h2>
        <p className="mt-3 max-w-[65ch] text-muted">
          Studied, explored or used in projects.
        </p>
      </Reveal>
      <div className="mt-8">{mode === "3d" ? <SkillCanvas /> : <SkillsGrid />}</div>
    </section>
  );
}
