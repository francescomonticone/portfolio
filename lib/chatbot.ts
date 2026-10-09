import { education, experience, profile, projects, skillGroups, techTags } from "./content";

/**
 * Keyword + intent engine for the portfolio chatbot.
 *
 * It separates two concerns:
 * - Intent: what the user wants (projects, skills, education, contact, ...)
 * - Entities: what they talk about (a technology like Rust, a project like MESOS)
 *
 * Matches are scored (specific phrases weigh more than generic words) and the
 * intent decides how entities are interpreted. All content is derived from
 * lib/content.ts, so there is a single source of truth.
 */

export type Intent =
  | "projects"
  | "project_details"
  | "skills"
  | "education"
  | "experience"
  | "contact"
  | "about"
  | "greeting"
  | "help"
  | "unknown";

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
  "ros 2": ["ros2", "ros", "robotics", "robot"],
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
  "graphs": ["graph", "dijkstra"],
  "slam": [],
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

/** Lowercase, space-padded, punctuation stripped (keeps + # . / inside words). */
function normalize(raw: string): string {
  let s = raw.toLowerCase().replace(/[^a-z0-9+#./\s]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  for (const [from, to] of Object.entries(SYNONYMS)) {
    s = s.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, "g"), to);
  }
  return ` ${s} `;
}

/** Same normalization for haystacks (project fields): commas etc. become spaces. */
function normHay(s: string): string {
  return ` ${s.toLowerCase().replace(/[^a-z0-9+#./\s]/g, " ").replace(/\s+/g, " ").trim()} `;
}

function hasTok(hay: string, tok: string): boolean {
  return hay.includes(` ${tok} `);
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

/** Does the query name this project (one of its title words)? */
function namesProject(query: Set<string>, i: number): boolean {
  const tokens = projects[i].title.toLowerCase().split(/[\s&]+/).filter((t) => t.length > 2);
  return tokens.some((t) => query.has(t));
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
    ],
  },
  {
    intent: "projects",
    phrases: [
      ["which projects", 5], ["what projects", 5], ["show me", 3], ["list", 3],
      ["projects", 3], ["project", 2], ["portfolio", 2], ["built", 2], ["work", 1],
    ],
  },
  {
    intent: "skills",
    phrases: [
      ["skills", 4], ["what do you know about", 4], ["do you know", 3],
      ["familiar with", 3], ["stack", 3], ["technologies", 3], ["technology", 3],
      ["languages", 3], ["language", 2], ["using", 1],
    ],
  },
  {
    intent: "education",
    phrases: [
      ["education", 5], ["where did you study", 5], ["university", 4],
      ["degree", 4], ["study", 3], ["student", 2],
    ],
  },
  {
    intent: "experience",
    phrases: [
      ["experience", 5], ["worked", 4], ["internship", 4], ["intern", 4],
      ["job", 3], ["tutor", 3], ["where have you worked", 5],
    ],
  },
  {
    intent: "contact",
    phrases: [
      ["how can i reach you", 5], ["get in touch", 5], ["contact", 4],
      ["email", 4], ["hire", 3], ["linkedin", 4], ["github", 2],
    ],
  },
  {
    intent: "about",
    phrases: [
      ["about you", 5], ["about yourself", 5], ["who are you", 5], ["yourself", 3],
    ],
  },
];

