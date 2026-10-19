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
        body: JSON.stringify({ access_key: key, subject: "Portfolio: contact", ...data }),
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
        <p className="text-xl font-bold text-ink">{f.sentTitle}</p>
        <p className="mt-2 text-[15px] text-muted">{f.sentBody}</p>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setStatus("idle")}>
          {f.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-bento border border-line bg-card p-5 md:p-6">
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
          className={`${field} resize-none`}
        />
      </div>

      <LiquidButton type="submit" size="lg" className="mt-5 w-full" disabled={status === "sending"}>
        {status === "sending" ? f.sending : f.send}
      </LiquidButton>

      {!key && (
        <p className="mt-3 text-xs text-faint">
          {f.notConfigured}
        </p>
      )}
      {status === "error" && key && (
        <p className="mt-3 text-sm text-red-400">Couldn&apos;t send — check your connection and try again, or use GitHub/LinkedIn above.</p>
      )}
    </form>
  );
}
