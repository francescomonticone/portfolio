"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { ChatAnswer } from "@/lib/chatbot";
import { GithubIcon } from "@/components/github-icon";

/**
 * Slot for the future 3D AI agent face.
 * TODO(agent-3d): replace this placeholder with the animated 3D character
 * that moves around the page. Keep the same rounded-rectangle footprint
 * (h-11 w-11, rounded-2xl) so the layout does not shift.
 */
export function AgentAvatar({ typing }: { typing: boolean }) {
  return (
    <div
      data-agent="avatar-slot"
      aria-hidden
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] ${
        typing ? "animate-pulse" : ""
      }`}
    >
      {/* Temporary mark until the 3D agent + animations land. */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6 text-muted">
        <rect x="5" y="8" width="14" height="11" rx="3" />
        <circle cx="9.5" cy="13" r="1" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="13" r="1" fill="currentColor" stroke="none" />
        <path d="M12 8V4" strokeLinecap="round" />
        <circle cx="12" cy="3.2" r="1" fill="currentColor" stroke="none" />
      </svg>
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

  return (
    <div className="mt-3 rounded-bento border border-line bg-card px-4 py-3">
      <div className="flex gap-3">
        <AgentAvatar typing={!done} />
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
