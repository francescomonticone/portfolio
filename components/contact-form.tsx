"use client";

import { useState } from "react";
import { Button, LiquidButton } from "@/components/ui/liquid-glass-button";

const OPPORTUNITIES = [
  "SWE internship",
  "AI / ML",
  "Cybersecurity",
  "Research",
  "Other",
];

/**
 * Form recruiter → email via Web3Forms (nessun backend proprio,
 * l'indirizzo resta dietro la chiave, mai nel codice).
 * Config: NEXT_PUBLIC_WEB3FORMS_KEY nel .env.local
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [type, setType] = useState(OPPORTUNITIES[0]);
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!key) {
      setStatus("error");
      return;
    }
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company_website) return; // honeypot
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_key: key, subject: `Portfolio: ${type}`, ...data, type }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const field =
    "w-full rounded-xl border border-line bg-carddeep px-4 py-3 text-[15px] text-ink placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted";

  if (status === "sent") {
    return (
      <div className="rounded-bento border border-line bg-card p-6 text-center">
        <p className="text-xl font-bold text-ink">Message sent ✓</p>
        <p className="mt-2 text-[15px] text-muted">Thanks for reaching out — I&apos;ll get back to you soon.</p>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setStatus("idle")}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-bento border border-line bg-card p-5 md:p-6">
      {/* honeypot anti-spam */}
      <input type="text" name="company_website" className="hidden" tabIndex={-1} autoComplete="off" />
      <input type="hidden" name="type" value={type} />

      <div>
        <span id="opp-label" className={label}>I&apos;m looking for</span>
        <div role="radiogroup" aria-labelledby="opp-label" className="flex flex-wrap gap-2">
          {OPPORTUNITIES.map((o) => {
            const on = type === o;
            return (
              <button
                key={o}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setType(o)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  on
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(0,163,255,0.35)]"
                    : "border border-line bg-carddeep text-muted hover:border-primary/50 hover:text-ink"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>Name</label>
          <input id="cf-name" name="name" required placeholder="Jane Smith" autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>Work email</label>
          <input id="cf-email" name="email" required type="email" placeholder="jane@company.com" autoComplete="email" className={field} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="cf-company" className={label}>Company <span className="normal-case tracking-normal text-faint">(optional)</span></label>
        <input id="cf-company" name="company" placeholder="Company Inc." autoComplete="organization" className={field} />
      </div>

      <div className="mt-4">
        <label htmlFor="cf-message" className={label}>Message</label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={4}
          placeholder="Role, timing, what you're looking for…"
          className={`${field} resize-none`}
        />
      </div>

      <LiquidButton type="submit" size="lg" className="mt-5 w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </LiquidButton>

      {!key && (
        <p className="mt-3 text-xs text-faint">
          Form endpoint not configured yet (NEXT_PUBLIC_WEB3FORMS_KEY).
        </p>
      )}
      {status === "error" && key && (
        <p className="mt-3 text-sm text-red-400">Couldn&apos;t send — check your connection and try again, or use GitHub/LinkedIn above.</p>
      )}
    </form>
  );
}
