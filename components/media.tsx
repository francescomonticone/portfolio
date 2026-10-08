"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Memoji che segue il puntatore con il volto.
 * - trasla verso il cursore (max ~14px, con spring morbido)
 * - ruota leggermente verso il cursore (±8°)
 * - se /memoji.png manca, mostra il fallback con iniziali
 */
export function Memoji({ size = 112 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setMissing(true);
  }, []);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 150, damping: 18, mass: 0.6 });
  const rotate = useTransform(sx, [-14, 14], [-8, 8]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const max = 14;
      const amp = Math.min(max, dist / 18);
      x.set((dx / dist) * amp);
      y.set((dy / dist) * amp);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <div ref={ref} style={{ width: size, height: size }} className="relative">
      {/* alone di glow dietro */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full bg-sky-500/10 blur-[35px]"
      />
      <motion.div style={{ x: sx, y: sy, rotate }} className="relative h-full w-full">
        <motion.div
          className="h-full w-full"
          animate={missing ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {!missing ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src="/img/memoji.png"
              alt="Francesco's Memoji"
              width={size}
              height={size}
              className="h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
              onError={() => setMissing(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/40 via-carddeep to-pcyan/20 text-4xl font-bold text-ink">
              FM
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Nuvola di colore che segue il cursore sullo sfondo.
 * Sta dietro ai contenuti (z-0): sopra i box solidi non si vede,
 * sullo sfondo libero crea l'alone blu. Solo mouse, no reduced-motion.
 */
export function CursorGlow() {
  const x = useMotionValue(-800);
  const y = useMotionValue(-800);
  const sx = useSpring(x, { stiffness: 55, damping: 18, mass: 1.2 });
  const sy = useSpring(y, { stiffness: 55, damping: 18, mass: 1.2 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX - 300);
      y.set(e.clientY - 300);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] rounded-full"
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(circle, rgba(0,163,255,0.14) 0%, rgba(0,163,255,0.05) 40%, transparent 70%)",
      }}
    />
  );
}
/**
 * Foto con fallback: se il file non esiste (ancora), mostra un placeholder
 * coerente col design invece di rompere il layout.
 */
export function Photo({
  src,
  alt,
  className = "",
  label,
}: {
  src: string;
  alt: string;
  className?: string;
  label?: string;
}) {
  const [missing, setMissing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setMissing(true);
  }, []);
  if (missing) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-carddeep via-card to-abyss ${className}`}
        role="img"
        aria-label={`${alt} (placeholder)`}
      >
        <span className="px-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-faint">
          {label ?? alt}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setMissing(true)}
      className={`object-cover ${className}`}
    />
  );
}
