"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { ChatAnswer } from "@/lib/chatbot";
import { GithubIcon } from "@/components/github-icon";
import { AgentFace } from "@/components/agent-face";
import { moodForAnswer } from "@/lib/agent-face/faceModel";
import type { Mood } from "@/lib/agent-face/faceModel";

/**
 * Slot for the future 3D AI agent face.
 * TODO(agent-3d): the 3D model face screen reuses lib/agent-face/faceModel
 * (Mood, PRESETS, lerpParams) — only the renderer changes. Keep the same
 * rounded-rectangle footprint so the layout does not shift.
 */
export function AgentAvatar({ mood }: { mood: Mood }) {
  return (
    <div
      data-agent="avatar-slot"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
    >
      <AgentFace mood={mood} size={40} />
    </div>
  );
}

/**
 * Chat answer that streams in word-by-word like an LLM emitting tokens.
 * Links and follow-ups appear only once streaming is done.
 */
export function StreamingAnswer({
  answer,
  onPick,
}: {
  answer: ChatAnswer;
  onPick: (suggestion: string) => void;
}) {
  const reduce = useReducedMotion();
  const tokens = useMemo(() => answer.text.split(/(\s+)/), [answer.text]);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    if (reduce) {
      setShown(tokens.length);
      return;
    }
    const t = setInterval(() => {
      setShown((s) => {
        if (s >= tokens.length) {
          clearInterval(t);
          return s;
        }
        return s + 1;
      });
    }, 28);
    return () => clearInterval(t);
  }, [answer, tokens, reduce]);

  const done = shown >= tokens.length;

  // Sleepy after 30s of inactivity once the answer is complete.
  const [sleepy, setSleepy] = useState(false);
  useEffect(() => {
    setSleepy(false);
    if (!done) return;
    const t = setTimeout(() => setSleepy(true), 30000);
    return () => clearTimeout(t);
  }, [answer, done]);

  const mood: Mood = !done ? "curious" : sleepy ? "sleepy" : moodForAnswer(answer.text);

  return (
    <div className="mt-3 rounded-bento border border-line bg-card px-4 py-3">
      <div className="flex gap-3">
        <AgentAvatar mood={mood} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] text-ink">
            {tokens.slice(0, shown).join("")}
            {!done && <span aria-hidden className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-primary" />}
          </p>
          {done && answer.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {answer.links.map((l) => {
                const isGh = l.href.includes("github.com");
                return (
                  <a
                    key={l.href + l.label}
                    href={l.href}
                    target={l.href.startsWith("#") ? undefined : "_blank"}
                    rel="noreferrer"
                    className={
                      isGh
                        ? "inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
                        : "inline-flex items-center gap-1.5 rounded-full border border-line bg-carddeep px-4 py-2 text-xs font-semibold text-muted transition-colors hover:text-ink"
                    }
                  >
                    {isGh && <GithubIcon className="h-4 w-4" />}
                    {l.label}
                    {!isGh && " ↗"}
                  </a>
                );
              })}
            </div>
          )}
          {done && answer.suggestions.length > 0 && (
            <div className="mt-3">
              <p className="text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                Try next:
              </p>
              <div className="mt-1.5 flex flex-wrap justify-end gap-2.5">
                {answer.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => onPick(s)}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,163,255,0.3)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
