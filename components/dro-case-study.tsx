"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, GitBranch, Layers, X, Zap } from "lucide-react";
import { useSite } from "@/lib/locale";

const S = 26;
const W = Math.sqrt(3) * S;
const ROWS = 4;
const COLS = 5;
const COSTS = [
  [5, 2, 1, 3, 1],
  [1, 0, 4, 2, 3],
  [2, 5, 3, 1, 6],
  [3, 1, 0, 4, 2],
];

function center(col: number, row: number) {
  return {
    x: 38 + col * W + (row % 2 ? W / 2 : 0),
    y: 34 + (ROWS - 1 - row) * 1.5 * S,
  };
}

function hexPoints(cx: number, cy: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i + 30);
    return `${(cx + S * Math.cos(angle)).toFixed(2)},${(cy + S * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

function HexGrid({ mini = false }: { mini?: boolean }) {
  const reduce = useReducedMotion();
  const { t } = useSite();
  const id = useId().replace(/:/g, "");
  const start = center(1, 0);
  const target = center(3, 3);

  return (
    <svg
      viewBox="0 0 300 214"
      role="img"
      aria-label={`${t.dro.gridLabel} — ${t.dro.exitCost}, ${t.dro.blocked}, ${t.dro.airRoute}, ${t.dro.query}`}
      className="h-full w-full"
    >
      <defs>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#00a3ff" />
        </marker>
      </defs>

      {/* Change-cost radius */}
      <circle
        cx={center(2, 2).x}
        cy={center(2, 2).y}
        r={S * 1.95}
        fill="rgba(0,163,255,0.045)"
        stroke="rgba(0,163,255,0.5)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {COSTS.map((rowCosts, row) =>
        rowCosts.map((cost, col) => {
          const { x, y } = center(col, row);
          const blocked = cost === 0;
          const isStart = col === 1 && row === 0;
          const isTarget = col === 3 && row === 3;
          const fill = blocked
            ? "rgba(248,113,113,0.10)"
            : isStart || isTarget
              ? "rgba(0,163,255,0.20)"
              : "rgba(14,26,40,0.92)";
          const stroke = blocked
            ? "rgba(248,113,113,0.7)"
            : isStart || isTarget
              ? "#00a3ff"
              : "rgba(125,211,252,0.26)";
          return (
            <g key={`${col}-${row}`}>
              <polygon
                points={hexPoints(x, y)}
                fill={fill}
                stroke={stroke}
                strokeWidth={isStart || isTarget ? 1.8 : 1}
              />
              <text
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={blocked ? "#f87171" : isStart || isTarget ? "#e4e4e7" : "#a1a1aa"}
              >
                {cost}
              </text>
              {(isStart || isTarget) && (
                <text
                  x={x}
                  y={y + 16}
                  textAnchor="middle"
                  fontSize="7"
                  fontWeight="700"
                  fill="#7dd3fc"
                  letterSpacing="1"
                >
                  {isStart ? "S" : "T"}
                </text>
              )}
            </g>
          );
        }),
      )}

      {/* Ground route */}
      <path
        d={`M ${start.x} ${start.y} L ${center(1, 1).x} ${center(1, 1).y} L ${center(2, 2).x} ${center(2, 2).y} L ${target.x} ${target.y}`}
        fill="none"
        stroke="#00a3ff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#${id}-arrow)`}
        filter={`url(#${id}-glow)`}
      />

      {/* Air route */}
      <path
        d={`M ${center(0, 2).x} ${center(0, 2).y} C ${center(1, 3).x} ${center(1, 3).y - 32}, ${center(3, 3).x} ${center(3, 3).y - 32}, ${center(4, 2).x} ${center(4, 2).y}`}
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.85"
      >
        {!reduce && (
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.6s" repeatCount="indefinite" />
        )}
      </path>

      {!mini && (
        <>
          <text x={center(2, 2).x + 30} y={center(2, 2).y - 26} fontSize="7.5" fill="#00a3ff" fontWeight="700">
            change_cost
          </text>
          <text x={center(0, 2).x - 2} y={center(0, 2).y - 26} fontSize="7.5" fill="#7dd3fc" fontWeight="700">
            {t.dro.airRoute}
          </text>
          <text x={start.x - 16} y={start.y + 25} fontSize="7.5" fill="#a1a1aa">
            {t.dro.query}
          </text>
        </>
      )}
    </svg>
  );
}

