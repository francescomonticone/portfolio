import { certifications, education, experience, profile, projects, skillGroups, techTags } from "./content";

/**
 * Keyword + intent engine for the portfolio chatbot (English + Italian).
 *
 * It separates two concerns:
 * - Intent: what the user wants (projects, skills, education, contact, ...)
 * - Entities: what they talk about (a technology like Rust, a project like MESOS)
 *
 * Matches are scored (specific phrases weigh more than generic words) and the
 * intent decides how entities are interpreted. All content is derived from
 * lib/content.ts, so there is a single source of truth. Answers stay short:
 * details live behind GitHub buttons and follow-up suggestions.
 */

export type Intent =
  | "projects"
  | "project_details"
  | "skills"
  | "education"
  | "certifications"
  | "experience"
  | "contact"
  | "about"
  | "greeting"
  | "thanks"
  | "bye"
  | "help"
  | "unknown";

export type Lang = "en" | "it";

export interface ChatLink {
  label: string;
  href: string;
}

export interface ChatAnswer {
  text: string;
  links: ChatLink[];
  suggestions: string[];
}

/** Canonical tech name -> aliases (all lowercase). */
const TECH_ALIASES: Record<string, string[]> = {
  "c++": ["cpp", "c plus plus"],
  "c": ["c language"],
  "rust": ["rust lang"],
  "typescript": ["ts", "type script"],
  "javascript": ["js"],
  "react": ["react.js", "reactjs"],
  "next.js": ["nextjs", "next js", "next"],
  "tauri": [],
  "ros 2": ["ros2", "ros", "robotics", "robot", "robotica", "robotico"],
  "python": ["py"],
  "java": [],
  "javafx": ["java fx"],
  "rmi": ["remote method invocation"],
  "sockets": ["socket", "tcp", "tcp/ip", "tcp ip", "networking"],
  "mysql": ["my sql", "sql", "database", "db"],
  "maven": [],
  "vhdl": [],
  "docker": [],
  "linux": [],
  "git": [],
  "swift": ["swiftui"],
  "f1 telemetry": ["f1", "telemetry", "formula 1"],
  "graphs": ["graph", "dijkstra", "heap", "min heap"],
  "slam": ["mapping"],
  "rviz": ["rviz2"],
  "amcl": [],
  "nav2": [],
  "windows": ["desktop app", "desktop"],
  "pdf": ["reports", "report"],
};

const aliasToTech = new Map<string, string>();
for (const [tech, aliases] of Object.entries(TECH_ALIASES)) {
  aliasToTech.set(tech, tech);
  for (const a of aliases) aliasToTech.set(a, tech);
}
// Tech labels from the portfolio strip resolve to themselves.
for (const t of techTags) {
  const key = t.label.toLowerCase();
  if (!aliasToTech.has(key)) aliasToTech.set(key, t.label);
}

/** Whole-word synonym expansion applied before matching. */
const SYNONYMS: Record<string, string> = {
  university: "education",
  studies: "education",
  studied: "education",
  study: "education",
  studying: "education",
  school: "education",
  degree: "education",
  student: "education",
  mail: "email",
  "e-mail": "email",
  curriculum: "experience",
  cv: "experience",
  resume: "experience",
  internship: "experience",
};

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Lowercase, accents folded, space-padded, punctuation stripped (keeps + # . /). */
function normalize(raw: string): string {
  let s = raw
    .toLowerCase()
    .replace(/[àáâä]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9+#./\s]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  for (const [from, to] of Object.entries(SYNONYMS)) {
    s = s.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, "g"), to);
  }
  return ` ${s} `;
}

/** Same normalization for haystacks (project fields), then alias expansion
 *  so both sides speak canonical names. */
function normHay(s: string): string {
  let out = ` ${s
    .toLowerCase()
    .replace(/[àáâä]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9+#./\s]/g, " ")} `;
  const keys = [...aliasToTech.keys()].sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const re = new RegExp(`(?<![a-z0-9+#./])${escapeRegExp(key)}(?![a-z0-9+#./])`, "g");
    out = out.replace(re, ` ${aliasToTech.get(key)} `);
  }
  return ` ${out.replace(/\s+/g, " ").trim()} `;
}

function hasTok(hay: string, tok: string): boolean {
  return hay.includes(` ${tok} `);
}

