"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSite } from "@/lib/locale";

const SIZE = 168;

/**
 * Sticker da grattare per rivelare il voto di laurea.
 * Canvas con vernice metallica: il puntatore la rimuove con destination-out.
 * Oltre ~55% grattato si rivela da solo; c'è anche un bottone per accessibilità.
 */
export function GradeSticker() {
  const site = useSite();
  const sticker = site.t.about.sticker;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const g = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    g.addColorStop(0, "#0b2f52");
    g.addColorStop(0.35, "#1373b8");
    g.addColorStop(0.55, "#7dd3fc");
    g.addColorStop(0.75, "#00a3ff");
    g.addColorStop(1, "#082f49");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SIZE, SIZE);

    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1;
    for (let i = -SIZE; i < SIZE * 2; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + SIZE, SIZE);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "600 10px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "1.5px";
    ctx.fillText(sticker.scratch.toUpperCase(), SIZE / 2, SIZE / 2 + 4);
  }, [sticker.scratch]);

  useEffect(() => {
    paint();
  }, [paint]);

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * SIZE;
    const y = ((e.clientY - r.top) / r.height) * SIZE;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  const progress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 32) {
      total += 1;
      if (data[i] < 40) clear += 1;
    }
    return total ? clear / total : 0;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative rotate-[-5deg] transition-transform duration-500 hover:rotate-0">
        <div className="relative h-[168px] w-[168px] overflow-hidden rounded-full border border-white/25 bg-carddeep shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(0,163,255,0.35),transparent_60%)]">
            <span className="text-[42px] font-bold leading-none tracking-[-0.04em] text-ink">
              109<span className="text-lg text-muted">/110</span>
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              {sticker.degree}
            </span>
            <span className="mt-1 text-[10px] text-muted">Politecnico di Milano</span>
          </div>
          <canvas
            ref={canvasRef}
            aria-label={`${sticker.scratch}: 109/110`}
            role="img"
            onPointerDown={(e) => {
              drawing.current = true;
              setStarted(true);
              e.currentTarget.setPointerCapture(e.pointerId);
              scratch(e);
            }}
            onPointerMove={scratch}
            onPointerUp={() => {
              drawing.current = false;
              if (progress() > 0.55) setRevealed(true);
            }}
            onPointerLeave={() => {
              drawing.current = false;
            }}
            className={`absolute inset-0 h-full w-full touch-none rounded-full ${
              revealed ? "pointer-events-none opacity-0" : "cursor-grab opacity-100"
            } transition-opacity duration-500`}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="mt-4 text-[11px] font-semibold text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        {revealed ? sticker.revealed : started ? sticker.reveal : sticker.scratch}
      </button>
    </div>
  );
}
