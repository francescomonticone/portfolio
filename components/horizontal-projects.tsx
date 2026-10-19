"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Cpu, Waves } from "lucide-react";
import { DroCaseStudy, DroPreview } from "@/components/dro-case-study";
import { Reveal } from "@/components/motion";
import { GithubIcon } from "@/components/github-icon";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { type Project } from "@/lib/content";
import { useSite } from "@/lib/locale";

/* ---------------------------------------------------------------- *
 * FEATURED — deck orizzontale guidato dallo scroll verticale.
 * Riordinare o aggiungere progetti = modificare `projects` in
 * lib/content.ts. Altezza e corsa si adattano da sole al numero di card.
 * ---------------------------------------------------------------- */

const CARD_WIDTH = "w-[84vw] sm:w-[440px] lg:w-[500px]";

/** Carosello foto: crossfade ogni 4s, pausa on-hover, statico con reduced-motion. */
function PhotoCarousel({
  title,
  photos,
  logo,
}: {
  title: string;
  photos: string[];
  logo?: string;
}) {
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
        className="relative flex h-48 flex-col justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative h-40">
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
      </div>
      <div className="mt-2 flex min-h-[22px] items-center justify-between">
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

function ProjectCard({ project }: { project: Project }) {
  const { t } = useSite();
  const { id, type, title, stack, description, points, codePublic, academic, photos, logo, repo } =
    project;

  return (
    <article className={`flex shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-card ${CARD_WIDTH}`}>
      {photos.length > 0 ? (
        <div className="bg-black/40 p-2">
          <PhotoCarousel title={title} photos={photos} logo={logo} />
        </div>
      ) : project.caseStudy === "dro" ? (
        <div className="bg-black/40 p-2">
          <DroPreview />
        </div>
      ) : (
        <div className="relative flex h-[224px] flex-col justify-center overflow-hidden bg-abyss">
          <div aria-hidden className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-sky-500/10 blur-[40px]" />
          <div aria-hidden className="absolute -bottom-14 -right-10 h-56 w-56 rounded-full bg-[#00a3ff]/10 blur-3xl" />
          <div className="relative flex items-center justify-between px-6">
            <span className="text-8xl font-bold tracking-tight text-white/10">{id}</span>
            <span className="text-right text-xs font-semibold uppercase tracking-[0.16em] text-[#7dd3fc]">
              {stack.slice(0, 2).join(" · ")}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col border-t border-white/[0.07] p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{type}</span>
          {!codePublic && academic && (
            <span className="rounded-full border border-line px-3 py-1 text-xs text-faint">
              {t.featured.privateBadge}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-2xl font-bold tracking-tight md:text-[28px]">{title}</h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-muted">{description}</p>
        <div className="mb-4 mt-auto flex flex-wrap gap-2 pt-4">
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
        <div className="flex flex-wrap items-center gap-2">
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
            >
              <GithubIcon className="h-4 w-4" />
              {t.featured.github}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
          {project.caseStudy === "dro" && <DroCaseStudy />}
        </div>
      </div>
    </article>
  );
}

function SectionHead() {
  const site = useSite();
  return (
    <>
      <h2 className="text-4xl font-bold tracking-tight md:text-[60px] md:leading-[72px]">
        {site.t.featured.titleA} <span className="text-[#7dd3fc]">{site.t.featured.titleB}</span>
      </h2>
      <p className="mt-2 max-w-[65ch] text-[15px] text-ink/65">
        {site.t.featured.intro(site.projects.length)}
      </p>
    </>
  );
}

export function HorizontalProjects() {
  const site = useSite();
  const projects = site.projects;
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
      // Il deck vive dentro <main> centrato: la corsa deve tenere conto
      // del suo offset, altrimenti l'ultima card resta fuori viewport.
      const sticky = track.parentElement;
      const offset = sticky ? sticky.getBoundingClientRect().left : 0;
      setRange(Math.max(0, offset + track.scrollWidth - window.innerWidth));
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

  // Due soste: la prima lascia respirare il deck prima di partire,
  // la seconda tiene l'ultima card completamente dentro lo schermo.
  const x = useTransform(scrollYProgress, [0, 0.05, 0.88, 1], [0, 0, -range, -range]);
  /** Cresce con il numero di card: aggiungi un progetto e lo scroll si allunga. */
  const sectionHeight = `${120 + projects.length * 62}vh`;

  if (reduce) {
    return (
      <section id="projects" className="mt-24 scroll-mt-24 px-5 md:px-12">
        <SectionHead />
        <div className="mt-8 flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative scroll-mt-24"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-start pt-20 md:pt-24">
        <div className="px-5 md:px-12">
          <SectionHead />
        </div>
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="mt-6 flex w-max items-stretch gap-5 px-5 pb-6 md:px-12 [mask-image:linear-gradient(to_right,transparent,black_4%,black_100%)]"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * MINOR — card compatte, tag chiari, CTA LinkedIn con icona.
 * ---------------------------------------------------------------- */

export function MinorProjects() {
  const { t, minorProjects } = useSite();
  return (
    <section className="mx-auto w-full max-w-[1190px] px-5 md:px-12">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t.minor.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {t.minor.titleA} <span className="text-[#7dd3fc]">{t.minor.titleB}</span>
        </h2>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {minorProjects.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 0.08}>
            <article className="group flex h-full flex-col overflow-hidden rounded-bento border border-white/10 bg-white/[0.025] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
              {project.photo ? (
                <div className="relative h-44 shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.photo}
                    alt={`${project.title} preview`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-abyss/70 via-transparent to-transparent"
                  />
                </div>
              ) : (
                <div className="relative flex h-44 shrink-0 items-center justify-center overflow-hidden bg-abyss">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,163,255,0.22),transparent_60%)]"
                  />
                  <Cpu className="relative h-12 w-12 text-primary/70" strokeWidth={1.2} aria-hidden />
                  <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {project.stack[0]}
                  </span>
                </div>
              )}

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold tracking-tight">{project.title}</h3>
                <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-xs font-medium text-ink"
                    >
                      {s}
                    </span>
                  ))}
                  {project.link &&
                    (project.link.label.toLowerCase().includes("linkedin") ? (
                      <a
                        href={project.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(255,255,255,0.3)]"
                      >
                        <LinkedinIcon className="h-3.5 w-3.5" />
                        {t.minor.linkedin}
                      </a>
                    ) : (
                      <a
                        href={project.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black"
                      >
                        {project.link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * NOW BUILDING — titolo con glow blu, card con dettagli animati.
 * ---------------------------------------------------------------- */

function HandTrackingVisual() {
  const reduce = useReducedMotion();
  const { t } = useSite();
  const bones = [
    "M78 140 L60 118 L48 104 L40 92 L36 84",
    "M78 140 L66 112 L62 84 L60 64 L59 48",
    "M78 140 L78 110 L77 80 L77 58 L77 44",
    "M78 140 L90 112 L92 84 L93 64 L94 52",
    "M78 140 L101 118 L106 96 L109 80 L111 68",
    "M66 112 L78 110 L90 112 L101 118",
    "M60 118 L78 140 L101 118",
  ];
  const joints = [
    [78, 140], [60, 118], [48, 104], [40, 92], [36, 84],
    [66, 112], [62, 84], [60, 64], [59, 48],
    [78, 110], [77, 80], [77, 58], [77, 44],
    [90, 112], [92, 84], [93, 64], [94, 52],
    [101, 118], [106, 96], [109, 80], [111, 68],
  ];

  return (
    <div
      aria-hidden
      className="relative hidden h-60 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-abyss/60 md:flex"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(0,163,255,0.18),transparent_65%)]" />
      <svg viewBox="0 0 160 160" className="relative h-52 w-52">
        <g stroke="#00a3ff" strokeWidth="1" opacity="0.5" fill="none" strokeLinecap="round">
          {bones.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        {joints.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.2" fill="#7dd3fc" />
        ))}
      </svg>
      {!reduce && (
        <motion.span
          className="absolute inset-x-6 h-px bg-gradient-to-r from-transparent via-[#7dd3fc] to-transparent"
          animate={{ y: [-70, 70, -70], opacity: [0, 0.9, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
        {t.now.landmarks}
      </span>
    </div>
  );
}

function FrancoVisual() {
  const reduce = useReducedMotion();
  const { t } = useSite();
  return (
    <div
      aria-hidden
      className="relative hidden h-60 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-[#06111d] md:flex"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,rgba(0,163,255,0.22),transparent_62%)]" />
      <svg viewBox="0 0 240 180" className="relative h-52 w-full">
        <defs>
          <linearGradient id="franco-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b2f52" stopOpacity="0.1" />
            <stop offset="1" stopColor="#00a3ff" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path d="M0 138 C 24 130, 44 148, 68 140 S 112 128, 136 138 S 184 148, 210 138 S 232 132, 240 136 V180 H0 Z" fill="url(#franco-water)" />
        <path d="M0 148 C 24 140, 44 158, 68 150 S 112 138, 136 148 S 184 158, 210 148 S 232 142, 240 146" fill="none" stroke="#7dd3fc" strokeWidth="1" opacity="0.4" />
        <path d="M0 158 C 24 150, 44 168, 68 160 S 112 148, 136 158 S 184 168, 210 158 S 232 152, 240 156" fill="none" stroke="#00a3ff" strokeWidth="1" opacity="0.3" />

        {/* screws */}
        <circle cx="78" cy="122" r="17" fill="#0a1622" stroke="#7dd3fc" strokeWidth="1.6" />
        <circle cx="78" cy="122" r="8" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2 3" />
        <circle cx="160" cy="122" r="17" fill="#0a1622" stroke="#7dd3fc" strokeWidth="1.6" />
        <circle cx="160" cy="122" r="8" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2 3" />

        {/* chassis */}
        <rect x="88" y="88" width="62" height="34" rx="9" fill="#0c1a28" stroke="#00a3ff" strokeWidth="1.7" />
        <rect x="98" y="96" width="42" height="18" rx="4" fill="rgba(0,163,255,0.16)" stroke="rgba(125,211,252,0.35)" />
        <circle cx="109" cy="105" r="3" fill="#7dd3fc" />
        <circle cx="119" cy="105" r="3" fill="#00a3ff" />
        <circle cx="129" cy="105" r="3" fill="#7dd3fc" />

        {/* sensor mast */}
        <path d="M119 88 V68" stroke="#7dd3fc" strokeWidth="1.6" />
        <circle cx="119" cy="62" r="6" fill="#0a1622" stroke="#7dd3fc" strokeWidth="1.4" />
        {!reduce && (
          <motion.circle
            cx="119"
            cy="62"
            r="10"
            fill="none"
            stroke="#00a3ff"
            strokeWidth="1"
            animate={{ scale: [0.7, 1.8], opacity: [0.7, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
            style={{ transformOrigin: "119px 62px" }}
          />
        )}
        <path d="M119 62 L88 48 M119 62 L150 48 M119 62 L119 40" stroke="#00a3ff" strokeWidth="0.9" opacity="0.55" />

        {/* ROS nodes */}
        <g fill="#7dd3fc">
          <circle cx="88" cy="48" r="2.4" />
          <circle cx="150" cy="48" r="2.4" />
          <circle cx="119" cy="40" r="2.4" />
        </g>
      </svg>
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
          <Waves className="h-3 w-3" /> {t.now.floodRescue}
        </span>
        <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7dd3fc]">
          ROS 2
        </span>
      </div>
      <span className="absolute bottom-3 right-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-faint">
        F.R.A.N.C.O. · 2026
      </span>
    </div>
  );
}

export function NowBuilding() {
  const { t, nowBuilding } = useSite();

  return (
    <section className="mx-auto w-full max-w-[1190px] px-5 md:px-12">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t.now.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {t.now.titleA}{" "}
          <span className="relative inline-block text-primary drop-shadow-[0_0_22px_rgba(0,163,255,0.55)]">
            {t.now.titleB}
            <motion.span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-primary via-[#7dd3fc] to-transparent"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </h2>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-4">
        {nowBuilding.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 0.08}>
            <article className="group relative h-full overflow-hidden rounded-bento border border-primary/25 bg-white/[0.03] p-5 backdrop-blur-xl transition-colors duration-300 hover:border-primary/50 md:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#00a3ff]/15 blur-3xl"
              />
              <div className="relative grid gap-6 md:grid-cols-[1.25fr_1fr] md:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <span className="relative grid h-2 w-2 place-items-center">
                      <span className="absolute h-4 w-4 rounded-full border border-primary/40" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    {t.now.inProgress}
                  </span>
                  {project.org && (
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7dd3fc]">
                      {project.org}
                    </p>
                  )}
                  <h3 className="mt-0.5 text-lg font-bold tracking-tight">{project.title}</h3>
                  {project.role && (
                    <p className="mt-1 inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      {project.role}
                    </p>
                  )}
                  <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-xs font-medium text-ink"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
                      >
                        <GithubIcon className="h-4 w-4" />
                        {t.featured.github}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-5 py-2.5 text-sm font-bold text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/15 hover:shadow-[0_0_24px_rgba(0,163,255,0.2)]"
                      >
                        {t.now.projectPage}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                {project.visual === "franco" ? <FrancoVisual /> : project.visual === "hand" ? <HandTrackingVisual /> : null}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