export function DroPreview() {
  const { t } = useSite();
  return (
    <div className="relative h-[224px] overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_70%_20%,rgba(0,163,255,0.16),transparent_55%)]">
      <div className="absolute inset-x-3 inset-y-2">
        <HexGrid mini />
      </div>
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
          {t.dro.gridLabel}
        </span>
        <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7dd3fc]">
          Dijkstra
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
    </div>
  );
}

function ModalContent({ onClose }: { onClose: () => void }) {
  const { t } = useSite();
  const [tab, setTab] = useState<"problem" | "solution">("problem");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${t.dro.title} — ${t.dro.subtitle}`}
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.985 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-t-[28px] border border-white/12 bg-[#0c0f15] shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:rounded-[28px]"
      >
        <div className="relative border-b border-white/[0.08] px-5 py-5 md:px-7 md:py-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-28 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Case study · C · PoliMi
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                {t.dro.title} <span className="text-[#7dd3fc]">— {t.dro.subtitle}</span>
              </h2>
              <p className="mt-1 max-w-[62ch] text-[13px] text-muted">
                {t.dro.problemIntro}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.dro.close}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-muted transition-colors hover:border-white/25 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
            {(["problem", "solution"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                aria-pressed={tab === key}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                  tab === key ? "bg-primary text-white" : "text-muted hover:text-ink"
                }`}
              >
                {key === "problem" ? t.dro.problemTab : t.dro.solutionTab}
              </button>
            ))}
          </div>
        </div>

        <div className="relative overflow-y-auto px-5 py-5 md:px-7 md:py-6">
          <AnimatePresence mode="wait" initial={false}>
            {tab === "problem" ? (
              <motion.div
                key="problem"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-center"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7dd3fc]">
                    {t.dro.problemEyebrow}
                  </p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
                    {t.dro.problemTitle}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {t.dro.problemPoints.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-semibold">
                    <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-primary">
                      S → T · {t.dro.query}
                    </span>
                    <span className="rounded-full border border-red-400/25 bg-red-400/10 px-2.5 py-1 text-red-300">
                      {t.dro.blocked}
                    </span>
                    <span className="rounded-full border border-[#7dd3fc]/25 bg-[#7dd3fc]/10 px-2.5 py-1 text-[#7dd3fc]">
                      {t.dro.airRoute}
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#080d14] p-2">
                  <div className="h-[260px]">
                    <HexGrid />
                  </div>
                  <div className="flex items-center justify-between px-2 pb-1 pt-2 text-[10px] text-faint">
                    <span>{t.dro.gridLabel}</span>
                    <span className="text-[#7dd3fc]">0–100 · {t.dro.exitCost}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="solution"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid gap-6 md:grid-cols-[0.95fr_1.05fr] md:items-start"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7dd3fc]">
                    {t.dro.solutionEyebrow}
                  </p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
                    {t.dro.solutionTitle}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{t.dro.solutionIntro}</p>

                  <div className="mt-5 rounded-2xl border border-primary/25 bg-[linear-gradient(145deg,rgba(0,163,255,0.14),rgba(8,13,20,0.9))] p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                      <Zap className="h-3.5 w-3.5" /> {t.dro.cacheHit}
                    </div>
                    <p className="mt-2 font-mono text-[12px] text-ink">cache[(s, d)] → cost</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted">
                      {t.dro.cacheMiss} → {t.dro.steps[2].tag} · O(1) hit
                    </p>
                  </div>
                </div>

                <ol className="grid gap-2.5">
                  {t.dro.steps.map((step, i) => (
                    <li
                      key={step.title}
                      className="relative flex gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3.5 transition-colors hover:border-primary/35 hover:bg-primary/[0.05]"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-[11px] font-bold text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[13px] font-bold text-ink">{step.title}</p>
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
                            {step.tag}
                          </span>
                        </div>
                        <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
            <div className="flex items-center gap-2 text-[11px] text-muted">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <GitBranch className="h-3.5 w-3.5 text-primary" />
              <span>{t.dro.result}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-bold text-ink transition-colors hover:border-white/30"
            >
              {t.dro.close}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DroCaseStudy() {
  const { t } = useSite();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-5 py-2.5 text-sm font-bold text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/15 hover:shadow-[0_0_26px_rgba(0,163,255,0.25)]"
      >
        {t.dro.cta}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
      {mounted &&
        createPortal(
          <AnimatePresence>{open && <ModalContent onClose={() => setOpen(false)} />}</AnimatePresence>,
          document.body,
        )}
    </>
  );
}
