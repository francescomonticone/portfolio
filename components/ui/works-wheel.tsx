"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  title: string;
  images?: string[];
  fallback?: React.ReactNode;
}
export type WorksWheelHandle = { goTo: (index: number) => void };
export interface WorksWheelProps extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  items: WorksWheelItem[];
  label?: string;
  panel?: (active: number, goTo: (index: number) => void) => React.ReactNode;
  onActiveChange?: (index: number) => void;
  controls?: { previous: string; next: string; hint: string; pause: string; play: string };
}
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const rad = (degrees: number) => degrees * Math.PI / 180;

function WheelMedia({ item, active, paused }: { item: WorksWheelItem; active: boolean; paused: boolean }) {
  const [index, setIndex] = React.useState(0);
  const [failed, setFailed] = React.useState<string[]>([]);
  const images = (item.images ?? []).filter(src => !failed.includes(src));
  React.useEffect(() => {
    if (!active || paused || images.length < 2) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % images.length), 4200);
    return () => window.clearInterval(timer);
  }, [active, paused, images.length]);
  if (!images.length) return item.fallback;
  return (
    <div className="relative size-full bg-[#0c1017]">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt={`${item.title} — ${i + 1}`} loading="lazy" decoding="async" draggable={false}
          onError={() => setFailed(previous => [...previous, src])}
          aria-hidden={i !== index % images.length}
          className={cn("absolute inset-0 size-full object-contain p-2 transition-opacity duration-500", i === index % images.length ? "opacity-100" : "opacity-0")} />
      ))}
    </div>
  );
}

