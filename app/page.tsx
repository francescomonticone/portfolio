"use client";

import { useState } from "react";
import { Eyebrow, Reveal } from "@/components/motion";
import { Memoji, Photo, CursorGlow } from "@/components/media";
import { SatelliteMap } from "@/components/map";
import { LiquidButton, GlassFilter } from "@/components/ui/liquid-glass-button";
import { ContactForm } from "@/components/contact-form";
import { HorizontalProjects, MinorProjects, NowBuilding } from "@/components/horizontal-projects";
import { SkillsSection } from "@/components/skills/SkillScene";
import {
  education,
  experience,
  navLinks,
  personalTrack,
  profile,
  promptChips,
  semesterCourses,
  techTags,
} from "@/lib/content";

function Glow({ className }: { className: string }) {
  return <div aria-hidden className={`pointer-events-none absolute rounded-full ${className}`} />;
}

function Marquee({
  children,
  duration,
  label,
}: {
  children: React.ReactNode;
  duration: string;
  label: string;
}) {
  return (
    <div
      aria-label={label}
      className="marquee-paused relative w-full overflow-hidden border-y border-line bg-card/30 py-2"
      style={{ ["--marquee-duration" as string]: duration }}
    >
      <div className="marquee-track gap-0">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  const ask = (q: string) => {
    const s = q.toLowerCase();
    if (!s.trim()) return;
    if (s.includes("work") || s.includes("project"))
      setAnswer("6 featured dossiers below — from study-plan tools to ROS 2 navigation. Scroll to #projects.");
    else if (s.includes("skill"))
      setAnswer("C/C++, Rust, TypeScript, React, ROS 2, VHDL — see the #skills grid.");
    else if (s.includes("contact") || s.includes("hire") || s.includes("intern"))
      setAnswer("Open to SWE / AI / security internships — reach out via GitHub & LinkedIn below.");
    else if (s.includes("about") || s.includes("who"))
      setAnswer("MSc Computer Science & Engineering @ Politecnico di Milano. Curious, precise, learn-by-building.");
    else setAnswer("Try a chip above — Work, About me, Skills or Contact.");
  };

  return (
    <div id="top" className="relative min-h-screen overflow-x-clip bg-abyss text-ink">
      <CursorGlow />
      {/* ── Nav liquid glass ────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav className="group relative flex h-14 w-full max-w-3xl items-center justify-between gap-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] px-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors duration-300 hover:bg-white/[0.09]">
          {/* rifrazione liquid glass */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ backdropFilter: 'url("#container-glass")' }}
          />
          <GlassFilter />
          <a
            href="#top"
            className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white"
            aria-label="Home"
          >
            F
          </a>
          <div className="relative z-10 hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition-colors duration-150 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="relative z-10 flex items-center gap-1 md:hidden">
            {navLinks.slice(1, 4).map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-2 text-[13px] font-semibold text-muted hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
          <LiquidButton
            size="sm"
            className="relative z-10"
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Contact
          </LiquidButton>
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1190px] px-5 pt-28 md:px-12">
        {/* ── Hero AI-chat card ─────────────── */}
        <Reveal>
          <section className="relative overflow-hidden rounded-frost border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl md:p-10">
            <Glow className="left-1/4 top-0 h-32 w-32 bg-sky-500/10 blur-[35px]" />
            <div className="relative">
              <div className="flex justify-center">
                <Memoji size={184} />
              </div>
              <div className="mt-2 text-center">
                <Eyebrow>{profile.role} — {profile.location}</Eyebrow>
              </div>
              <h1 className="mt-3 text-[32px] font-bold leading-[35.2px] tracking-[-0.64px] md:text-5xl md:leading-tight">
                Hi, I&apos;m <span className="text-gradient-shimmer">{profile.name}</span>
              </h1>
              <p className="mt-4 max-w-[65ch] text-lg leading-[31.5px] tracking-[-0.18px] text-muted">
                {profile.tagline} {profile.university}, into AI, cybersecurity and
                systems that work beneath the abstractions.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {promptChips.map((c) => (
                  <button
                    key={c}
                    onClick={() => ask(c)}
                    className="rounded-full border border-line bg-carddeep px-4 py-1.5 text-sm font-semibold text-muted transition-colors duration-150 hover:text-ink"
                  >
                    {c}
                  </button>
                ))}
              </div>
              <form
                className="mt-4 flex items-center gap-2 rounded-full border border-line bg-carddeep p-1.5 pl-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(query);
                }}
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Ask anything about ${profile.firstName}...`}
                  aria-label="Ask about Francesco"
                  className="w-full bg-transparent text-base text-ink placeholder:text-faint focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  Ask
                </button>
              </form>
              {answer && (
                <p className="mt-3 rounded-bento border border-line bg-card px-4 py-3 text-[15px] text-ink">
                  {answer}
                </p>
              )}
            </div>
          </section>
        </Reveal>
        <p className="mt-6 text-center text-xs text-faint">Scroll to explore</p>

        {/* ── Marquee name band ─────────────── */}
        <div className="mt-8">
          <Marquee duration="30s" label="Name band">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex shrink-0 items-center">
                <span className="px-6 text-4xl font-bold tracking-tight text-ink md:text-6xl">
                  FRANCESCO MONTICONE
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Computer Science &amp; Engineering
                </span>
              </span>
            ))}
          </Marquee>
        </div>

        {/* ── About bento ───────────────────── */}
        <section id="about" className="mt-24 scroll-mt-24">
          <Reveal>
            <Eyebrow>About</Eyebrow>
            <h2 className="mt-2 text-4xl font-bold leading-tight tracking-[-1.2px] md:text-[60px] md:leading-[72px]">
              Curious, precise, <span className="text-muted">learn-by-building.</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-bento border border-line bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Focus</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">AI systems, secure software, and how machines really work underneath.</p>
              </div>
            </Reveal>
            <Reveal className="md:row-span-2">
              <div className="flex h-full flex-col justify-between rounded-bento border border-line bg-card p-4">
                <Photo
                  src="/img/profile-github.jpg"
                  alt="Francesco Monticone portrait"
                  label="Portrait"
                  className="h-72 w-full rounded-xl object-top"
                />
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Profile</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    MSc student @ {profile.university}. Tennis &amp; calisthenics for
                    discipline; AI, crypto and systems for curiosity.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-bento border border-line bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">University</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">Politecnico di Milano — BSc expected Sep 2026, MSc 2026–present.</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-bento border border-line bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Recognition</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink">TOEIC 965/990 · PoliMi Git cert · merit scholarships.</p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="flex h-full flex-col justify-between rounded-bento border border-line bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">This semester</p>
                <ul className="mt-2 flex flex-col gap-1 text-[13px] text-ink">
                  {semesterCourses.map((c) => (
                    <li key={c.name}>{c.name}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          {/* ── Now learning: Academic + Personal ── */}
          <div className="mt-4 rounded-bento border border-line bg-card p-4 md:p-5">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Now learning</p>
              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-ink">Academic — this semester</p>
                  <div className="mt-3 flex flex-col gap-3">
                    {semesterCourses.map((c) => (
                      <div key={c.name}>
                        <p className="text-[15px] font-medium text-ink">{c.name}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {c.tags.map((t) => (
                            <span key={t} className="rounded-full border border-line bg-carddeep px-3 py-1 text-xs font-medium text-muted">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Personal track</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {personalTrack.map((s) => (
                      <span key={s} className="rounded-full bg-white/[0.03] px-4 py-1.5 text-[13px] text-ink">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm font-semibold text-ink">How I work</p>
                  <ul className="mt-2 flex flex-col gap-1.5 text-[13px] text-muted">
                    <li><span className="text-ink">Fundamentals first</span> — principles before tools.</li>
                    <li><span className="text-ink">Learn by building</span> — ideas into working software.</li>
                    <li><span className="text-ink">Always improving</span> — new tech, stronger theory.</li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
          {/* ── Mappa ── */}
          <div className="mt-4">
            <Reveal>
              <div className="relative h-full min-h-[180px] overflow-hidden rounded-bento border border-line bg-card">
                <SatelliteMap />
                <div className="absolute bottom-3 left-3 z-10 rounded-full border border-line bg-carddeep/90 px-4 py-1.5 text-xs font-semibold text-ink backdrop-blur">
                  Politecnico di Milano
                  <span className="ml-2 text-[#7dd3fc]">45.4784° N, 9.2272° E</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Tag strip marquee ─────────────── */}
        <div className="my-16 md:my-24">
          <Marquee duration="22s" label="Tech strip">
            {techTags.concat(techTags).map((t, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={`/skills/strip/${t.file}.svg`}
                alt={t.label}
                loading="lazy"
                className="mx-6 h-6 w-auto shrink-0 opacity-70"
              />
            ))}
          </Marquee>
        </div>

        {/* ── Projects: horizontal scroll ───── */}
        <HorizontalProjects />
        <div className="mt-24">
          <MinorProjects />
        </div>
        <div className="mt-16">
          <NowBuilding />
        </div>

        {/* ── Skills: 3D su desktop, chip su mobile ── */}
        <SkillsSection />

        {/* ── Other: experience, education, certs ── */}
        <section id="other" className="mt-24 scroll-mt-24">
          <Reveal>
            <Eyebrow>More to explore</Eyebrow>
            <h2 className="mt-2 text-4xl font-bold leading-tight tracking-[-1.2px] md:text-[60px] md:leading-[72px]">
              Experience <span className="text-muted">&amp; path</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-bento border border-line bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Experience</p>
                {experience.map((e) => (
                  <div key={e.role} className="mt-3">
                    <p className="font-semibold text-ink">{e.role}</p>
                    <p className="text-sm text-faint">{e.org} · {e.period}</p>
                    <p className="mt-1 text-[15px] text-muted">{e.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-bento border border-line bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Education</p>
                {education.map((e) => (
                  <div key={e.degree} className="mt-3">
                    <p className="font-semibold text-ink">{e.school}</p>
                    <p className="text-[15px] text-muted">{e.degree}</p>
                    <p className="text-sm text-faint">{e.period}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="h-full rounded-bento border border-line bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Certifications</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {[
                    "TOEIC Listening & Reading — 965/990",
                    "PoliMi Git Certification",
                    "ECDL Base",
                    "Il Grifone d'Acciaio Scholarship",
                    "PoliMi Merit Scholarship",
                    "Italian native · English advanced",
                  ].map((c) => (
                    <li key={c} className="rounded-full bg-white/[0.03] px-4 py-1.5 text-[13px] text-ink">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Contact footer ────────────────── */}
        <section id="contact" className="mt-24 scroll-mt-24 pb-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-frost border border-white/10 bg-white/[0.02] p-6 text-center backdrop-blur-xl md:p-10">
              <Glow className="bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 translate-y-1/2 bg-sky-500/20 blur-3xl" />
              <h2 className="relative text-4xl font-bold tracking-tight md:text-5xl">
                Let&apos;s build <span className="text-gradient-shimmer">something real</span>
              </h2>
              <p className="relative mx-auto mt-3 max-w-none text-muted md:whitespace-nowrap">
                Open to SW engineering, AI/ML and cybersecurity internships, research and working-student roles.
              </p>
              <div className="relative mt-6 flex flex-wrap justify-center gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(0,163,255,0.25)]"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(10,102,194,0.45)]"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
            <div className="mt-4">
              <ContactForm />
            </div>
          </Reveal>
          <footer className="mt-8 flex justify-center text-xs text-faint">
            <p>FM · © 2026 Francesco Monticone · Italy</p>
          </footer>
        </section>
      </main>
    </div>
  );
}
