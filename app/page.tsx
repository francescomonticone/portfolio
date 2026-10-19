"use client";

import { useState } from "react";
import { Eyebrow, Reveal } from "@/components/motion";
import { Memoji, CursorGlow } from "@/components/media";
import { LiquidButton, GlassFilter } from "@/components/ui/liquid-glass-button";
import { ContactForm } from "@/components/contact-form";
import { About } from "@/components/about";
import { PathTimeline } from "@/components/path-timeline";
import { HorizontalProjects, MinorProjects, NowBuilding } from "@/components/horizontal-projects";
import { SkillsSection } from "@/components/skills/SkillScene";
import { GithubIcon } from "@/components/github-icon";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { answerQuestion } from "@/lib/chatbot";
import type { ChatAnswer } from "@/lib/chatbot";
import { StreamingAnswer } from "@/components/chat-answer";
import { techTags } from "@/lib/content";
import { LocaleProvider, useLocale, useSite } from "@/lib/locale";
import type { Locale } from "@/lib/copy";

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
  return (
    <LocaleProvider>
      <Portfolio />
    </LocaleProvider>
  );
}

function LocaleSwitch() {
  const { locale, setLocale } = useLocale();
  const options: Locale[] = ["it", "en"];
  return (
    <div
      role="group"
      aria-label="Language"
      className="relative z-10 flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-0.5"
    >
      {options.map((option, index) => (
        <span key={option} className="flex items-center">
          {index > 0 && <span aria-hidden className="mx-0.5 h-3 w-px bg-white/15" />}
          <button
            type="button"
            onClick={() => setLocale(option)}
            aria-pressed={locale === option}
            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors duration-150 ${
              locale === option ? "bg-primary text-white" : "text-muted hover:text-ink"
            }`}
          >
            {option}
          </button>
        </span>
      ))}
    </div>
  );
}

function Portfolio() {
  const site = useSite();
  const { t, profile } = site;
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<ChatAnswer | null>(null);

  const runAsk = (q: string) => {
    if (!q.trim()) return;
    setAnswer(answerQuestion(q));
  };

  const ask = (q: string) => runAsk(q);

  return (
    <div id="top" className="relative min-h-screen overflow-x-clip bg-abyss text-ink">
      <CursorGlow />
      {/* ── Nav liquid glass ────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav className="group relative flex h-14 w-full max-w-3xl items-center justify-between gap-1 overflow-hidden md:gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors duration-300 hover:bg-white/[0.09]">
          {/* rifrazione liquid glass */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ backdropFilter: 'url("#container-glass")' }}
          />
          <GlassFilter />
          <a
            href="#top"
            className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white"
            aria-label="Home"
          >
            F
          </a>
          <div className="relative z-10 hidden items-center gap-1 md:flex">
            {site.navLinks.map((l) => (
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
            {site.navLinks.slice(1, 3).map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-semibold text-muted hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <LiquidButton
              size="sm"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.contact.navCta}
            </LiquidButton>
            <LocaleSwitch />
          </div>
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
                {t.hero.greeting} <span className="text-[#7dd3fc]">{profile.name}</span>
              </h1>
              <p className="mt-4 max-w-[65ch] text-lg leading-[31.5px] tracking-[-0.18px] text-muted">
                {t.hero.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {t.hero.chips.map((c) => (
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
                  placeholder={t.hero.askPlaceholder.replace("{name}", profile.firstName)}
                  aria-label={t.hero.askAria}
                  className="w-full bg-transparent text-base text-ink placeholder:text-faint focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {t.hero.ask}
                </button>
              </form>
              {answer && (
                <StreamingAnswer
                  answer={answer}
                  onPick={(s) => {
                    setQuery(s);
                    runAsk(s);
                  }}
                />
              )}
            </div>
          </section>
        </Reveal>
        <p className="mt-6 text-center text-xs text-faint">{t.hero.scroll}</p>

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

        {/* ── About ─────────────────────────── */}
        <About />

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

        {/* ── Experience, path & certifications ── */}
        <PathTimeline />

        {/* ── Contact footer ────────────────── */}
        <section id="contact" className="mt-24 scroll-mt-24 pb-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-frost border border-white/10 bg-white/[0.02] p-6 text-center backdrop-blur-xl md:p-10">
              <Glow className="bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 translate-y-1/2 bg-sky-500/20 blur-3xl" />
              <h2 className="relative text-4xl font-bold tracking-tight md:text-6xl">
                {t.contact.title}
                <span className="text-primary">.</span>
              </h2>
              <div className="relative mt-6 flex flex-wrap justify-center gap-2">
                <a
                  href="https://github.com/francescomonticone"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(0,163,255,0.25)]"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/francesco-monticone-04412b2a0/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(10,102,194,0.45)]"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="mt-4">
              <ContactForm />
            </div>
          </Reveal>
          <footer className="mt-8 flex justify-center text-xs text-faint">
            <p>{t.footer}</p>
          </footer>
        </section>
      </main>
    </div>
  );
}
