# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router + Tailwind CSS + Framer Motion + TypeScript. Deploy su Vercel. Font via `next/font/google` (Inter + JetBrains Mono), immagini via `next/image`. Non sostituire lo stack senza conferma esplicita.

## Users

Visitatori del portfolio (recruiter, clienti freelance, collaboratori hackathon) + il proprietario che aggiorna progetti e contenuti.

## Product Purpose

Portfolio personale dark-bento che dimostra capacità full-stack e converte la visita in contatto / call. Successo = il visitatore capisce in secondi chi sono, cosa so fare e come contattarmi.

## Positioning

Bento notturno denso con hero AI-chat e dossier progetti numerati — non un template minimal generico.

## Operating Context

Pagina singola con ancore: #about, #projects, #skills, #other + pagine secondarie Guestbook / Achievements / Links. Contenuti reali in CONTENT.md.

## Capabilities and Constraints

- Stack fissato sopra; design tokens normativi in DESIGN.md (+ sidecar `.impeccable/design.json`).
- Motion normativa in DESIGN.md ## Motion + sidecar `extensions.motion`.
- Contenuti reali in CONTENT.md — non inventare nomi progetti, bio, link o metriche.

## Brand Commitments

Riferimento visivo: stile bento dark di pszostak.pl, reinterpretato con asset e testi propri. Nessun asset originale copiato.

## Evidence on Hand

- CONTENT.md: testi reali di Francesco Monticone (identità, bio, 5 progetti, esperienza, formazione, skill, filosofia, contatti — placeholder solo per i link GitHub/LinkedIn/Email).
- DESIGN.md: sistema visivo verificato via DevTools il 2026-10-03 (body #0A0A0F, ink #E4E4E7, blu elettrico #00A3FF + azzurro #22D3EE, solo Inter).

## Product Principles

- Prova, non affermare: screenshot e dossier reali sopra le claim.
- Una sola voce satura e un solo movimento per viewport.
- Contenuto proprio in slot collaudati, mai copia di testi altrui.

## Accessibility & Inclusion

Contrasto AA su ink/muted su abyss; `prefers-reduced-motion` disattiva marquee/shimmer/ping e riduce fade-up a fade 200ms; focus-visible blu sempre visibile.
