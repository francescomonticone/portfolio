"use client";

import { useState } from "react";
import { Button, LiquidButton } from "@/components/ui/liquid-glass-button";
import { useSite } from "@/lib/locale";

/**
 * Form recruiter → email via Web3Forms (nessun backend proprio,
 * l'indirizzo resta dietro la chiave, mai nel codice).
 * Config: NEXT_PUBLIC_WEB3FORMS_KEY nel .env.local
 */
export function ContactForm() {
  const site = useSite();
  const f = site.t.contact.form;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!key) {
      setStatus("error");
      return;
    }
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company_website) return; // honeypot
    setStatus("sending");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_key: key, subject: "Portfolio: contact", ...data }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const field =
    "w-full rounded-xl border border-line bg-carddeep px-4 py-3 text-base text-ink placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted";

  if (status === "sent") {
    return (
      <div className="rounded-bento border border-line bg-card p-6 text-center" role="status">
        <p className="text-xl font-bold text-ink">{f.sentTitle}</p>
        <p className="mt-2 text-[15px] text-muted">{f.sentBody}</p>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setStatus("idle")}>
          {f.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-busy={status === "sending"} className="rounded-bento border border-line bg-card p-5 md:p-6">
      {/* honeypot anti-spam */}
      <input type="text" name="company_website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>{f.name}</label>
          <input id="cf-name" name="name" required placeholder={f.namePlaceholder} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>{f.email}</label>
          <input id="cf-email" name="email" required type="email" placeholder={f.emailPlaceholder} autoComplete="email" className={field} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="cf-company" className={label}>{f.company} <span className="normal-case tracking-normal text-faint">{f.companyOptional}</span></label>
        <input id="cf-company" name="company" placeholder={f.companyPlaceholder} autoComplete="organization" className={field} />
      </div>

      <div className="mt-4">
        <label htmlFor="cf-message" className={label}>{f.message}</label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={4}
          placeholder={f.messagePlaceholder}
          className={`${field} min-h-32 resize-y`}
        />
      </div>

      <LiquidButton type="submit" size="lg" className="mt-5 w-full" disabled={status === "sending" || !key}>
        {status === "sending" ? f.sending : f.send}
      </LiquidButton>

      {!key && (
        <p className="mt-3 text-xs text-faint">
          {f.notConfigured}
        </p>
      )}
      {status === "error" && key && (
        <p role="alert" className="mt-3 text-sm text-red-300">{f.error}</p>
      )}
    </form>
  );
}
