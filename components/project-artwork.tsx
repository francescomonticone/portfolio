"use client";

import { useActiveAnimation } from "@/lib/use-active-animation";
import { Cpu } from "lucide-react";
import { DroPreview } from "@/components/dro-case-study";
import type { Project } from "@/lib/content";

/** Diagrams describe the project domain; they are not application screenshots. */
export function HardwareArtwork() {
  const { ref, active } = useActiveAnimation<HTMLDivElement>();
  return (
    <div ref={ref} role="img" aria-label="VHDL: finite-state machine connected to external RAM" className="relative flex h-full min-h-44 items-center justify-center bg-[#0b121c] p-3">
      <svg viewBox="0 0 440 220" className="project-diagram" aria-hidden>
        <g fill="none" stroke="#37516d" strokeWidth="1.5">
          <path d="M82 110H156M276 110H348M82 110V48H220V70M82 110V176H220V150" />
          <path className="diagram-signal" style={{animationPlayState: active ? "running" : "paused"}} d="M82 110H156M276 110H348" stroke="#7dd3fc" strokeWidth="2" />
        </g>
        <rect x="20" y="84" width="92" height="52" rx="8" fill="#111e2e" stroke="#45617b" />
        <rect x="156" y="70" width="120" height="80" rx="10" fill="#10283d" stroke="#7dd3fc" />
        <rect x="328" y="84" width="92" height="52" rx="8" fill="#111e2e" stroke="#45617b" />
        <g fill="#d7e8f5" fontFamily="sans-serif" fontSize="13" fontWeight="600" textAnchor="middle">
          <text x="66" y="115">COMMAND</text><text x="216" y="105">VHDL</text><text x="374" y="115">RAM</text>
        </g>
        <g fill="#91adc5" fontFamily="sans-serif" fontSize="10" textAnchor="middle">
          <text x="216" y="126">FINITE STATE MACHINE</text><text x="220" y="37">INSERT · PRIORITY</text><text x="220" y="198">REMOVE · CLEAR</text>
        </g>
        <g stroke="#7dd3fc" strokeWidth="1.2">{[175,191,207,223,239,255].map(x=><g key={x}><path d={`M${x} 63v7M${x} 150v7`} /></g>)}</g>
      </svg>
    </div>
  );
}

export function ProjectArtwork({ project }: { project: Project }) {
  if (project.caseStudy === "dro") return <DroPreview cover />;
  return (
    <div className="flex size-full flex-col justify-between bg-[#0b1521] p-5">
      <Cpu aria-hidden className="size-10 text-[#7dd3fc]" strokeWidth={1.2} />
      <div><p className="text-sm font-semibold text-ink">{project.title}</p><p className="mt-1 text-[11px] text-muted">{project.stack.slice(0,3).join(" · ")}</p></div>
    </div>
  );
}