function scoreIntents(text: string): IntentScore[] {
  if (/^\s*(hi|hello|hey|ciao|yo)\b/.test(text.trim())) {
    return [{ intent: "greeting", score: 10 }];
  }
  if (text.includes(" help ") || text.includes(" what can you ")) {
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

export function answerQuestion(raw: string): ChatAnswer {
  const text = normalize(raw);
  if (!text.trim()) {
    return { text: "Ask me anything — try one of the suggestions below.", links: [], suggestions: defaultSuggestions() };
  }
  const words = queryWords(text);
  const techs = findTechs(text);
  const hits = scoreProjects(words, techs);
  const [top] = scoreIntents(text);
  const confident = top.score >= 4;

  // 1. Greeting / help have priority.
  if (top.intent === "greeting") {
    return {
      text: `Hi! I'm ${profile.firstName} — ${profile.tagline} Ask me about my projects, skills, education or how to contact me.`,
      links: [],
      suggestions: ["Show me your projects", "What do you know about Rust?", "Where did you study?"],
    };
  }
  if (top.intent === "help") {
    return {
      text: "I can answer questions about my projects (e.g. MESOS, PomoGP), my skills (e.g. Rust, Java, ROS 2), my education, my experience and how to contact me.",
      links: [],
      suggestions: defaultSuggestions(),
    };
  }

  // 2. The query names a project -> its details.
  const named = hits.filter((h) => namesProject(words, h.index));
  if (named.length > 0 && (!confident || top.intent === "projects" || top.intent === "project_details")) {
    const techList = techs.length ? ` It involves ${techs.join(", ")}.` : "";
    return {
      text: `${projectLine(named[0].index)}${techList}`,
      links: projectLinks(named[0].index),
      suggestions: ["Which projects use C++?", "What do you know about Rust?", "How can I reach you?"],
    };
  }

  // 3. Known technology + skills intent -> confirm + where it is used.
  if (techs.length > 0 && confident && top.intent === "skills") {
    const tech = techs[0];
    const users = projectsUsing(tech);
    const where = users.length
      ? ` I use it in ${users.map((i) => projects[i].title).join(", ")}.`
      : "";
    return {
      text: `Yes — ${tech} is part of my stack.${where}`,
      links: users.slice(0, 2).flatMap(projectLinks),
      suggestions: [`Which projects use ${tech}?`, "What are your skills?", "Tell me about MESOS"],
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
      const list = matching.map((i) => projectLine(i)).join(" ");
      return {
        text: techs.length > 1
          ? `Projects involving ${techs.join(" and ")}: ${list}`
          : `Here's where ${techs[0]} shows up: ${list}`,
        links: matching.flatMap(projectLinks),
        suggestions: ["Tell me about MESOS", "What are your skills?", "Where did you study?"],
      };
    }
    return {
      text: `I don't have a project combining ${techs.join(" and ")}. Try a single technology instead.`,
      links: [],
      suggestions: techs.map((t) => `Which projects use ${t}?`).concat("Show me your projects"),
    };
  }

  // 5. Confident intents without entities.
  if (confident) {
    switch (top.intent) {
      case "skills": {
        const all = skillGroups.map((g) => `${g.title}: ${g.items.join(", ")}`).join(" ");
        return {
          text: `My skills — ${all}`,
          links: [{ label: "Skills section", href: "#skills" }],
          suggestions: ["What do you know about Rust?", "Which projects use C++?", "Where did you study?"],
        };
      }
      case "education": {
        const list = education.map((e) => `${e.degree} @ ${e.school} (${e.period})`).join(" ");
        return {
          text: `I study at ${profile.university}: ${list}`,
          links: [],
          suggestions: ["What are your skills?", "Show me your projects", "How can I reach you?"],
        };
      }
      case "experience": {
        const list = experience.map((e) => `${e.role} @ ${e.org} (${e.period}): ${e.text}`).join(" ");
        return {
          text: `My experience: ${list}`,
          links: [],
          suggestions: ["Show me your projects", "What are your skills?", "How can I reach you?"],
        };
      }
      case "contact": {
        return {
          text: "You can reach me via GitHub and LinkedIn below — I'm open to internships and collaborations.",
          links: [
            { label: "GitHub", href: "https://github.com/francescomonticone" },
            { label: "Contact section", href: "#contact" },
          ],
          suggestions: ["Tell me about MESOS", "What are your skills?", "Where did you study?"],
        };
      }
      case "about": {
        return {
          text: `I'm ${profile.name}, ${profile.role} @ ${profile.university}. ${profile.tagline}`,
          links: [],
          suggestions: ["Show me your projects", "What are your skills?", "How can I reach you?"],
        };
      }
      case "projects": {
        const list = projects.map((p) => p.title).join(", ");
        return {
          text: `My featured projects: ${list}. Ask me about any of them for details.`,
          links: projects.filter((p) => p.repo).map((p) => ({ label: p.title, href: p.repo! })),
          suggestions: ["Tell me about MESOS", "Which projects use C++?", "What do you know about Rust?"],
        };
      }
      default:
        break;
    }
  }

  // 6. Controlled fallback: never invent, always redirect.
  return {
    text: "I don't have enough data to answer that. I can tell you about my projects, skills, education, experience or how to contact me.",
    links: [],
    suggestions: defaultSuggestions(),
  };
}

function defaultSuggestions(): string[] {
  return ["Show me your projects", "What are your skills?", "How can I reach you?"];
}
