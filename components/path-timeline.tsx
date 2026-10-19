"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Photo } from "@/components/media";
import { PixelMaterialize } from "@/components/pixel-materialize";
import { Reveal } from "@/components/motion";
import { type TimelineEntry } from "@/lib/content";
import { useSite } from "@/lib/locale";

const kindIcon: Record<TimelineEntry["kind"], LucideIcon> = {
  education: GraduationCap,
  work: Briefcase,
};

const kindStyle = {
  work: {
    card: "border-primary/30 bg-[linear-gradient(145deg,rgba(0,163,255,0.15),rgba(10,10,15,0.94)_58%)] shadow-[0_18px_60px_-32px_rgba(0,163,255,0.75)]",
    accent: "from-primary via-[#7dd3fc] to-transparent",
    icon: "border-primary/30 bg-primary/12 text-primary",
    meta: "border-primary/35 bg-primary/12 text-primary",
    node: "bg-primary shadow-[0_0_18px_rgba(0,163,255,0.95)]",
    tile: "bg-[#06111d]",
  },
  education: {
    card: "border-[#7dd3fc]/20 bg-[linear-gradient(145deg,rgba(125,211,252,0.11),rgba(22,22,22,0.94)_62%)] shadow-[0_18px_60px_-38px_rgba(125,211,252,0.55)]",
    accent: "from-[#7dd3fc] via-[#22d3ee] to-transparent",
    icon: "border-[#7dd3fc]/25 bg-[#7dd3fc]/10 text-[#7dd3fc]",
    meta: "border-[#7dd3fc]/30 bg-[#7dd3fc]/10 text-[#7dd3fc]",
    node: "bg-[#7dd3fc] shadow-[0_0_18px_rgba(125,211,252,0.85)]",
    tile: "bg-[#0a1219]",
  },
} as const;

function Logo({ entry }: { entry: TimelineEntry }) {
  if (!entry.logo) {
    return (
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05]">
        {entry.kind === "work" ? (
          <Briefcase className="h-5 w-5 text-primary" strokeWidth={1.7} />
        ) : (
          <GraduationCap className="h-5 w-5 text-[#7dd3fc]" strokeWidth={1.7} />
        )}
      </span>
    );
  }
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={entry.logo}
        alt={`${entry.org} logo`}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </span>
  );
}

function TimelineCard({ entry }: { entry: TimelineEntry }) {
  const style = kindStyle[entry.kind];
  const current = Boolean(entry.meta && /ongoing|in corso|in progress/i.test(entry.meta));

  return (
    <div className="relative pl-10">
      <span
        aria-hidden
        className="absolute left-[5px] top-7 grid h-4 w-4 place-items-center"
      >
        <span className={`h-2.5 w-2.5 rounded-full ${style.node}`} />
        {current && (
          <motion.span
            aria-hidden
            className={`absolute h-2.5 w-2.5 rounded-full ${style.node}`}
            animate={{ scale: [1, 2.1], opacity: [0.65, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </span>

      <PixelMaterialize className="rounded-2xl" tileClassName={style.tile}>
        <article
          className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 ${style.card}`}
        >
          <span
            aria-hidden
            className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${style.accent}`}
          />
          <div className="flex items-start gap-3">
            <Logo entry={entry} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/65">
                  {entry.period}
                </span>
                {entry.meta && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${style.meta}`}
                  >
                    {current && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    {entry.meta}
                  </span>
                )}
              </div>
              <h3 className="mt-1.5 text-[17px] font-bold leading-snug tracking-tight">
                {entry.title}
              </h3>
              <p className={`mt-0.5 text-[12.5px] font-semibold ${entry.kind === "work" ? "text-[#7dd3fc]" : "text-ink/70"}`}>
                {entry.org}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{entry.text}</p>
        </article>
      </PixelMaterialize>

    </div>
  );
}

function TimelineColumn({
  entries,
  kind,
  label,
  count,
}: {
  entries: TimelineEntry[];
  kind: TimelineEntry["kind"];
  label: string;
  count: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 82%", "end 58%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);
  const Icon = kindIcon[kind];
  const style = kindStyle[kind];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-xl border ${style.icon}`}>
            <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
            <p className="mt-0.5 text-[13px] font-semibold text-ink">{count}</p>
          </div>
        </div>
        <span className={`h-px flex-1 bg-gradient-to-r ${style.accent} opacity-50`} />
      </div>

      <div ref={ref} className="relative">
        <span
          aria-hidden
          className="absolute bottom-0 left-[11px] top-0 w-px bg-white/10"
        />
        <motion.span
          aria-hidden
          style={reduce ? undefined : { scaleY }}
          className={`absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b ${style.accent}`}
        />

        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <TimelineCard key={`${entry.title}-${entry.period}`} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PathTimeline() {
  const site = useSite();
  const { t, timeline, certifications } = site;
  const work = timeline.filter((entry) => entry.kind === "work");
  const education = timeline.filter((entry) => entry.kind === "education");

  return (
    <section id="other" className="mt-24 scroll-mt-24">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t.path.eyebrow}</p>
        <h2 className="mt-2 text-4xl font-bold leading-tight tracking-[-1.2px] md:text-[60px] md:leading-[72px]">
          {t.path.titleA} <span className="text-[#7dd3fc]">{t.path.titleB}</span>
        </h2>
        <p className="mt-3 max-w-[65ch] text-muted">{t.path.desc}</p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
        <TimelineColumn
          entries={work}
          kind="work"
          label={t.path.experienceLabel}
          count={t.path.experienceCount(work.length)}
        />
        <TimelineColumn
          entries={education}
          kind="education"
          label={t.path.educationLabel}
          count={t.path.educationCount(education.length)}
        />
      </div>

      {/* Certificazioni + ritratto */}
      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <div className="relative h-full overflow-hidden rounded-bento border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {t.path.certificationsLabel}
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight">
                  {t.path.certificationsTitle}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                <Award className="h-3.5 w-3.5" strokeWidth={2} />
                {t.path.credentials(certifications.length)}
              </span>
            </div>
            <ul className="mt-5 flex flex-col divide-y divide-white/[0.06]">
              {certifications.map((cert) => (
                <li
                  key={cert.title}
                  className="group flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-primary transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-primary/10">
                      <Sparkles className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                    </span>
                    <span className="text-[14px] font-medium text-ink">{cert.title}</span>
                  </div>
                  {cert.detail && (
                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-black">
                      {cert.detail}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative h-full min-h-[280px] overflow-hidden rounded-bento border border-white/10 bg-abyss">
            <Photo
              src="/img/profile-github.jpg"
              alt="Francesco Monticone"
              label="Portrait"
              className="absolute inset-0 h-full w-full object-top"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/25 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7dd3fc]">
                {t.path.languagesLabel}
              </p>
              <p className="mt-1 text-lg font-bold tracking-tight">{t.path.languagesValue}</p>
              <p className="mt-1 text-[13px] text-muted">{t.path.toeic}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
