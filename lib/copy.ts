import {
  certifications,
  minorProjects,
  nowBuilding,
  personalTrack,
  profile,
  projects,
  semesterCourses,
  skillGroups,
  timeline,
  type Certification,
  type MinorProject,
  type PersonalTrackIcon,
  type Project,
  type TimelineEntry,
} from "./content";

export type Locale = "en" | "it";

export type UiCopy = {
  nav: { label: string; href: string }[];
  hero: {
    greeting: string;
    askAria: string;
    role: string;
    tagline: string;
    description: string;
    scroll: string;
    askPlaceholder: string;
    ask: string;
    chips: string[];
  };
  about: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    portraitPill: string;
    focusLabel: string;
    focusText: string;
    focusAreas: { label: string; key: "brain" | "shield" | "cpu" }[];
    bscLabel: string;
    recognitionLabel: string;
    honours: (n: number) => string;
    recognition: string[];
    nowLearning: string;
    academic: string;
    personalTrack: string;
    mapLabel: string;
    sticker: { degree: string; scratch: string; reveal: string; revealed: string };
  };
  featured: {
    titleA: string;
    titleB: string;
    intro: (n: number) => string;
    privateBadge: string;
    github: string;
  };
  dro: {
    cta: string;
    preview: string;
    title: string;
    subtitle: string;
    problemTab: string;
    solutionTab: string;
    problemEyebrow: string;
    problemTitle: string;
    problemIntro: string;
    problemPoints: string[];
    solutionEyebrow: string;
    solutionTitle: string;
    solutionIntro: string;
    steps: { title: string; text: string; tag: string }[];
    result: string;
    close: string;
    gridLabel: string;
    exitCost: string;
    blocked: string;
    airRoute: string;
    query: string;
    cacheHit: string;
    cacheMiss: string;
  };
  minor: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    linkedin: string;
  };
  now: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    inProgress: string;
    landmarks: string;
    projectPage: string;
    floodRescue: string;
  };
  skills: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    desc: string;
    orbits: { languages: string; frameworks: string; platforms: string };
    allLevels: string;
    close: string;
    loading: string;
  };
  path: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    desc: string;
    certificationsLabel: string;
    certificationsTitle: string;
    credentials: (n: number) => string;
    experienceLabel: string;
    educationLabel: string;
    experienceCount: (n: number) => string;
    educationCount: (n: number) => string;
    current: string;
    languagesLabel: string;
    languagesValue: string;
    toeic: string;
  };
  contact: {
    title: string;
    navCta: string;
    form: {
      name: string;
      email: string;
      company: string;
      companyOptional: string;
      message: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      companyPlaceholder: string;
      messagePlaceholder: string;
      send: string;
      sending: string;
      sentTitle: string;
      sentBody: string;
      sendAnother: string;
      error: string;
      notConfigured: string;
    };
  };
  chat: { tryNext: string };
  footer: string;
};

