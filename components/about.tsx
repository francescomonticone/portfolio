"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  Boxes,
  Braces,
  BrainCircuit,
  Cpu,
  Database,
  ShieldCheck,
  Sigma,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { GradeSticker } from "@/components/grade-sticker";
import { Photo } from "@/components/media";
import { Reveal } from "@/components/motion";
import { SatelliteMap } from "@/components/map";
import { type CourseIcon, type PersonalTrackIcon } from "@/lib/content";
import { useSite } from "@/lib/locale";

const courseIcons: Record<CourseIcon, LucideIcon> = {
  cpu: Cpu,
  brain: BrainCircuit,
  boxes: Boxes,
  database: Database,
  braces: Braces,
  sigma: Sigma,
};

const trackIcons: Record<PersonalTrackIcon, LucideIcon> = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  gpu: Cpu,
};

const focusIcons = {
  brain: BrainCircuit,
  shield: ShieldCheck,
  cpu: Cpu,
};

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-bento border border-white/10 bg-white/[0.035] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition-colors duration-300 hover:border-white/20 ${className}`}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
      {children}
    </p>
  );
}

export function About() {
  const reduce = useReducedMotion();
  const site = useSite();
  const { t, profile, semesterCourses, personalTrack } = site;
  const focusAreas = t.about.focusAreas.map((area) => ({
    ...area,
    icon: focusIcons[area.key],
  }));

  return (
    <section id="about" className="mt-24 scroll-mt-24">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t.about.eyebrow}</p>
        <h2 className="mt-2 text-4xl font-bold leading-tight tracking-[-1.2px] md:text-[60px] md:leading-[72px]">
          {t.about.titleA} <span className="text-[#7dd3fc]">{t.about.titleB}</span>
        </h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Ritratto */}
        <Reveal className="lg:col-span-4 lg:row-span-2">
          <GlassCard className="group h-full p-2">
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-[13px] bg-abyss">
              <Photo
                src="/img/profile-github.jpg"
                alt="Francesco Monticone portrait"
                label="Portrait"
                className="absolute inset-0 h-full w-full object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/10 to-transparent"
              />
              <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur-md">
                {t.about.portraitPill}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-lg font-bold tracking-tight">{profile.name}</p>
                <p className="mt-0.5 text-[13px] text-ink/70">{profile.role}</p>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        {/* Focus */}
        <Reveal className="lg:col-span-5">
          <GlassCard className="flex h-full flex-col justify-between p-5">
            {!reduce && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(0,163,255,0.5),transparent_42%)] blur-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              />
            )}
            <div className="relative">
              <Label>{t.about.focusLabel}</Label>
              <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-ink">
                {t.about.focusText}
              </p>
            </div>
            <div className="relative mt-6 flex flex-wrap gap-2">
              {focusAreas.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] font-medium text-ink transition-colors duration-200 hover:border-primary/40 hover:bg-primary/10"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  {label}
                </span>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        {/* Voto — sticker da grattare */}
        <Reveal delay={0.08} className="lg:col-span-3">
          <GlassCard className="flex h-full flex-col items-center justify-center p-5">
            <div className="absolute left-5 top-5">
              <Label>{t.about.bscLabel}</Label>
            </div>
            <div className="mt-8">
              <GradeSticker />
            </div>
          </GlassCard>
        </Reveal>

        {/* Recognition */}
        <Reveal delay={0.1} className="lg:col-span-8">
          <GlassCard className="h-full p-5">
            <div className="flex items-center justify-between gap-3">
              <Label>{t.about.recognitionLabel}</Label>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
                {t.about.honours(t.about.recognition.length)}
              </span>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {t.about.recognition.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-xl px-1 py-1.5 text-[14px] leading-snug text-ink/90"
                >
                  <BadgeCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    strokeWidth={2}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </div>

      {/* Now learning — compatto */}
      <Reveal className="mt-4">
        <GlassCard className="relative p-5 md:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-[#00a3ff]/10 blur-3xl"
          />
          <div className="relative grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Label>{t.about.nowLearning}</Label>
                <span className="rounded-full border border-line bg-carddeep px-3 py-1 text-[11px] font-semibold text-muted">
                  {t.about.academic}
                </span>
              </div>
              <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {semesterCourses.map((course) => {
                  const Icon = courseIcons[course.icon];
                  return (
                    <li
                      key={course.name}
                      className="group flex items-start gap-3 rounded-xl px-2 py-2 transition-colors duration-200 hover:bg-white/[0.04]"
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-primary transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-primary/10">
                        <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium leading-snug text-ink">
                          {course.name}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-faint">
                          {course.tags.join(" · ")}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-abyss/50 p-4">
              {!reduce && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border border-primary/25"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
                >
                  <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
                </motion.div>
              )}
              <div className="relative">
                <Label>{t.about.personalTrack}</Label>
                <ul className="mt-3 flex flex-col gap-2">
                  {personalTrack.map(({ label, icon }) => {
                    const Icon = trackIcons[icon];
                    return (
                      <li
                        key={label}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.07]"
                      >
                        <Icon className="h-4 w-4 text-primary" strokeWidth={1.8} aria-hidden />
                        <span className="text-[13px] font-medium text-ink">{label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>
      </Reveal>

      {/* Mappa */}
      <Reveal className="mt-4">
        <div className="relative h-full min-h-[170px] overflow-hidden rounded-bento border border-white/10 bg-card">
          <SatelliteMap />
          <div className="absolute bottom-3 left-3 z-10 rounded-full border border-white/10 bg-carddeep/90 px-4 py-1.5 text-xs font-semibold text-ink backdrop-blur">
            {t.about.mapLabel}
            <span className="ml-2 text-[#7dd3fc]">45.4784° N, 9.2272° E</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