/** Ring → perspective drum. Animation frames run only while the wheel moves. */
export const WorksWheel = React.forwardRef<WorksWheelHandle, WorksWheelProps>(function WorksWheel(
  { items, label, panel, onActiveChange, controls, className, ...props }, ref,
) {
  const id = React.useId();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const cards = React.useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const wake = React.useRef<() => void>(() => {});
  const turn = React.useRef(1);
  const target = React.useRef(1);
  const selected = React.useRef(0);
  const settle = React.useRef(0);
  const suppressClick = React.useRef(false);
  const drag = React.useRef<{ x: number; y: number; start: number; moved: boolean; pointer: number } | null>(null);
  const [active, setActive] = React.useState(0);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [compact, setCompact] = React.useState(true);
  const [preferencesReady, setPreferencesReady] = React.useState(false);
  const initialized = React.useRef(false);
  const [reduced, setReduced] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const count = items.length;
  const last = Math.max(0, count - 1);
  const minimum = compact || reduced || count < 3 ? 1 : 0;

  React.useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => { setCompact(!desktop.matches); setReduced(motion.matches); };
    read();
    setPreferencesReady(true);
    desktop.addEventListener("change", read);
    motion.addEventListener("change", read);
    return () => { desktop.removeEventListener("change", read); motion.removeEventListener("change", read); };
  }, [count]);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const resize = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      setSize(previous => previous.w === w && previous.h === h ? previous : { w, h });
    });
    let inView = false;
    const readVisibility = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; readVisibility(); }, { rootMargin: "100px" });
    document.addEventListener("visibilitychange", readVisibility);
    resize.observe(el);
    observer.observe(el);
    return () => { resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", readVisibility); };
  }, []);

  React.useEffect(() => {
    if (!preferencesReady) return;
    if (!initialized.current) { turn.current = target.current = minimum; initialized.current = true; }
    target.current = clamp(target.current, minimum, last + 1);
    if (reduced) turn.current = target.current;
    wake.current();
  }, [minimum, last, reduced, preferencesReady]);

  React.useEffect(() => {
    if (!size.w || !count || !preferencesReady) return;
    let frame = 0;
    let previousTime = 0;
    let disposed = false;
    const width = compact ? Math.min(size.w * .84, 520) : Math.min(size.w * .57, 320);
    const height = width / 1.45;
    const radius = height * (compact ? 1.65 : 1.8);
    const ringRadius = Math.min(size.w * .33, size.h * .32);
    const ringScale = clamp((2 * Math.PI * ringRadius / count) * .72 / width, .3, .75);

    const draw = (time: number) => {
      frame = 0;
      if (disposed) return;
      const delta = previousTime ? Math.min(time - previousTime, 50) : 16.67;
      previousTime = time;
      const gap = target.current - turn.current;
      turn.current = reduced || !visible || Math.abs(gap) < .001 ? target.current : turn.current + gap * (1 - Math.pow(.84, delta / 16.67));
      const t = turn.current;
      const morph = clamp(t, 0, 1);
      const position = Math.max(0, t - 1);
      for (let i = 0; i < count; i++) {
        const card = cards.current[i];
        if (!card) continue;
        const distance = i - position;
        const angle = distance * 46;
        const ringAngle = i * 360 / count;
        // Each card owns its complete transform. No zero-size 3D parent or
        // nested backface culling: these can hide the front card in WebKit.
        const x = (1 - morph) * Math.sin(rad(ringAngle)) * ringRadius - morph * height * .65 * (1 - Math.cos(rad(angle)));
        const y = -(1 - morph) * Math.cos(rad(ringAngle)) * ringRadius - morph * Math.sin(rad(angle)) * radius;
        const z = morph * radius * (Math.cos(rad(angle)) - 1);
        card.style.width = `${width}px`;
        card.style.height = `${height}px`;
        card.style.transform = reduced
          ? "translate(-50%, -50%)"
          : `translate(-50%, -50%) translate3d(${x}px,${y}px,${z}px) rotateX(${morph * angle}deg) rotateZ(${(1 - morph) * ringAngle}deg) scale(${ringScale + (1 - ringScale) * morph})`;
        const hidden = reduced ? i !== Math.round(position) : morph > .5 && Math.abs(distance) > 1.45;
        card.style.opacity = hidden ? "0" : "1";
        card.style.visibility = hidden ? "hidden" : "visible";
        card.style.pointerEvents = hidden ? "none" : "auto";
        card.style.zIndex = String(100 - Math.round(Math.abs(distance) * 10));
      }
      if (labelRef.current) labelRef.current.style.opacity = String(1 - morph);
      const next = clamp(Math.round(position), 0, last);
      if (selected.current !== next) { selected.current = next; setActive(next); }
      if (visible && Math.abs(target.current - turn.current) > .001) frame = requestAnimationFrame(draw);
    };
    const request = () => { if (!frame && !disposed) frame = requestAnimationFrame(draw); };
    wake.current = request;
    request();
    return () => { disposed = true; cancelAnimationFrame(frame); wake.current = () => {}; };
  }, [size, count, compact, reduced, last, visible, preferencesReady]);

  const to = React.useCallback((value: number) => {
    target.current = clamp(value, minimum, last + 1);
    wake.current();
  }, [minimum, last]);
  const goTo = React.useCallback((index: number) => { window.clearTimeout(settle.current); to(clamp(index, 0, last) + 1); }, [to, last]);
  const stepBy = (direction: number) => goTo(Math.round(target.current - 1) + direction);
  React.useImperativeHandle(ref, () => ({ goTo }), [goTo]);
  React.useEffect(() => { onActiveChange?.(active); }, [active, onActiveChange]);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el || compact || reduced) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? size.h : 1);
      if (!delta || (delta > 0 && target.current >= last + 1) || (delta < 0 && target.current <= minimum)) return;
      event.preventDefault();
      to(target.current + delta / 640);
      window.clearTimeout(settle.current);
      settle.current = window.setTimeout(() => to(Math.round(target.current)), 160);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); window.clearTimeout(settle.current); };
  }, [compact, reduced, last, minimum, size.h, to]);

  const finishDrag = () => {
    const gesture = drag.current;
    drag.current = null;
    if (gesture?.moved) { suppressClick.current = true; to(Math.round(target.current)); }
  };
  if (!count) return null;
  return (
    <section className={cn("relative", className)} aria-label={label} {...props}>
      <div className={cn("grid items-stretch gap-6 lg:gap-10", panel && "lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]")}>
        {panel && <div className="order-2 min-w-0 lg:order-1">{panel(active, goTo)}</div>}
        <div className="relative order-1 min-w-0 lg:order-2">
          <div ref={stageRef} tabIndex={0} role="listbox" aria-label={label} aria-orientation={compact ? "horizontal" : "vertical"}
            aria-activedescendant={`${id}-${active}`} aria-describedby={`${id}-hint`}
            className="works-stage relative h-[clamp(280px,78vw,420px)] w-full cursor-grab touch-pan-y overflow-hidden rounded-2xl bg-[#0d1119] outline-none focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing lg:h-[560px]"
            style={{ perspective: reduced ? "none" : "1000px" }}
            onPointerDown={event => {
              if (!event.isPrimary || event.button !== 0 || drag.current) return;
              suppressClick.current = false;
              drag.current = { x: event.clientX, y: event.clientY, start: target.current, moved: false, pointer: event.pointerId };
            }}
            onPointerMove={event => {
              const gesture = drag.current;
              if (!gesture || gesture.pointer !== event.pointerId) return;
              const dx = gesture.x - event.clientX;
              const dy = gesture.y - event.clientY;
              // Touch keeps native page scrolling; only a horizontal gesture turns the wheel.
              const horizontal = compact || event.pointerType === "touch";
              const amount = horizontal ? dx : dy;
              if (!gesture.moved && Math.abs(amount) < 8) return;
              if (!gesture.moved && horizontal && Math.abs(dy) > Math.abs(dx)) { drag.current = null; return; }
              gesture.moved = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              to(gesture.start + amount / (horizontal ? Math.max(180, size.w * .65) : 260));
            }}
            onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}
            onClickCapture={event => { if (suppressClick.current) { event.stopPropagation(); suppressClick.current = false; } }}
            onKeyDown={event => {
              if (["ArrowDown", "ArrowRight"].includes(event.key)) stepBy(1);
              else if (["ArrowUp", "ArrowLeft"].includes(event.key)) stepBy(-1);
              else if (event.key === "Home") goTo(0);
              else if (event.key === "End") goTo(last);
              else return;
              turn.current = target.current;
              wake.current();
              event.preventDefault();
            }}>
            {items.map((item, i) => (
              <div key={item.title} id={`${id}-${i}`} role="option" aria-label={item.title} aria-selected={i === active}
                ref={node => { cards.current[i] = node; }} onClick={() => goTo(i)}
                className="absolute left-1/2 top-1/2 aspect-[1.45] w-[84%] cursor-pointer select-none overflow-hidden rounded-xl border border-white/15 bg-card shadow-[0_16px_40px_-16px_rgba(0,0,0,.7)]"
                style={!size.w ? { transform: "translate(-50%,-50%)", visibility: i === 0 ? "visible" : "hidden" } : undefined}>
                <WheelMedia item={item} active={i === active && visible} paused={paused || reduced || !visible} />
              </div>
            ))}
            <div ref={labelRef} aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center text-lg font-semibold tracking-tight text-ink" style={{opacity:0}}>{label}</div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p id={`${id}-hint`} className="max-w-[24ch] text-xs leading-relaxed text-muted">{controls?.hint}</p>
            <div className="flex shrink-0 items-center gap-1.5">
              <button type="button" aria-label={paused ? controls?.play ?? "Play slideshow" : controls?.pause ?? "Pause slideshow"} aria-pressed={paused} onClick={() => setPaused(!paused)} className="icon-button" disabled={reduced}>
                {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
              </button>
              <button type="button" aria-label={controls?.previous ?? "Previous project"} onClick={() => stepBy(-1)} disabled={active === 0} className="icon-button"><ChevronLeft aria-hidden className="size-5" /></button>
              <span className="px-1 text-xs tabular-nums text-muted">{String(active + 1).padStart(2,"0")} / {String(count).padStart(2,"0")}</span>
              <button type="button" aria-label={controls?.next ?? "Next project"} onClick={() => stepBy(1)} disabled={active === last} className="icon-button"><ChevronRight aria-hidden className="size-5" /></button>
            </div>
          </div>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{active + 1} / {count}: {items[active]?.title}</p>
        </div>
      </div>
    </section>
  );
});
WorksWheel.displayName = "WorksWheel";
export default WorksWheel;
