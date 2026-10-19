"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const COLS = 10;
const ROWS = 8;

/**
 * Reveals a card as a grid of pixels dissolving into the surface.
 * Deterministic delays keep SSR and client markup identical.
 */
export function PixelMaterialize({
  children,
  className = "",
  tileClassName = "bg-[#080c13]",
}: {
  children: React.ReactNode;
  className?: string;
  tileClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const active = Boolean(reduce || inView);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        className={`transition-[opacity,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          active ? "translate-y-0 opacity-100 blur-0" : "translate-y-2 opacity-0 blur-[7px]"
        }`}
        style={{ transitionDelay: active ? "140ms" : "0ms" }}
      >
        {children}
      </div>

      {!reduce && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          style={{
            opacity: active ? 0 : 1,
            transition: "opacity 220ms ease",
            transitionDelay: active ? "620ms" : "0ms",
          }}
        >
          <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
            {Array.from({ length: COLS * ROWS }).map((_, i) => {
              const col = i % COLS;
              const row = Math.floor(i / COLS);
              const delay = (col * 14 + row * 20 + ((i * 37) % 30)) / 1000;
              return (
                <span
                  key={i}
                  className={`${tileClassName} rounded-[2px] ${active ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
                  style={{
                    transition: "transform 460ms cubic-bezier(0.22,1,0.36,1), opacity 380ms ease",
                    transitionDelay: `${delay}s`,
                    margin: "0.5px",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