const IT_MARKERS = [
  "che", "cosa", "come", "dove", "quando", "perche", "quale", "quali", "quanto",
  "dimmi", "parlami", "raccontami", "fammi", "mio", "miei", "mia", "mie",
  "tuo", "tua", "tuoi", "tue", "sei", "hai", "sono", "questo", "questa",
  "grazie", "ciao", "buongiorno", "buonasera", "progetti", "progetto",
  "competenze", "sai", "usi", "usato", "conosci", "studiato", "universita",
  "laurea", "laureato", "lavoro", "esperienza", "tirocinio", "contatti",
  "contattarti", "chi", "presentati",
];

const EN_MARKERS = [
  "what", "where", "when", "how", "which", "tell", "show", "list", "does",
  "your", "you", "thanks", "thank", "hello", "hi", "projects", "skills",
  "about", "describe", "study", "work", "contact", "experience", "education",
  "degree", "reach", "can", "use", "using", "know", "are",
];

/** Italian wins only on majority — ties and tech-only queries stay English. */
function detectLang(text: string): Lang {
  let it = 0;
  let en = 0;
  for (const m of IT_MARKERS) if (hasTok(text, m)) it += 1;
  for (const m of EN_MARKERS) if (hasTok(text, m)) en += 1;
  return it > en ? "it" : "en";
}

/** All tech entities mentioned in the query (canonical names). */
function findTechs(text: string): string[] {
  const found = new Set<string>();
  const keys = [...aliasToTech.keys()].sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (text.includes(` ${key} `)) found.add(aliasToTech.get(key)!);
  }
  return [...found];
}

function queryWords(text: string): Set<string> {
  return new Set(text.trim().split(/\s+/).filter((w) => w.length > 2));
}

interface Haystack {
  title: string;
  stack: string;
  points: string;
  desc: string;
}

function projectHaystack(i: number): Haystack {
  const p = projects[i];
  return {
    title: normHay(p.title),
    stack: normHay(p.stack.join(" ")),
    points: normHay(p.points.join(" ")),
    desc: normHay(`${p.description} ${p.type}`),
  };
}

/** Score every project against the QUERY words/entities (never against itself). */
function scoreProjects(words: Set<string>, techs: string[]): { index: number; score: number }[] {
  const hits: { index: number; score: number }[] = [];
  projects.forEach((_, i) => {
    const h = projectHaystack(i);
    let score = 0;
    for (const w of words) {
      if (hasTok(h.title, w)) score += 4;
      else if (hasTok(h.stack, w) || hasTok(h.points, w)) score += 2;
      else if (hasTok(h.desc, w)) score += 1;
    }
    for (const tech of techs) {
      if (hasTok(h.stack, tech)) score += 3;
      else if (hasTok(h.points, tech)) score += 2;
      else if (hasTok(h.desc, tech) || hasTok(h.title, tech)) score += 1;
    }
    if (score > 0) hits.push({ index: i, score });
  });
  return hits.sort((a, b) => b.score - a.score);
}

/** Extra ways to name a project (lowercase, matched as phrases). */
const PROJECT_ALIASES: Record<string, string[]> = {
  "MESOS Board Game": ["mesos game"],
  "Healthcare Desktop App": ["healthcare app", "health app"],
  "Dynamic Route Optimizer": ["route optimizer", "api project"],
  "ROS 2 Mapping & Navigation": ["mapping project", "navigation project", "scout mini"],
  "PomoGP": ["pomodoro", "pomodoro timer", "f1 timer", "focus timer"],
  "ROS 2 Odometry": ["odometry project", "bunker"],
};

/** Does the query name this project (one of its title words or an alias)? */
function namesProject(text: string, query: Set<string>, i: number): boolean {
  const p = projects[i];
  const tokens = p.title.toLowerCase().split(/[\s&]+/).filter((t) => t.length > 2);
  if (tokens.some((t) => query.has(t))) return true;
  const aliases = PROJECT_ALIASES[p.title] ?? [];
  return aliases.some((a) => text.includes(` ${a} `));
}

interface IntentScore {
  intent: Intent;
  score: number;
}

