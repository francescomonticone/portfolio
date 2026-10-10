"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { PRESETS, lerpParams } from "@/lib/agent-face/faceModel";
import type { EyeShape, FaceParams, Mood } from "@/lib/agent-face/faceModel";

const DARK = "#23262b";
const LIME = "#d7e600";
const SHELL = "#edeff2";
const SHELL_EDGE = "#cfd3d9";

/** Re-runnable parametric robot face (SVG). Swap `mood` — geometry tweens there. */
export function AgentFace({ mood, size = 44 }: { mood: Mood; size?: number }) {
  const def = PRESETS[mood];
  const [rp, setRp] = useState<FaceParams>(def.params);
  const [blink, setBlink] = useState(1);
  const rpRef = useRef<FaceParams>(def.params);
  // Discrete shapes follow the mood directly (no timers — race-free);
  // fluidity comes from the geometry tween underneath.
  // Happy alternates arcs / dots on every entry, for variety.
  const happyCount = useRef(0);
  const [dotsHappy, setDotsHappy] = useState(false);
  useEffect(() => {
    if (mood === "happy") {
      happyCount.current += 1;
      setDotsHappy(happyCount.current % 2 === 0);
    }
  }, [mood]);
  const shapeL: EyeShape = dotsHappy && def.shapeL === "happy" ? "dots" : def.shapeL;
  const shapeR: EyeShape = dotsHappy && def.shapeR === "happy" ? "dots" : def.shapeR;
  const showZzz = def.zzz;

  // Fluid morph between presets on mood change (progress 0->1, lerp by hand).
  useEffect(() => {
    const from = { ...rpRef.current };
    const to = def.params;
    const controls = animate(0, 1, {
      duration: 0.32,
      ease: "easeOut",
      onUpdate: (p) => {
        const v = lerpParams(from, to, p);
        rpRef.current = v;
        setRp(v);
      },
    });
    // Geometry morphs between presets; discrete flags follow the mood directly.
    return () => {
      controls.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  // Random blink — only when both eyes are plain ovals.
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      timer = setTimeout(() => {
        if (!alive) return;
        const d = PRESETS[mood];
        if (d.shapeL === "oval" && d.shapeR === "oval") {
          setBlink(0.06);
          setTimeout(() => alive && setBlink(1), 130);
        }
        loop();
      }, 2400 + Math.random() * 2800);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [mood]);

  return (
    <motion.div
      animate={{ y: [0, -1.5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 48 48" width={size} height={size} role="img" aria-label={`Agent is ${mood}`}>
        <g transform={`rotate(${rp.tilt.toFixed(2)} 24 24)`}>
          {/* Ear pods */}
          <rect x="1.5" y="16" width="4.4" height="14" rx="2.2" fill={DARK} />
          <rect x="42.1" y="16" width="4.4" height="14" rx="2.2" fill={DARK} />
          <circle cx="3.7" cy="23" r="1.2" fill={LIME} />
          <circle cx="44.3" cy="23" r="1.2" fill={LIME} />
          {/* Helmet shell */}
          <rect x="5" y="7" width="38" height="34" rx="11" fill={SHELL} stroke={SHELL_EDGE} strokeWidth="1" />
          {/* Face screen */}
          <rect x="10.5" y="12.5" width="27" height="23" rx="9" fill={LIME} />
          {/* Brows */}
          {Math.abs(rp.browL) >= 6 && (
            <line
              x1="15" y1="15.8" x2="22" y2="15.8"
              stroke={DARK} strokeWidth="1.7" strokeLinecap="round"
              transform={`rotate(${rp.browL.toFixed(1)} 18.5 15.8)`}
            />
          )}
          {Math.abs(rp.browR) >= 6 && (
            <line
              x1="26" y1="15.8" x2="33" y2="15.8"
              stroke={DARK} strokeWidth="1.7" strokeLinecap="round"
              transform={`rotate(${rp.browR.toFixed(1)} 29.5 15.8)`}
            />
          )}
          {/* Eyes */}
          <Eye cx={19} cy={22.5} open={rp.eyeL * blink} shape={shapeL} />
          <Eye cx={29} cy={22.5} open={rp.eyeR * blink} shape={shapeR} mirror />
          {/* Mouth */}
          <Mouth smile={rp.mouthSmile} open={rp.mouthOpen} shift={rp.mouthShift} />
          {/* Sleepy Zzz */}
          <g
            fill={DARK}
            style={{ opacity: showZzz ? 1 : 0, transition: "opacity 300ms" }}
          >
            <text x="34" y="12" fontSize="5" fontWeight="bold">z</text>
            <text x="37.5" y="8.5" fontSize="6.5" fontWeight="bold">Z</text>
          </g>
        </g>
      </svg>
    </motion.div>
  );
}

function Eye({ cx, cy, open, shape, mirror }: { cx: number; cy: number; open: number; shape: EyeShape; mirror?: boolean }) {
  const o = Math.max(0.06, Math.min(1.2, open));
  if (shape === "closed") {
    return (
      <path
        d={`M ${cx - 3} ${cy} Q ${cx} ${cy + 1.8} ${cx + 3} ${cy}`}
        stroke={DARK} strokeWidth="1.9" strokeLinecap="round" fill="none"
      />
    );
  }
  if (shape === "happy") {
    return (
      <path
        d={`M ${cx - 3.4} ${cy + 1.2} Q ${cx} ${cy - 3.4} ${cx + 3.4} ${cy + 1.2}`}
        stroke={DARK} strokeWidth="1.9" strokeLinecap="round" fill="none"
      />
    );
  }
  if (shape === "excited") {
    const s = mirror ? -1 : 1;
    return (
      <path
        d={`M ${cx - s * 2.2} ${cy - 2.6} L ${cx + s * 2} ${cy} L ${cx - s * 2.2} ${cy + 2.6}`}
        stroke={DARK} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    );
  }
  if (shape === "dots") {
    return <circle cx={cx} cy={cy} r="1.7" fill={DARK} />;
  }
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="3.1" ry={3.1 * o} fill={DARK} />
      {o > 0.5 && <circle cx={cx + 1} cy={cy - 1} r="0.85" fill="#fff" opacity="0.9" />}
    </g>
  );
}

function Mouth({ smile, open, shift }: { smile: number; open: number; shift: number }) {
  const cx = 24 + shift;
  const y = 31.5;
  // Smile: middle hangs LOW (corners lift). Frown: middle rises. Sign matters!
  return (
    <g>
      {open > 0.05 && (
        <ellipse cx={cx} cy={y + 0.5 + open * 1.2} rx={1.5 + 2 * open} ry={0.8 + 1.8 * open} fill={DARK} />
      )}
      <path
        d={`M ${cx - 7} ${y} Q ${cx} ${y + 5 * smile} ${cx + 7} ${y}`}
        stroke={DARK} strokeWidth="2.2" strokeLinecap="round" fill="none"
      />
    </g>
  );
}
