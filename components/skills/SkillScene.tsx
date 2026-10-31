"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { useActiveAnimation } from "@/lib/use-active-animation";
import { Eyebrow, Reveal } from "@/components/motion";
import { useSite } from "@/lib/locale";

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
  const { skillGroups } = useSite();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function SkillsSection() {
  const { t, locale } = useSite();
  const reduce = useReducedMotion();
  const { ref, active } = useActiveAnimation<HTMLElement>();
  const [eligible, setEligible] = useState(false);
  const [mode, setMode] = useState<"3d" | "grid">("3d");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    let webgl = false;
    // Probe once, then release the context rather than leaking a GPU resource.
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
      webgl = !!context;
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { webgl = false; }
    const read = () => setEligible(desktop.matches && webgl);
    read(); desktop.addEventListener("change", read);
    return () => desktop.removeEventListener("change", read);
  }, []);
  useEffect(() => { if (active) setReady(true); }, [active]);
  const show3d = eligible && !reduce && mode === "3d";

  return (
    <section ref={ref} id="skills" className="mt-24 scroll-mt-28">
      <Reveal>
        <Eyebrow>{t.skills.eyebrow}</Eyebrow>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
          <h2 className="text-4xl font-bold leading-tight tracking-[-.03em] md:text-[60px] md:leading-[72px]">{t.skills.titleA} <span className="text-[#7dd3fc]">{t.skills.titleB}</span></h2>
          {eligible && !reduce && <div role="group" aria-label={locale === "it" ? "Vista competenze" : "Skills view"} className="flex rounded-full border border-line p-1">
            {(["3d", "grid"] as const).map(value => <button key={value} type="button" onClick={() => setMode(value)} aria-pressed={mode === value} className={`min-h-11 rounded-full px-4 text-xs font-semibold ${mode === value ? "bg-white/10 text-ink" : "text-muted"}`}>{value === "3d" ? "3D" : locale === "it" ? "Elenco" : "List"}</button>)}
          </div>}
        </div>
        <p className="mt-3 max-w-[65ch] text-muted">{t.skills.desc}</p>
      </Reveal>
      <div className="mt-8">
        {show3d && ready ? <SceneBoundary key={mode} fallback={<SkillsGrid />}><SkillCanvas active={active} /></SceneBoundary> : <SkillsGrid />}
      </div>
    </section>
  );
}