const INTENT_PATTERNS: { intent: Intent; phrases: [string, number][] }[] = [
  {
    intent: "project_details",
    phrases: [
      ["tell me about", 4], ["what is", 3], ["describe", 3], ["details", 3],
      ["more about", 4], ["that project", 2],
      ["dimmi", 3], ["parlami di", 4], ["raccontami", 3], ["cos e", 3],
      ["dettagli", 3],
    ],
  },
  {
    intent: "projects",
    phrases: [
      ["which projects", 5], ["what projects", 5], ["show me", 3], ["list", 3],
      ["projects", 3], ["project", 2], ["portfolio", 2], ["built", 2], ["work", 1],
      ["che progetti", 5], ["quali progetti", 5], ["mostrami", 3], ["elenca", 3],
      ["progetti", 3], ["progetto", 2],
    ],
  },
  {
    intent: "skills",
    phrases: [
      ["skills", 4], ["what do you know about", 4], ["do you know", 3], ["do you use", 2],
      ["familiar with", 3], ["proficient", 3], ["expert in", 3], ["tech stack", 4],
      ["stack", 3], ["technologies", 3], ["technology", 3],
      ["languages", 3], ["language", 2], ["using", 1],
      ["competenze", 4], ["sai usare", 3], ["conosci", 3], ["linguaggi", 3], ["tecnologie", 3],
    ],
  },
  {
    intent: "education",
    phrases: [
      ["education", 5], ["where did you study", 5], ["where do you study", 4],
      ["university", 4], ["college", 4], ["graduated", 4],
      ["degree", 4], ["study", 3], ["student", 2],
      ["dove hai studiato", 5], ["dove studi", 4], ["universita", 4],
      ["laurea", 4], ["laureato", 4], ["studi", 3],
    ],
  },
  {
    intent: "certifications",
    phrases: [
      ["certifications", 5], ["certification", 4], ["certified", 4], ["toeic", 4],
      ["certificazioni", 5], ["attestati", 3],
    ],
  },
  {
    intent: "experience",
    phrases: [
      ["experience", 5], ["worked", 4], ["worked as", 4], ["internship", 4], ["intern", 4],
      ["job", 3], ["tutor", 3], ["career", 3], ["where have you worked", 5],
      ["esperienza", 5], ["hai lavorato", 4], ["tirocinio", 4], ["carriera", 3],
    ],
  },
  {
    intent: "contact",
    phrases: [
      ["how can i reach you", 5], ["get in touch", 5], ["contact", 4],
      ["email", 4], ["hire", 3], ["linkedin", 4], ["github", 2],
      ["come posso contattarti", 5], ["contatti", 4], ["contattarti", 4],
    ],
  },
  {
    intent: "about",
    phrases: [
      ["about you", 5], ["about yourself", 5], ["who are you", 5], ["yourself", 3],
      ["who made", 4], ["who built", 4], ["who created", 4],
      ["where are you from", 4], ["where do you live", 4], ["location", 3],
      ["introduce yourself", 5],
      ["chi sei", 5], ["presentati", 4], ["di dove sei", 4], ["dove vivi", 4],
    ],
  },
  {
    intent: "thanks",
    phrases: [["thank you", 5], ["thanks", 4], ["thx", 3], ["grazie", 4]],
  },
  {
    intent: "bye",
    phrases: [["goodbye", 4], ["bye", 4], ["see you", 4], ["good night", 3], ["arrivederci", 4]],
  },
];

function scoreIntents(text: string): IntentScore[] {
  if (/^\s*(hi|hello|hey|ciao|yo|good morning|good afternoon|good evening|buongiorno|buonasera)\b/.test(text.trim())) {
    return [{ intent: "greeting", score: 10 }];
  }
  if (text.includes(" help ") || text.includes(" what can you ") || text.includes(" what can i ask ") || text.includes(" aiuto ") || text.includes(" cosa posso chiedere ")) {
    return [{ intent: "help", score: 10 }];
  }
  const scores = INTENT_PATTERNS.map(({ intent, phrases }) => {
    let score = 0;
    for (const [phrase, weight] of phrases) {
      if (text.includes(` ${phrase} `)) score += weight;
    }
    return { intent, score };
  });
  return scores.sort((a, b) => b.score - a.score);
}

/** One line per project — details live behind the GitHub buttons. */
function compactLine(i: number): string {
  const p = projects[i];
  return `${p.title} (${p.stack.slice(0, 3).join(", ")})`;
}

function projectLine(i: number): string {
  const p = projects[i];
  return `${p.title} (${p.stack.slice(0, 3).join(", ")}): ${p.description}`;
}

function projectLinks(i: number): ChatLink[] {
  const p = projects[i];
  return p.repo ? [{ label: `${p.title} on GitHub`, href: p.repo }] : [];
}

function projectsUsing(tech: string): number[] {
  return scoreProjects(new Set(), [tech])
    .filter((h) => h.score >= 3)
    .map((h) => h.index);
}

function isKnownSkill(tech: string): boolean {
  return [...aliasToTech.values()].some((v) => v.toLowerCase() === tech);
}

