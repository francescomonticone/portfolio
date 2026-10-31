"use client";

import { useActiveAnimation } from "@/lib/use-active-animation";
import { useEffect, useState } from "react";
import { Eyebrow, Reveal } from "@/components/motion";
import { Memoji, CursorGlow } from "@/components/media";
import { SiteHeader } from "@/components/site-header";
import { ArrowDown, ArrowUpRight } from "lucide-react";
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
import { LocaleProvider, useSite } from "@/lib/locale";


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
  const { ref, active } = useActiveAnimation<HTMLDivElement>();
  return (
    <div
      ref={ref}
      aria-label={label}
      className="marquee-paused relative w-full overflow-hidden border-y border-line bg-card/30 py-2"
      style={{ ["--marquee-duration" as string]: duration }}
    >
      <div className="marquee-track gap-0" style={{animationPlayState: active ? "running" : "paused"}}>
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

function Portfolio() {
  const site = useSite();
  const { t, profile, locale } = site;
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<ChatAnswer | null>(null);

  useEffect(() => { setAnswer(null); }, [locale]);

  const runAsk = (q: string) => {
    if (!q.trim()) return;
    setAnswer(answerQuestion(q));
  };

  const ask = (q: string) => runAsk(q);

  return (
    <div id="top" className="relative min-h-screen overflow-x-clip bg-abyss text-ink">
      <CursorGlow />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="relative z-10 mx-auto w-full max-w-[1190px] px-5 pt-28 md:px-12">
        {/* ── Hero AI-chat card ─────────────── */}
        <Reveal>
          <section id="intro" className="relative overflow-hidden rounded-frost border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl md:p-10">
            <Glow className="left-1/4 top-0 h-32 w-32 bg-sky-500/10 blur-[35px]" />
            <div className="relative">
              <div className="hero-avatar flex justify-center">
                <Memoji size={160} />
              </div>
              <div className="mt-2 text-center">
                <Eyebrow>{profile.role} — {profile.location}</Eyebrow>
              </div>
              <h1 className="mt-5 text-balance text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                {t.hero.greeting} <span className="text-[#7dd3fc]">{profile.name}</span>
              </h1>
              <p className="mt-4 max-w-[65ch] text-base leading-7 text-muted sm:text-lg sm:leading-8">
                {t.hero.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#projects" className="action-link rounded-full bg-primary px-5 py-3 text-sm font-semibold text-[#07121c]">
                  {locale === "it" ? "Esplora i progetti" : "Explore my work"}<ArrowDown aria-hidden className="size-4" />
                </a>
                <a href="https://github.com/francescomonticone" target="_blank" rel="noreferrer" className="action-link rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-ink">
                  <GithubIcon className="size-4" /> GitHub <ArrowUpRight aria-hidden className="size-3.5 text-muted" />
                </a>
              </div>
              <div className="mt-8 border-t border-white/10 pt-5">
              <p className="text-xs text-muted">{locale === "it" ? "Da dove vuoi iniziare? Chiedimi di Francesco." : "Where would you like to start? Ask about Francesco."}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.hero.chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => ask(c)}
                    className="rounded-full border border-line bg-carddeep min-h-11 px-4 py-2 text-sm font-medium text-muted transition-colors duration-150 hover:text-ink"
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
                  className="min-w-0 w-full bg-transparent text-base text-ink placeholder:text-faint focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-[#07121c] transition-colors duration-200 hover:bg-[#7dd3fc] disabled:opacity-40"
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
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-[#07121c] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(0,163,255,0.25)]"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/francesco-monticone-04412b2a0/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(10,102,194,0.45)]"
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
