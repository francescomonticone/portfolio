"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Eyebrow, Reveal } from "@/components/motion";
import { minorProjects, projects } from "@/lib/content";

/** Carosello foto: cambia ogni 4s con crossfade, pausa on-hover, primo frame se reduced-motion. */
function PhotoCarousel({ title, photos, logo }: { title: string; photos: string[]; logo?: string }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (photos.length < 2 || reduce || paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), 4000);
    return () => clearInterval(t);
  }, [photos.length, reduce, paused]);

  return (
    <div>
      <div
        className="relative h-52 overflow-hidden rounded-xl border border-white/10 bg-black/40"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {photos.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={`${title} screenshot ${i + 1}`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-1.5">
          {photos.length > 1 &&
            photos.map((src, i) => (
              <button
                key={src}
                aria-label={`Photo ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === idx ? "w-5 bg-primary" : "w-1.5 bg-line hover:bg-muted"
                }`}
              />
            ))}
        </div>
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={`${title} logo`} loading="lazy" className="h-7 w-auto object-contain" />
        )}
      </div>
    </div>
  );
}

/**
 * Progetti importanti in scorrimento orizzontale guidato dallo scroll verticale:
 * container alto 350vh + sticky 100vh. La distanza è MISURATA sul track reale
 * (scrollWidth - viewport), quindi aggiungere progetti in lib/content.ts
 * funziona senza ritoccare nulla. Edge-fade via mask per un taglio pulito.
 * Con reduced-motion diventa una normale lista verticale.
 */
export function HorizontalProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [range, setRange] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      setRange(Math.max(0, track.scrollWidth - window.innerWidth + 48));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    if (document.fonts) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);

  const header = (
    <>
      <Eyebrow>Portfolio</Eyebrow>
      <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-[60px] md:leading-[72px]">
        Featured <span className="text-muted">Projects</span>
      </h2>
      <p className="mt-3 max-w-[65ch] text-muted">
        Keep scrolling — dossiers slide in horizontally. Academic code stays private until term end.
      </p>
    </>
  );

  if (reduce) {
    return (
      <section id="projects" className="mt-24 scroll-mt-24 px-5 md:px-12">
        {header}
        <div className="mt-8 flex flex-col gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={containerRef} className="relative scroll-mt-24" style={{ height: "400vh" }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-28">
        <div className="px-5 md:px-12">{header}</div>
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="mt-8 flex w-max gap-5 px-5 pb-4 md:px-12 [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]"
        >
          {projects.map((p) => (
            <ProjectCard key={p.id} {...p} />
          ))}
          {/* cuscinetto finale: l'ultima card è intera ben prima di fine corsa */}
          <div aria-hidden className="w-[28vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({
  id,
  type,
  title,
  stack,
  description,
  points,
  codePublic,
  academic,
  photos,
  logo,
}: {
  id: string;
  type: string;
  title: string;
  stack: string[];
  description: string;
  points: string[];
  codePublic: boolean;
  academic: boolean;
  photos: string[];
  logo?: string;
}) {
  return (
    <article className="w-[84vw] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-card sm:w-[460px] lg:w-[540px]">
      {photos.length > 0 ? (
        <div className="bg-black/40 p-2">
          <PhotoCarousel title={title} photos={photos} logo={logo} />
        </div>
      ) : (
        <div className="relative overflow-hidden bg-abyss">
          <div aria-hidden className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-sky-500/10 blur-[40px]" />
          <div aria-hidden className="absolute -bottom-14 -right-10 h-56 w-56 rounded-full bg-[#00a3ff]/10 blur-3xl" />
          <div className="relative flex aspect-[16/10] items-center justify-between px-6">
            <span className="text-8xl font-bold tracking-tight text-white/10">{id}</span>
            <span className="text-right text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {stack.slice(0, 2).join(" · ")}
            </span>
          </div>
        </div>
      )}
      <div className="border-t border-white/[0.07] p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{type}</span>
          {!codePublic && academic && (
            <span className="rounded-full border border-line px-3 py-1 text-xs text-faint">
              code private · academic term
            </span>
          )}
        </div>
        <h3 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((s) => (
            <span key={s} className="rounded-full border border-line bg-carddeep px-3 py-1 text-xs font-medium text-muted">
              {s}
            </span>
          ))}
          {points.map((s) => (
            <span key={s} className="rounded-full bg-white/[0.03] px-3 py-1 text-[13px] text-ink">
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/** Progettini minori: griglia compatta sotto i featured. */
export function MinorProjects() {
  return (
    <section className="mx-auto w-full max-w-[1190px] px-5 md:px-12">
      <Reveal>
        <Eyebrow>Side quests</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Minor <span className="text-muted">projects</span>
        </h2>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {minorProjects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.08}>
            <article className="h-full rounded-bento border border-line bg-card p-5 transition-all duration-200 hover:-translate-y-0.5">
              <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full border border-line bg-carddeep px-3 py-1 text-xs font-medium text-muted">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
