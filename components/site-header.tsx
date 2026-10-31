"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLocale, useSite } from "@/lib/locale";

export function SiteHeader() {
  const { locale, setLocale } = useLocale();
  const site = useSite();
  const [active, setActive] = useState("#top");
  const menu = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const header = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const it = locale === "it";

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id === "intro" ? "#top" : `#${entry.target.id}`);
    }, { rootMargin: "-15% 0px -65% 0px" });
    document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) { menu.current.open = false; summary.current?.focus(); }
    };
    const onPointer = (event: PointerEvent) => {
      if (menu.current?.open && !header.current?.contains(event.target as Node)) menu.current.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { observer.disconnect(); document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, []);

  return (
    <header ref={header} className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4">
      <a href="#main-content" className="skip-link">{it ? "Salta al contenuto" : "Skip to content"}</a>
      <div className="relative w-full max-w-3xl">
        <nav aria-label={it ? "Navigazione principale" : "Main navigation"} className="relative flex min-h-16 items-center justify-between gap-2 rounded-full border border-white/10 bg-[#181a21]/85 px-3 shadow-[0_8px_32px_rgba(0,0,0,.25)] backdrop-blur-xl">
          <a href="#top" onClick={() => setActive("#top")} className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-[#07121c]" aria-label="Home">F<span className="sr-only">rancesco Monticone</span></a>
          <div className="hidden items-center gap-0.5 lg:flex">
            {site.navLinks.map(link => <a key={link.href} href={link.href} aria-current={active === link.href ? "location" : undefined} className={`nav-link ${active === link.href ? "bg-white/[.07] text-ink" : "text-muted"}`}>{link.label}</a>)}
          </div>
          <a href="#projects" className="nav-link mr-auto text-ink lg:hidden">{site.navLinks.find(link => link.href === "#projects")?.label}</a>
          <a href="#contact" className="hidden min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 text-[13px] font-semibold text-[#07121c] sm:inline-flex">{site.t.contact.navCta}<ArrowUpRight aria-hidden className="size-3.5" /></a>
          <div role="group" aria-label={it ? "Lingua" : "Language"} className="flex shrink-0 items-center rounded-full border border-white/10 bg-black/15 p-0.5">
            {(["it", "en"] as const).map(option => <button key={option} type="button" onClick={() => setLocale(option)} aria-pressed={locale === option} aria-label={option === "it" ? "Italiano" : "English"} className={`min-h-10 min-w-10 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors ${locale === option ? "bg-primary text-[#07121c]" : "text-muted hover:text-ink"}`}>{option}</button>)}
          </div>
          <details ref={menu} className="mobile-menu lg:hidden">
            <summary ref={node => { summary.current = node; }} aria-label={it ? "Menu di navigazione" : "Navigation menu"} className="icon-button list-none cursor-pointer"><Menu aria-hidden className="menu-open size-5" /><X aria-hidden className="menu-close size-5" /></summary>
            <div className="absolute inset-x-0 top-[calc(100%+10px)] rounded-2xl border border-white/10 bg-[#141720] p-2 shadow-[0_16px_48px_rgba(0,0,0,.4)] backdrop-blur-xl">
              {[...site.navLinks, {label:site.t.contact.navCta, href:"#contact"}].map(link => <a key={link.href} href={link.href} onClick={() => { if (menu.current) menu.current.open = false; setActive(link.href); }} aria-current={active === link.href ? "location" : undefined} className="flex min-h-12 items-center justify-between rounded-xl px-4 text-sm text-ink hover:bg-white/[.06]">{link.label}<ArrowUpRight aria-hidden className="size-4 text-primary" /></a>)}
            </div>
          </details>
        </nav>
        <div aria-hidden className="pointer-events-none absolute inset-x-8 bottom-0 h-px overflow-hidden"><motion.div style={{scaleX:scrollYProgress, transformOrigin:"left"}} className="h-full bg-[#7dd3fc]" /></div>
      </div>
    </header>
  );
}