export const ui: Record<Locale, UiCopy> = {
  en: {
    nav: [
      { label: "Home", href: "#top" },
      { label: "About", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Skills", href: "#skills" },
      { label: "Other", href: "#other" },
    ],
    hero: {
      greeting: "Hi, I'm",
      askAria: "Ask about Francesco",
      role: "MSc Computer Science & Engineering Student",
      tagline: profile.tagline,
      description:
        "MSc student at Politecnico di Milano, into AI, cybersecurity and systems that work beneath the abstractions.",
      scroll: "Scroll to explore",
      askPlaceholder: "Ask anything about {name}...",
      ask: "Ask",
      chips: ["Work", "About me", "Skills", "Contact"],
    },
    about: {
      eyebrow: "About",
      titleA: "Curious, precise,",
      titleB: "learn-by-building.",
      portraitPill: "MSc @ Politecnico di Milano",
      focusLabel: "Focus",
      focusText: "AI systems, secure software, and how machines really work underneath.",
      focusAreas: [
        { label: "AI systems", key: "brain" },
        { label: "Secure software", key: "shield" },
        { label: "Low-level systems", key: "cpu" },
      ],
      bscLabel: "BSc grade",
      recognitionLabel: "Recognition",
      honours: (n) => `${n} honours`,
      recognition: [
        "TOEIC Listening & Reading — 965/990",
        "Politecnico di Milano Git Certification",
        "PoliMi Merit-Based Scholarship",
        "Il Grifone d'Acciaio Scholarship",
      ],
      nowLearning: "Now learning",
      academic: "Academic · 6 courses",
      personalTrack: "Personal track",
      mapLabel: "Politecnico di Milano",
      sticker: { degree: "BSc · 2026", scratch: "Scratch or reveal", reveal: "Reveal grade", revealed: "Grade revealed" },
    },
    featured: {
      titleA: "Featured",
      titleB: "Projects",
      intro: (n) => `${n} dossiers, one scroll. Academic code stays private until term end.`,
      privateBadge: "code private · academic term",
      github: "GitHub",
    },
    dro: {
      cta: "How I solved it",
      preview: "Case study",
      title: "MovHex",
      subtitle: "Dynamic Route Optimizer",
      problemTab: "The problem",
      solutionTab: "The solution",
      problemEyebrow: "Hex grid · weighted graph",
      problemTitle: "A shortest path that keeps changing",
      problemIntro:
        "MovHex models a rectangular map of hexagonal tiles. Every tile has an exit cost, can become impossible to leave, and can gain or lose directed air routes while queries keep arriving.",
      problemPoints: [
        "Odd-row offset: up to six neighbours, fewer on the border. Coordinates are column-first, from the bottom-left.",
        "Exit costs range from 0 to 100. Zero means the tile can be visited but not left.",
        "change_cost applies a distance-weighted delta inside a radius; toggle_air_route adds or removes a directed link.",
        "travel_cost is the hot path: thousands of queries, concentrated in the same areas, with very few updates.",
      ],
      solutionEyebrow: "Implementation · C",
      solutionTitle: "Contiguous memory, then reuse",
      solutionIntro:
        "The implementation is shaped around the workload, not just the algorithm: almost all reads, very few writes.",
      steps: [
        { title: "Flat node array", text: "One contiguous allocation, O(1) indexing and cache-friendly traversal.", tag: "map" },
        { title: "Precomputed neighbours", text: "Hex adjacency depends on row parity; compute it once at init, never during a visit.", tag: "graph" },
        { title: "Dijkstra + custom heap", text: "Binary min-heap with decrease-key and a position vector, so a node is never duplicated.", tag: "search" },
        { title: "Hash cache", text: "(source, destination) → cost with separate chaining. O(1) on repeated queries; cleared on every update.", tag: "reuse" },
      ],
      result: "30 e Lode · Algorithms and Data Structures · Politecnico di Milano, 2024/2025",
      close: "Close case study",
      gridLabel: "5 × 4 hex map",
      exitCost: "exit cost",
      blocked: "blocked",
      airRoute: "air route",
      query: "query",
      cacheHit: "cache hit",
      cacheMiss: "cache miss",
    },
    minor: {
      eyebrow: "Side quests",
      titleA: "Minor",
      titleB: "projects",
      linkedin: "LinkedIn post",
    },
    now: {
      eyebrow: "Work in progress",
      titleA: "Now",
      titleB: "building",
      inProgress: "In progress",
      landmarks: "Hand landmarks",
      projectPage: "Project page",
      floodRescue: "Flood rescue",
    },
    skills: {
      eyebrow: "Tech Stack",
      titleA: "My",
      titleB: "Skills",
      desc: "Studied, explored or used in projects.",
      orbits: { languages: "Languages", frameworks: "Frameworks", platforms: "Platforms" },
      allLevels: "All levels",
      close: "Close",
      loading: "Loading 3D…",
    },
    path: {
      eyebrow: "Path",
      titleA: "Experience",
      titleB: "& path",
      desc: "The road so far — from scientific high school to a master's in computer science.",
      certificationsLabel: "Certifications",
      certificationsTitle: "Paper trail",
      credentials: (n) => `${n} credentials`,
      experienceLabel: "Experience",
      educationLabel: "Education",
      experienceCount: (n) => `${n} roles`,
      educationCount: (n) => `${n} milestones`,
      current: "Current",
      languagesLabel: "Languages",
      languagesValue: "Italian native · English C1",
      toeic: "TOEIC 965/990",
    },
    contact: {
      title: "Contact me",
      navCta: "Contact",
      form: {
        name: "Name",
        email: "Work email",
        company: "Company",
        companyOptional: "(optional)",
        message: "Message",
        namePlaceholder: "Jane Smith",
        emailPlaceholder: "jane@company.com",
        companyPlaceholder: "Company Inc.",
        messagePlaceholder: "Tell me about the role, the timing or the idea…",
        send: "Send message",
        sending: "Sending…",
        sentTitle: "Message sent ✓",
        sentBody: "Thanks for reaching out — I'll get back to you soon.",
        sendAnother: "Send another",
        error: "Couldn't send — check your connection and try again, or use GitHub/LinkedIn above.",
        notConfigured: "Form endpoint not configured yet (NEXT_PUBLIC_WEB3FORMS_KEY).",
      },
    },
    chat: { tryNext: "Try next:" },
    footer: "FM · © 2026 Francesco Monticone · Italy",
  },
  it: {
    nav: [
      { label: "Home", href: "#top" },
      { label: "Chi sono", href: "#about" },
      { label: "Progetti", href: "#projects" },
      { label: "Competenze", href: "#skills" },
      { label: "Altro", href: "#other" },
    ],
    hero: {
      greeting: "Ciao, sono",
      askAria: "Chiedi di Francesco",
      role: "Studente magistrale in Computer Science & Engineering",
      tagline: "Capire come funzionano i sistemi complessi — e costruire software pratico sopra.",
      description:
        "Studente magistrale al Politecnico di Milano, appassionato di AI, cybersecurity e sistemi che funzionano sotto le astrazioni.",
      scroll: "Scorri per esplorare",
      askPlaceholder: "Chiedimi qualcosa su {name}...",
      ask: "Chiedi",
      chips: ["Lavoro", "Chi sono", "Competenze", "Contatti"],
    },
    about: {
      eyebrow: "Chi sono",
      titleA: "Curioso, preciso,",
      titleB: "imparo costruendo.",
      portraitPill: "Magistrale @ Politecnico di Milano",
      focusLabel: "Focus",
      focusText: "Sistemi di AI, software sicuro e come funzionano davvero le macchine sotto il cofano.",
      focusAreas: [
        { label: "Sistemi di AI", key: "brain" },
        { label: "Software sicuro", key: "shield" },
        { label: "Sistemi low-level", key: "cpu" },
      ],
      bscLabel: "Voto BSc",
      recognitionLabel: "Riconoscimenti",
      honours: (n) => `${n} riconoscimenti`,
      recognition: [
        "TOEIC Listening & Reading — 965/990",
        "Certificazione Git del Politecnico di Milano",
        "Borsa di merito PoliMi",
        "Borsa Il Grifone d'Acciaio",
      ],
      nowLearning: "In apprendimento",
      academic: "Accademico · 6 corsi",
      personalTrack: "Track personale",
      mapLabel: "Politecnico di Milano",
      sticker: { degree: "Laurea · 2026", scratch: "Gratta o rivela", reveal: "Rivela il voto", revealed: "Voto rivelato" },
    },
    featured: {
      titleA: "Progetti",
      titleB: "in evidenza",
      intro: (n) => `${n} dossier, uno scroll. Il codice accademico resta privato fino alla fine del semestre.`,
      privateBadge: "codice privato · sessione accademica",
      github: "GitHub",
    },
    dro: {
      cta: "Come l'ho risolto",
      preview: "Case study",
      title: "MovHex",
      subtitle: "Dynamic Route Optimizer",
      problemTab: "Il problema",
      solutionTab: "La soluzione",
      problemEyebrow: "Griglia esagonale · grafo pesato",
      problemTitle: "Un percorso minimo che continua a cambiare",
      problemIntro:
        "MovHex modella una mappa rettangolare di esagoni. Ogni cella ha un costo di uscita, può diventare impossibile da lasciare e può guadagnare o perdere rotte aeree dirette mentre le query continuano ad arrivare.",
      problemPoints: [
        "Offset sulle righe dispari: fino a sei vicini, meno sui bordi. Le coordinate sono colonna-riga, dal basso a sinistra.",
        "I costi di uscita vanno da 0 a 100. Zero significa che la cella si può visitare ma non lasciare.",
        "change_cost applica un delta pesato sulla distanza entro un raggio; toggle_air_route aggiunge o rimuove un collegamento diretto.",
        "travel_cost è il comando caldo: migliaia di query concentrate nelle stesse zone, con pochissimi aggiornamenti.",
      ],
      solutionEyebrow: "Implementazione · C",
      solutionTitle: "Memoria contigua, poi riuso",
      solutionIntro:
        "L'implementazione è costruita sul carico di lavoro, non solo sull'algoritmo: quasi solo letture, pochissime scritture.",
      steps: [
        { title: "Array piatto di nodi", text: "Un'unica allocazione contigua, indicizzazione O(1) e visita cache-friendly.", tag: "mappa" },
        { title: "Vicini precalcolati", text: "L'adiacenza esagonale dipende dalla parità della riga: calcolata una volta all'init.", tag: "grafo" },
        { title: "Dijkstra + heap custom", text: "Min-heap binario con decrease-key e vettore delle posizioni, senza nodi duplicati.", tag: "ricerca" },
        { title: "Cache hash", text: "(sorgente, destinazione) → costo con separate chaining. O(1) sulle query ripetute; svuotata a ogni update.", tag: "riuso" },
      ],
      result: "30 e Lode · Algoritmi e Strutture Dati · Politecnico di Milano, 2024/2025",
      close: "Chiudi case study",
      gridLabel: "Mappa 5 × 4",
      exitCost: "costo uscita",
      blocked: "bloccata",
      airRoute: "rotta aerea",
      query: "query",
      cacheHit: "cache hit",
      cacheMiss: "cache miss",
    },
    minor: {
      eyebrow: "Progetti extra",
      titleA: "Progetti",
      titleB: "minori",
      linkedin: "Post LinkedIn",
    },
    now: {
      eyebrow: "In lavorazione",
      titleA: "Sto",
      titleB: "costruendo",
      inProgress: "In corso",
      landmarks: "Landmark della mano",
      projectPage: "Pagina progetto",
      floodRescue: "Soccorso alluvioni",
    },
    skills: {
      eyebrow: "Stack tecnico",
      titleA: "Le mie",
      titleB: "Competenze",
      desc: "Studiate, esplorate o usate nei progetti.",
      orbits: { languages: "Linguaggi", frameworks: "Framework", platforms: "Piattaforme" },
      allLevels: "Tutti i livelli",
      close: "Chiudi",
      loading: "Caricamento 3D…",
    },
    path: {
      eyebrow: "Percorso",
      titleA: "Esperienza",
      titleB: "& percorso",
      desc: "La strada fin qui — dal liceo scientifico a una magistrale in computer science.",
      certificationsLabel: "Certificazioni",
      certificationsTitle: "Credenziali",
      credentials: (n) => `${n} credenziali`,
      experienceLabel: "Esperienza",
      educationLabel: "Formazione",
      experienceCount: (n) => `${n} ruoli`,
      educationCount: (n) => `${n} tappe`,
      current: "In corso",
      languagesLabel: "Lingue",
      languagesValue: "Italiano madrelingua · Inglese C1",
      toeic: "TOEIC 965/990",
    },
    contact: {
      title: "Contattami",
      navCta: "Contatti",
      form: {
        name: "Nome",
        email: "Email di lavoro",
        company: "Azienda",
        companyOptional: "(opzionale)",
        message: "Messaggio",
        namePlaceholder: "Mario Rossi",
        emailPlaceholder: "mario@azienda.com",
        companyPlaceholder: "Azienda S.p.A.",
        messagePlaceholder: "Raccontami del ruolo, dei tempi o dell'idea…",
        send: "Invia messaggio",
        sending: "Invio…",
        sentTitle: "Messaggio inviato ✓",
        sentBody: "Grazie per avermi scritto — ti rispondo presto.",
        sendAnother: "Invia un altro",
        error: "Invio non riuscito — controlla la connessione e riprova, oppure usa GitHub/LinkedIn qui sopra.",
        notConfigured: "Endpoint del form non ancora configurato (NEXT_PUBLIC_WEB3FORMS_KEY).",
      },
    },
    chat: { tryNext: "Prova con:" },
    footer: "FM · © 2026 Francesco Monticone · Italia",
  },
};

/* ---------------- contenuti localizzati ---------------- */

const projectIt: Record<string, Pick<Project, "type" | "description" | "points">> = {
  "01": {
    type: "Progetto accademico",
    description:
      "Implementazione software di un gioco da tavolo con design object-oriented, testing e sviluppo collaborativo.",
    points: ["Design OOP", "Testing", "Lavoro di squadra"],
  },
  "02": {
    type: "Progetto reale",
    description:
      "App desktop Windows offline-first per professionisti sanitari: valutazioni dei pazienti, parametri nel tempo, report PDF ed export Excel, con aggiornamenti automatici via GitHub Actions.",
    points: ["Offline-first", "Auto-update via GitHub Actions", "Export PDF + Excel"],
  },
  "03": {
    type: "Progetto accademico",
    description:
      "Ottimizzatore dinamico di percorsi su griglia esagonale con grafi pesati e Dijkstra, coda di priorità Min Heap e caching tramite Hash Table per query ripetute.",
    points: ["Griglia esagonale", "Min Heap", "Cache delle query"],
  },
  "04": {
    type: "Progetto accademico",
    description:
      "Pipeline completa di mappatura 2D e navigazione autonoma: mappe occupancy da bag file, AMCL, costmap, controller DWB e un nodo C++ custom per pubblicare goal NavigateToPose in Stage + RViz2.",
    points: ["Mappe SLAM", "Stack Nav2", "Nodo C++ custom"],
  },
  "05": {
    type: "Progetto personale",
    description:
      "Timer Pomodoro a tema Formula 1 con telemetria live, circuiti reali e team radio — pensato per la massima concentrazione.",
    points: ["Timer di focus", "Circuiti reali", "Team radio"],
  },
  "06": {
    type: "Progetto accademico",
    description:
      "Sistema di odometria per un robot mobile skid-steering: calibrazione sperimentale delle ruote rispetto ai dati TF di ground truth e metriche di errore sulla traiettoria.",
    points: ["Calibrazione ruote", "Analisi TF", "Metriche di errore"],
  },
};

const minorIt: Record<string, Pick<MinorProject, "description">> = {
  "PoliMi T2A Study Plan": {
    description:
      "Planner interattivo per il piano di studi del Master in CSE: combinazioni di corsi e verifica dei vincoli. Progetto indipendente — non un'applicazione ufficiale del Politecnico di Milano.",
  },
  "Hardware Task-List Module": {
    description:
      "Modulo VHDL che gestisce una lista ordinata di task in RAM esterna — FSM per inserimento, rimozione, priorità e reset, verificato in Vivado.",
  },
};

const nowIt: Record<string, Partial<Pick<Project, "type" | "description" | "org" | "role">>> = {
  AirDocs: {
    type: "In lavorazione",
    description:
      "Interazione hands-free su macOS tramite hand tracking: landmark con Vision + AVFoundation, controllo del cursore con pinch, smoothing e dead zone.",
  },
  "F.R.A.N.C.O.": {
    type: "In lavorazione",
    description:
      "Robot autonomo di soccorso per alluvioni di PoliMi Data Scientists, progettato per portare beni di prima necessità nelle zone allagate. Lavoro nei team Firmware ed Electronics: migrazione a ROS 2, integrazione sensori, cablaggio, alimentazione e test sul campo.",
    org: "PoliMi Data Scientists",
    role: "Team Firmware & Electronics",
  },
};

const coursesIt: typeof semesterCourses = [
  {
    name: "Sistemi Operativi Avanzati",
    icon: "cpu",
    tags: ["Scheduling real-time", "Concorrenza & IPC", "Driver di dispositivo"],
  },
  {
    name: "Fondamenti di Intelligenza Artificiale",
    icon: "brain",
    tags: ["Ricerca & A*", "Giochi", "CSP", "Logica & planning"],
  },
  {
    name: "Ingegneria del Software 2",
    icon: "boxes",
    tags: ["RASD & UML", "Modellazione Alloy", "V&V & testing"],
  },
  {
    name: "Basi di Dati 2",
    icon: "database",
    tags: ["NoSQL", "DB distribuiti", "Ottimizzazione query"],
  },
  {
    name: "Linguaggi Formali e Compilatori",
    icon: "braces",
    tags: ["Automi", "Grammatiche", "Parsing"],
  },
  {
    name: "Fondamenti di Ricerca Operativa",
    icon: "sigma",
    tags: ["Programmazione lineare", "Simplesso", "Ottimizzazione"],
  },
];

const personalTrackIt: { label: string; icon: PersonalTrackIcon }[] = [
  { label: "LLM & sistemi di AI", icon: "sparkles" },
  { label: "Sicurezza AI", icon: "shield" },
  { label: "CUDA & calcolo parallelo", icon: "gpu" },
];

const timelineIt: TimelineEntry[] = [
  {
    kind: "work",
    title: "Team Firmware & Electronics",
    org: "PoliMi Data Scientists · F.R.A.N.C.O.",
    period: "2026 — oggi",
    text: "Costruzione dello stack ROS 2 e sensori per un robot autonomo di soccorso: migrazione Arduino → ROS 2, integrazione sensori, cablaggio, alimentazione e impermeabilizzazione, test con il team AI.",
    meta: "In corso",
    logo: "/logos/pmds.png",
  },
  {
    kind: "work",
    title: "Tutor di ingegneria",
    org: "Politecnico di Milano",
    period: "2023 — 2026",
    text: "Tutoraggio di Analisi I, Fisica ed Elettrotecnica — supporto individuale e di gruppo, preparazione agli esami.",
    logo: "/logos/polimi.svg",
  },
  {
    kind: "work",
    title: "Tirocinante",
    org: "Confartigianato Palazzolo",
    period: "2022",
    text: "Gestione dati aziendali con Microsoft Excel — manutenzione e aggiornamento di fogli di calcolo aziendali.",
    logo: "/logos/confartigianato.png",
  },
  {
    kind: "education",
    title: "MSc Computer Science & Engineering",
    org: "Politecnico di Milano",
    period: "2026 — oggi",
    text: "Sistemi, AI e sicurezza — sulle fondamenta dell'ingegneria informatica.",
    meta: "In corso",
    logo: "/logos/polimi.svg",
  },
  {
    kind: "education",
    title: "BSc Computer Engineering",
    org: "Politecnico di Milano",
    period: "Laureato 2026",
    text: "Fondamenti di ingegneria informatica: hardware, software, reti e matematica applicata.",
    meta: "109/110",
    logo: "/logos/polimi.svg",
  },
  {
    kind: "education",
    title: "Diploma scientifico",
    org: "Liceo Scientifico Madonna della Neve",
    period: "Brescia",
    text: "Liceo scientifico — matematica, fisica e scienze naturali.",
    logo: "/logos/mdn.png",
  },
];

const certificationsIt: Certification[] = [
  { title: "TOEIC Listening & Reading", detail: "965/990" },
  { title: "Certificazione Git", detail: "PoliMi" },
  { title: "ECDL Base" },
  { title: "Il Grifone d'Acciaio", detail: "Borsa di studio" },
  { title: "Borsa di merito PoliMi", detail: "Borsa di studio" },
];

const skillGroupsIt: typeof skillGroups = [
  { title: "Linguaggi", items: skillGroups[0].items },
  { title: "Framework", items: skillGroups[1].items },
  { title: "Piattaforme", items: skillGroups[2].items },
];

export function getSite(locale: Locale) {
  const t = ui[locale];
  const it = locale === "it";

  return {
    locale,
    t,
    profile: {
      ...profile,
      role: t.hero.role,
      tagline: t.hero.tagline,
      location: it ? "Italia" : profile.location,
    },
    navLinks: t.nav,
    promptChips: t.hero.chips,
    projects: projects.map((p) => (it ? { ...p, ...projectIt[p.id] } : p)),
    minorProjects: minorProjects.map((p) => (it ? { ...p, ...minorIt[p.title] } : p)),
    nowBuilding: nowBuilding.map((p) => (it ? { ...p, ...nowIt[p.title] } : p)),
    semesterCourses: it ? coursesIt : semesterCourses,
    personalTrack: it ? personalTrackIt : personalTrack,
    timeline: it ? timelineIt : timeline,
    certifications: it ? certificationsIt : certifications,
    skillGroups: it ? skillGroupsIt : skillGroups,
  };
}

export type SiteContent = ReturnType<typeof getSite>;
