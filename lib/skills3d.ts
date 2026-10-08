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
  { id: "c", name: "C", category: "languages", logo: "/skills/c.svg", short: "C", blurb: "Systems programming foundations.", projects: [] },
  { id: "cpp", name: "C++", category: "languages", logo: "/skills/cpp.svg", short: "C++", blurb: "Algorithms, graphs and performance.", projects: ["Dynamic Route Optimizer"] },
  { id: "java", name: "Java", category: "languages", logo: "/skills/java.svg", short: "Ja", blurb: "OOP and large codebases.", projects: ["MESOS Board Game"] },
  { id: "python", name: "Python", category: "languages", logo: "/skills/python.svg", short: "Py", blurb: "Scripting, data and AI experiments.", projects: [] },
  { id: "rust", name: "Rust", category: "languages", logo: "/skills/rust.svg", short: "Rs", blurb: "Safe systems programming.", projects: ["Healthcare Desktop App"] },
  { id: "typescript", name: "TypeScript", category: "languages", logo: "/skills/typescript.svg", short: "TS", blurb: "Typed web applications.", projects: ["PoliMi T2A Study Plan"] },
  { id: "swift", name: "Swift", category: "languages", logo: "/skills/swift.svg", short: "Sw", blurb: "Native Apple platforms.", projects: ["AirDocs"] },
  { id: "vhdl", name: "VHDL", category: "languages", logo: "/skills/vhdl.svg", short: "VH", blurb: "Hardware description and FPGAs.", projects: ["Hardware Task-List Module"] },
  { id: "sql", name: "SQL", category: "languages", logo: "/skills/sql.svg", short: "SQ", blurb: "Structured data and queries.", projects: ["Healthcare Desktop App"] },
  { id: "assembly", name: "Assembly", category: "languages", logo: "/skills/assembly.svg", short: "As", blurb: "Close to the metal.", projects: [] },
  { id: "react", name: "React", category: "frameworks", logo: "/skills/react.svg", short: "Re", blurb: "Component UI development.", projects: ["PoliMi T2A Study Plan", "Healthcare Desktop App"] },
  { id: "nextjs", name: "Next.js", category: "frameworks", logo: "/skills/nextjs.svg", short: "Nx", blurb: "Full-stack React, this site.", projects: [] },
  { id: "tauri", name: "Tauri", category: "frameworks", logo: "/skills/tauri.svg", short: "Ta", blurb: "Rust-powered desktop apps.", projects: ["Healthcare Desktop App"] },
  { id: "ros2", name: "ROS 2", category: "frameworks", logo: "/skills/ros2.svg", short: "R2", blurb: "Robotics middleware and navigation.", projects: ["ROS 2 Mapping & Navigation", "ROS 2 Odometry"] },
  { id: "nodejs", name: "Node.js", category: "frameworks", logo: "/skills/nodejs.svg", short: "No", blurb: "Server-side JavaScript.", projects: [] },
  { id: "maven", name: "Maven", category: "frameworks", logo: "/skills/maven.svg", short: "Mv", blurb: "Java builds and dependencies.", projects: ["MESOS Board Game"] },
  { id: "linux", name: "Linux", category: "platforms", logo: "/skills/linux.svg", short: "Lx", blurb: "Daily driver and servers.", projects: [] },
  { id: "docker", name: "Docker", category: "platforms", logo: "/skills/docker.svg", short: "Do", blurb: "Reproducible environments.", projects: [] },
  { id: "git", name: "Git", category: "platforms", logo: "/skills/git.svg", short: "Gi", blurb: "Version control everywhere.", projects: [] },
  { id: "vivado", name: "Xilinx Vivado", category: "platforms", logo: "/skills/vivado.svg", short: "Vi", blurb: "FPGA synthesis and simulation.", projects: ["Hardware Task-List Module"] },
  { id: "riscv", name: "RISC-V", category: "platforms", logo: "/skills/riscv.svg", short: "Rv", blurb: "Open instruction sets.", projects: [] },
  { id: "latex", name: "LaTeX", category: "platforms", logo: "/skills/latex.svg", short: "Lx", blurb: "Documents and TikZ figures.", projects: [] },
];