const SUG = {
  en: {
    def: ["Show me your projects", "What are your skills?", "How can I reach you?"],
    proj: ["Which projects use C++?", "What do you know about Rust?", "How can I reach you?"],
    tech: ["Tell me about MESOS", "What are your skills?", "Where did you study?"],
    study: ["What are your skills?", "Show me your projects", "How can I reach you?"],
  },
  it: {
    def: ["Mostrami i tuoi progetti", "Quali sono le tue competenze?", "Come posso contattarti?"],
    proj: ["Quali progetti usano C++?", "Cosa sai di Rust?", "Come posso contattarti?"],
    tech: ["Dimmi di MESOS", "Quali sono le tue competenze?", "Dove hai studiato?"],
    study: ["Quali sono le tue competenze?", "Mostrami i tuoi progetti", "Come posso contattarti?"],
  },
} as const;

export function answerQuestion(raw: string): ChatAnswer {
  const text = normalize(raw);
  if (!text.trim()) {
    return {
      text: "Ask me anything — try one of the suggestions below.",
      links: [],
      suggestions: [...SUG.en.def],
    };
  }
  const lang: Lang = detectLang(text);
  const it = lang === "it";
  const words = queryWords(text);
  const techs = findTechs(text);
  const hits = scoreProjects(words, techs);
  const [top] = scoreIntents(text);
  const confident = top.score >= 4;

  // 1. Greeting / thanks / bye / help have priority.
  if (top.intent === "greeting") {
    return {
      text: it
        ? `Ciao! Sono ${profile.firstName}. Chiedimi dei miei progetti, competenze, studi o contatti.`
        : `Hi! I'm ${profile.firstName}. Ask me about my projects, skills, education or contact.`,
      links: [],
      suggestions: [...(it ? SUG.it.def : SUG.en.def)],
    };
  }
  if (top.intent === "thanks") {
    return {
      text: it ? "Prego! Altro? Progetti, competenze o contatti." : "You're welcome! Anything else — projects, skills or contact?",
      links: [],
      suggestions: [...(it ? SUG.it.def : SUG.en.def)],
    };
  }
  if (top.intent === "bye") {
    return {
      text: it ? "Ciao e grazie! A presto." : "Goodbye! Feel free to come back with more questions.",
      links: [],
      suggestions: [it ? "Come posso contattarti?" : "How can I reach you?"],
    };
  }
  if (top.intent === "help") {
    return {
      text: it
        ? "Rispondo su progetti (es. MESOS, PomoGP), competenze (es. Rust, Java, ROS 2), studi, esperienza e contatti."
        : "I answer about projects (e.g. MESOS, PomoGP), skills (e.g. Rust, Java, ROS 2), education, experience and contact.",
      links: [],
      suggestions: [...(it ? SUG.it.def : SUG.en.def)],
    };
  }

  // 2. The query names a project -> its details.
  const named = hits.filter((h) => namesProject(text, words, h.index));
  if (named.length > 0 && (!confident || top.intent === "projects" || top.intent === "project_details")) {
    const involves = techs.length
      ? it ? ` Coinvolge: ${techs.join(", ")}.` : ` Involves: ${techs.join(", ")}.`
      : "";
    return {
      text: `${projectLine(named[0].index)}${involves}`,
      links: projectLinks(named[0].index),
      suggestions: [...(it ? SUG.it.proj : SUG.en.proj)],
    };
  }

  // 3. Known technology + skills intent -> confirm + where it is used.
  if (techs.length > 0 && confident && top.intent === "skills") {
    const tech = techs[0];
    const users = projectsUsing(tech);
    const where = users.length
      ? it
        ? ` Usato in: ${users.map((i) => projects[i].title).join(", ")}.`
        : ` Used in: ${users.map((i) => projects[i].title).join(", ")}.`
      : "";
    return {
      text: it ? `Sì, ${tech} è tra le mie competenze.${where}` : `Yes — ${tech} is in my stack.${where}`,
      links: users.slice(0, 2).flatMap(projectLinks),
      suggestions: [
        it ? `Quali progetti usano ${tech}?` : `Which projects use ${tech}?`,
        it ? "Quali sono le tue competenze?" : "What are your skills?",
        it ? "Dimmi di MESOS" : "Tell me about MESOS",
      ],
    };
  }

  // 4. Technology entities -> intersection of all mentioned techs.
  if (techs.length > 0) {
    const matching = projects
      .map((_, i) => i)
      .filter((i) => {
        const h = projectHaystack(i);
        const hay = `${h.title} ${h.stack} ${h.points} ${h.desc}`;
        return techs.every((t) => hasTok(hay, t));
      });
    if (matching.length > 0) {
      const list = matching.map((i) => compactLine(i)).join(" · ");
      return {
        text: techs.length > 1
          ? `${techs.join(" + ")}: ${list}`
          : `${techs[0]}: ${list}`,
        links: matching.flatMap(projectLinks),
        suggestions: [...(it ? SUG.it.tech : SUG.en.tech)],
      };
    }
    if (techs.every(isKnownSkill)) {
      return {
        text: it
          ? `Sì, ${techs.join(", ")} è tra le mie competenze, ma nessun progetto in evidenza lo usa.`
          : `Yes — ${techs.join(", ")} is in my stack, but no featured project highlights it.`,
        links: [],
        suggestions: [...(it ? SUG.it.def : SUG.en.def)],
      };
    }
    return {
      text: it
        ? `Non ho progetti che combinano ${techs.join(" e ")}. Prova con una sola tecnologia.`
        : `I don't have a project combining ${techs.join(" and ")}. Try a single technology.`,
      links: [],
      suggestions: techs
        .map((t) => (it ? `Quali progetti usano ${t}?` : `Which projects use ${t}?`))
        .concat(it ? "Mostrami i tuoi progetti" : "Show me your projects"),
    };
  }

  // 5. Confident intents without entities.
  if (confident) {
    switch (top.intent) {
      case "skills": {
        const all = skillGroups.map((g) => `${g.title}: ${g.items.join(", ")}`).join(" · ");
        return {
          text: all,
          links: [{ label: it ? "Sezione competenze" : "Skills section", href: "#skills" }],
          suggestions: [
            it ? "Cosa sai di Rust?" : "What do you know about Rust?",
            it ? "Quali progetti usano C++?" : "Which projects use C++?",
            it ? "Dove hai studiato?" : "Where did you study?",
          ],
        };
      }
      case "education": {
        const list = education.map((e) => `${e.degree} (${e.period})`).join(" · ");
        return {
          text: it ? `I miei studi al ${profile.university}: ${list}` : `My education at ${profile.university}: ${list}`,
          links: [],
          suggestions: [...(it ? SUG.it.study : SUG.en.study)],
        };
      }
      case "certifications": {
        return {
          text: certifications.join(" · "),
          links: [],
          suggestions: [
            it ? "Dove hai studiato?" : "Where did you study?",
            it ? "Quali sono le tue competenze?" : "What are your skills?",
            it ? "Mostrami i tuoi progetti" : "Show me your projects",
          ],
        };
      }
      case "experience": {
        const list = experience.map((e) => `${e.role} @ ${e.org} (${e.period})`).join(" · ");
        return {
          text: list,
          links: [],
          suggestions: [...(it ? SUG.it.study : SUG.en.study)],
        };
      }
      case "contact": {
        return {
          text: it
            ? "Contattami via GitHub o LinkedIn qui sotto — sono aperto a stage e collaborazioni."
            : "Reach me via GitHub and LinkedIn below — I'm open to internships and collaborations.",
          links: [
            { label: "GitHub", href: "https://github.com/francescomonticone" },
            { label: it ? "Sezione contatti" : "Contact section", href: "#contact" },
          ],
          suggestions: [
            it ? "Dimmi di MESOS" : "Tell me about MESOS",
            it ? "Quali sono le tue competenze?" : "What are your skills?",
            it ? "Dove hai studiato?" : "Where did you study?",
          ],
        };
      }
      case "about": {
        return {
          text: it
            ? `Sono ${profile.name}, ${profile.role} al ${profile.university}. Vivo in Italia.`
            : `I'm ${profile.name}, ${profile.role} @ ${profile.university}, based in ${profile.location}.`,
          links: [],
          suggestions: [...(it ? SUG.it.def : SUG.en.def)],
        };
      }
      case "projects": {
        const list = projects.map((p) => p.title).join(", ");
        return {
          text: it ? `I miei progetti: ${list}.` : `My featured projects: ${list}.`,
          links: projects.filter((p) => p.repo).map((p) => ({ label: p.title, href: p.repo! })),
          suggestions: [
            it ? "Dimmi di MESOS" : "Tell me about MESOS",
            it ? "Quali progetti usano C++?" : "Which projects use C++?",
            it ? "Cosa sai di Rust?" : "What do you know about Rust?",
          ],
        };
      }
      default:
        break;
    }
  }

  // 6. Controlled fallback: never invent, always redirect.
  return {
    text: it
      ? "Non ho abbastanza dati per rispondere. Posso parlarti di progetti, competenze, studi, esperienza o contatti."
      : "I don't have enough data to answer that. I can tell you about my projects, skills, education, experience or contact.",
    links: [],
    suggestions: [...(it ? SUG.it.def : SUG.en.def)],
  };
}

function defaultSuggestions(): string[] {
  return ["Show me your projects", "What are your skills?", "How can I reach you?"];
}
