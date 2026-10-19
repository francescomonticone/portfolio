export type OrbitId = "languages" | "frameworks" | "platforms";

export type Skill3D = {
  id: string;
  name: string;
  category: OrbitId;
  /** file in public/skills/ — se manca, monogramma generato automaticamente */
  logo: string;
  /** testo breve per i domains o fallback */
  short: string;
  blurb: string;
  /** versione italiana della descrizione (pannello laterale) */
  blurbIt?: string;
  projects: string[];
};

export const orbitConfig: Record<
  OrbitId,
  { radius: number; speed: number; inclination: number; label: string }
> = {
  languages: { radius: 3.4, speed: 0.22, inclination: 0.18, label: "Languages" },
  frameworks: { radius: 4.6, speed: 0.15, inclination: -0.3, label: "Frameworks" },
  platforms: { radius: 5.8, speed: 0.1, inclination: 0.45, label: "Platforms" },
};

/** Per aggiungere una skill futura: una riga qui, appare nell'orbita giusta. */
export const skills3d: Skill3D[] = [
  { id: "c", name: "C", category: "languages", logo: "/skills/c.svg", short: "C", blurb: "Systems programming foundations.", blurbIt: "Fondamenti di programmazione di sistema.", projects: [] },
  { id: "cpp", name: "C++", category: "languages", logo: "/skills/cpp.svg", short: "C++", blurb: "Algorithms, graphs and performance.", blurbIt: "Algoritmi, grafi e performance.", projects: ["Dynamic Route Optimizer"] },
  { id: "java", name: "Java", category: "languages", logo: "/skills/java.svg", short: "Ja", blurb: "OOP and large codebases.", blurbIt: "OOP e codebase di grandi dimensioni.", projects: ["MESOS Board Game"] },
  { id: "python", name: "Python", category: "languages", logo: "/skills/python.svg", short: "Py", blurb: "Scripting, data and AI experiments.", blurbIt: "Scripting, dati ed esperimenti di AI.", projects: [] },
  { id: "rust", name: "Rust", category: "languages", logo: "/skills/rust.svg", short: "Rs", blurb: "Safe systems programming.", blurbIt: "Programmazione di sistema sicura.", projects: ["Healthcare Desktop App"] },
  { id: "typescript", name: "TypeScript", category: "languages", logo: "/skills/typescript.svg", short: "TS", blurb: "Typed web applications.", blurbIt: "Applicazioni web tipizzate.", projects: ["PoliMi T2A Study Plan"] },
  { id: "swift", name: "Swift", category: "languages", logo: "/skills/swift.svg", short: "Sw", blurb: "Native Apple platforms.", blurbIt: "Piattaforme Apple native.", projects: ["AirDocs"] },
  { id: "vhdl", name: "VHDL", category: "languages", logo: "/skills/vhdl.svg", short: "VH", blurb: "Hardware description and FPGAs.", blurbIt: "Descrizione hardware e FPGA.", projects: ["Hardware Task-List Module"] },
  { id: "sql", name: "SQL", category: "languages", logo: "/skills/sql.svg", short: "SQ", blurb: "Structured data and queries.", blurbIt: "Dati strutturati e query.", projects: ["Healthcare Desktop App"] },
  { id: "assembly", name: "Assembly", category: "languages", logo: "/skills/assembly.svg", short: "As", blurb: "Close to the metal.", blurbIt: "Vicino all'hardware.", projects: [] },
  { id: "react", name: "React", category: "frameworks", logo: "/skills/react.svg", short: "Re", blurb: "Component UI development.", blurbIt: "Sviluppo UI a componenti.", projects: ["PoliMi T2A Study Plan", "Healthcare Desktop App"] },
  { id: "nextjs", name: "Next.js", category: "frameworks", logo: "/skills/nextjs.svg", short: "Nx", blurb: "Full-stack React, this site.", blurbIt: "React full-stack, questo sito.", projects: [] },
  { id: "tauri", name: "Tauri", category: "frameworks", logo: "/skills/tauri.svg", short: "Ta", blurb: "Rust-powered desktop apps.", blurbIt: "App desktop spinte da Rust.", projects: ["Healthcare Desktop App"] },
  { id: "ros2", name: "ROS 2", category: "frameworks", logo: "/skills/ros2.svg", short: "R2", blurb: "Robotics middleware and navigation.", blurbIt: "Middleware robotico e navigazione.", projects: ["ROS 2 Mapping & Navigation", "ROS 2 Odometry"] },
  { id: "nodejs", name: "Node.js", category: "frameworks", logo: "/skills/nodejs.svg", short: "No", blurb: "Server-side JavaScript.", blurbIt: "JavaScript lato server.", projects: [] },
  { id: "maven", name: "Maven", category: "frameworks", logo: "/skills/maven.svg", short: "Mv", blurb: "Java builds and dependencies.", blurbIt: "Build e dipendenze Java.", projects: ["MESOS Board Game"] },
  { id: "linux", name: "Linux", category: "platforms", logo: "/skills/linux.svg", short: "Lx", blurb: "Daily driver and servers.", blurbIt: "Uso quotidiano e server.", projects: [] },
  { id: "docker", name: "Docker", category: "platforms", logo: "/skills/docker.svg", short: "Do", blurb: "Reproducible environments.", blurbIt: "Ambienti riproducibili.", projects: [] },
  { id: "git", name: "Git", category: "platforms", logo: "/skills/git.svg", short: "Gi", blurb: "Version control everywhere.", blurbIt: "Version control ovunque.", projects: [] },
  { id: "vivado", name: "Xilinx Vivado", category: "platforms", logo: "/skills/vivado.svg", short: "Vi", blurb: "FPGA synthesis and simulation.", blurbIt: "Sintesi e simulazione FPGA.", projects: ["Hardware Task-List Module"] },
  { id: "riscv", name: "RISC-V", category: "platforms", logo: "/skills/riscv.svg", short: "Rv", blurb: "Open instruction sets.", blurbIt: "Instruction set aperti.", projects: [] },
  { id: "latex", name: "LaTeX", category: "platforms", logo: "/skills/latex.svg", short: "Lx", blurb: "Documents and TikZ figures.", blurbIt: "Documenti e figure TikZ.", projects: [] },
];
