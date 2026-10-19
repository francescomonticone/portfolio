export const profile = {
  name: "Francesco Monticone",
  firstName: "Francesco",
  role: "MSc Computer Science & Engineering Student",
  university: "Politecnico di Milano",
  location: "Italy",
  tagline: "Understanding how complex systems work — and building practical software on top.",
};

export const navLinks = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Other", href: "#other" },
];

export const promptChips = ["Work", "About me", "Skills", "Contact"];

export const techTags = [
  { label: "C++", file: "cpp" },
  { label: "Rust", file: "rust" },
  { label: "TypeScript", file: "typescript" },
  { label: "React", file: "react" },
  { label: "Next.js", file: "nextjs" },
  { label: "Tauri", file: "tauri" },
  { label: "ROS 2", file: "ros2" },
  { label: "Python", file: "python" },
  { label: "VHDL", file: "vhdl" },
  { label: "Docker", file: "docker" },
  { label: "Linux", file: "linux" },
  { label: "Git", file: "git" },
];

export type Project = {
  id: string;
  type: string;
  title: string;
  stack: string[];
  description: string;
  points: string[];
  codePublic: boolean;
  academic: boolean;
  photos: string[];
  logo?: string;
  repo?: string;
  org?: string;
  role?: string;
  link?: { label: string; href: string };
  caseStudy?: "dro";
  visual?: "hand" | "franco";
};

export const projects: Project[] = [
  {
    id: "01",
    type: "Academic Project",
    title: "MESOS Board Game",
    stack: ["Java", "Maven", "Team of 4"],
    description:
      "Software implementation of a board game with object-oriented design, testing and collaborative development practices.",
    points: ["OOP design", "Testing", "Team workflow"],
    codePublic: true,
    academic: true,
    photos: [
      "/project_foto/mesos/start_screen.png",
      "/project_foto/mesos/uml_model.png",
      "/project_foto/mesos/uml_other.png",
      "/project_foto/mesos/seq_join_game.png",
      "/project_foto/mesos/seq_pick_card.png",
    ],
    repo: "https://github.com/francescomonticone/Mesos",
  },
  {
    id: "02",
    type: "Real-world Project",
    title: "Healthcare Desktop App",
    stack: ["Tauri", "React", "Rust", "Windows"],
    description:
      "Offline-first Windows desktop app for healthcare professionals: patient evaluations, assessment parameters over time, PDF reports and Excel export, with automatic updates via GitHub Actions.",
    points: ["Offline-first", "Auto-update via GitHub Actions", "PDF + Excel export"],
    codePublic: true,
    academic: false,
    photos: [
      "/project_foto/health1.png",
      "/project_foto/health2.png",
      "/project_foto/health3.png",
      "/project_foto/health4.png",
    ],
    repo: "https://github.com/francescomonticone/Salute-e-Benessere-Updates",
    // TODO(healthcare-logo): file logo non trovato in public/ — aggiungi es.
    // logo: "/project_foto/salute-benessere/logo.png",
  },
  {
    id: "03",
    type: "Academic Project",
    title: "Dynamic Route Optimizer",
    stack: ["C++", "Graphs", "Dijkstra"],
    description:
      "Dynamic route optimizer on a hexagonal grid with weighted graphs and Dijkstra, Min Heap priority queue and Hash Table caching for repeated queries.",
    points: ["Hex grid", "Min Heap", "Query caching"],
    codePublic: true,
    academic: true,
    photos: [],
    caseStudy: "dro",
    repo: "https://github.com/francescomonticone/progetto-api-2024-2025",
  },
  {
    id: "04",
    type: "Academic Project",
    title: "ROS 2 Mapping & Navigation",
    stack: ["ROS 2", "Nav2", "SLAM", "AMCL"],
    description:
      "Full 2D mapping and autonomous navigation pipeline: occupancy grids from bag files, AMCL, costmaps, DWB controller and a custom C++ NavigateToPose goal publisher in Stage + RViz2.",
    points: ["SLAM maps", "Nav2 stack", "Custom C++ node"],
    codePublic: true,
    academic: true,
    photos: ["/project_foto/ROS2-mapping-and-navigation/Screenshots/map.png", "/project_foto/ROS2-mapping-and-navigation/Screenshots/nav2_navigation.png"],
    repo: "https://github.com/francescomonticone/ROS2-mapping-and-navigation",
  },
  {
    id: "05",
    type: "Personal Project",
    title: "PomoGP",
    stack: ["Web App", "F1 Telemetry"],
    description:
      "Formula 1 themed Pomodoro focus timer with live telemetry, real circuits and team radio — built for high performance.",
    points: ["Focus timer", "Real circuits", "Team radio"],
    codePublic: true,
    academic: false,
    photos: ["/project_foto/pomoGP/pomoGP-screenshot.png"],
    repo: "https://github.com/francescomonticone/pomoGP",
  },
  {
    id: "06",
    type: "Academic Project",
    title: "ROS 2 Odometry",
    stack: ["ROS 2", "C++", "TF", "RViz2"],
    description:
      "Odometry system for a skid-steering mobile robot: experimental wheel calibration against ground-truth TF data, trajectory error metrics.",
    points: ["Wheel calibration", "TF analysis", "Error metrics"],
    codePublic: true,
    academic: true,
    photos: [
      "/project_foto/ROS2-odometry-for-Bunker-Pro/odometry-rviz-1.png",
      "/project_foto/ROS2-odometry-for-Bunker-Pro/odometry-rviz-2.png",
    ],
    repo: "https://github.com/francescomonticone/ROS2-odometry-for-Bunker-Pro",
  },
];

/** Progetti in corso: sezione "Now building" sotto i minors. */
export const nowBuilding: Project[] = [
  {
    id: "W1",
    type: "Work in progress",
    title: "AirDocs",
    stack: ["Swift", "macOS", "Vision"],
    description:
      "Hands-free macOS interaction via hand tracking: Vision + AVFoundation landmarks, pinch-based cursor control with smoothing and dead zones.",
    points: ["Hand landmarks", "Pinch control", "Smoothing"],
    codePublic: true,
    academic: false,
    photos: [],
    visual: "hand",
  },
  {
    id: "W2",
    type: "Work in progress",
    title: "F.R.A.N.C.O.",
    stack: ["ROS 2", "Firmware", "Electronics"],
    description:
      "Autonomous flood-rescue robot by PoliMi Data Scientists, built to carry vital supplies across flooded areas. I work across the Firmware & Electronics teams: ROS 2 migration, sensor integration, wiring, power and field testing.",
    points: ["ROS 2 migration", "Sensor stack", "Flood rescue"],
    codePublic: false,
    academic: false,
    photos: [],
    org: "PoliMi Data Scientists",
    role: "Firmware & Electronics team",
    link: { label: "Project page", href: "https://www.polimidatascientists.it/projects" },
    visual: "franco",
  },
];

export const skillGroups = [
  { title: "Languages", items: ["C", "C++", "Java", "Python", "Rust", "TypeScript", "Swift", "VHDL", "SQL", "Assembly"] },
  { title: "Frameworks", items: ["React", "Next.js", "Tauri", "ROS 2", "Node.js", "Maven"] },
  { title: "Platforms", items: ["Linux", "Docker", "Git", "Xilinx Vivado", "RISC-V", "LaTeX"] },
];

export const experience = [
  {
    role: "Engineering Tutor",
    org: "Politecnico di Milano",
    period: "2023–2026",
    text: "Tutoring in Calculus I, Physics and Electrical Engineering — individual and group support, exam preparation.",
  },
  {
    role: "Intern",
    org: "Confartigianato Palazzolo",
    period: "2022",
    text: "Company data management with Microsoft Excel — maintenance and updating of business spreadsheets.",
  },
];

export const education = [
  { school: "Politecnico di Milano", degree: "MSc Computer Science & Engineering", period: "2026 – Present" },
  { school: "Politecnico di Milano", degree: "BSc Computer Engineering — 109/110", period: "2026" },
  { school: "Liceo Scientifico Madonna della Neve", degree: "Scientific Diploma", period: "Brescia" },
];

export type Certification = { title: string; detail?: string };

export const certifications: Certification[] = [
  { title: "TOEIC Listening & Reading", detail: "965/990" },
  { title: "Git Certification", detail: "PoliMi" },
  { title: "ECDL Base" },
  { title: "Il Grifone d'Acciaio", detail: "Scholarship" },
  { title: "PoliMi Merit-Based", detail: "Scholarship" },
];

export type MinorProject = {
  title: string;
  stack: string[];
  description: string;
  photo?: string;
  link?: { label: string; href: string };
};

/** Progettini minori: per aggiungerne uno, basta appendere qui. */
export const minorProjects: MinorProject[] = [
  {
    title: "PoliMi T2A Study Plan",
    stack: ["TypeScript", "React"],
    description:
      "Interactive planner for a CSE Master's study plan: course combinations and constraint checking. Independent project — not an official Politecnico di Milano application.",
    photo: "/project_foto/t2a-study-plan/linkedin-post.png",
    link: { label: "LinkedIn post", href: "https://www.linkedin.com/feed/update/urn:li:activity:7504125301166161920/" },
  },  {
    title: "Hardware Task-List Module",
    stack: ["VHDL", "FPGA", "FSM"],
    description:
      "VHDL module managing an ordered task list in external RAM — FSMs for insert, remove, priority and clear, verified in Vivado.",
  },
];

export type CourseIcon = "cpu" | "brain" | "boxes" | "database" | "braces" | "sigma";

export const semesterCourses: {
  name: string;
  icon: CourseIcon;
  tags: string[];
}[] = [
  { name: "Advanced Operating Systems", icon: "cpu", tags: ["Real-time scheduling", "Concurrency & IPC", "Device drivers"] },
  { name: "Foundations of Artificial Intelligence", icon: "brain", tags: ["Search & A*", "Games", "CSP", "Logic & planning"] },
  { name: "Software Engineering 2", icon: "boxes", tags: ["RASD & UML", "Alloy modeling", "V&V & testing"] },
  { name: "Databases 2", icon: "database", tags: ["NoSQL", "Distributed DB", "Query optimization"] },
  { name: "Formal Languages and Compilers", icon: "braces", tags: ["Automata", "Grammars", "Parsing"] },
  { name: "Foundations of Operations Research", icon: "sigma", tags: ["Linear programming", "Simplex", "Optimization"] },
];

export type PersonalTrackIcon = "sparkles" | "shield" | "gpu";

export const personalTrack: { label: string; icon: PersonalTrackIcon }[] = [
  { label: "LLMs & AI systems", icon: "sparkles" },
  { label: "AI security", icon: "shield" },
  { label: "CUDA & parallel computing", icon: "gpu" },
];

export type TimelineEntry = {
  kind: "education" | "work";
  title: string;
  org: string;
  period: string;
  text: string;
  meta?: string;
  logo?: string;
};

/** Percorso in ordine cronologico inverso: aggiungi in cima per le novità. */
export const timeline: TimelineEntry[] = [
  {
    kind: "work",
    title: "Firmware & Electronics Team",
    org: "PoliMi Data Scientists · F.R.A.N.C.O.",
    period: "2026 — present",
    text: "Building the ROS 2 and sensor stack for an autonomous flood-rescue robot: Arduino → ROS 2 migration, sensor integration, wiring, power and waterproofing, tested with the AI team.",
    meta: "Ongoing",
    logo: "/logos/pmds.png",
  },
  {
    kind: "work",
    title: "Engineering Tutor",
    org: "Politecnico di Milano",
    period: "2023 — 2026",
    text: "Tutoring in Calculus I, Physics and Electrical Engineering — individual and group support, exam preparation.",
    logo: "/logos/polimi.svg",
  },
  {
    kind: "work",
    title: "Intern",
    org: "Confartigianato Palazzolo",
    period: "2022",
    text: "Company data management with Microsoft Excel — maintenance and updating of business spreadsheets.",
    logo: "/logos/confartigianato.png",
  },
  {
    kind: "education",
    title: "MSc Computer Science & Engineering",
    org: "Politecnico di Milano",
    period: "2026 — present",
    text: "Systems, AI and security — building on a computer engineering foundation.",
    meta: "In progress",
    logo: "/logos/polimi.svg",
  },
  {
    kind: "education",
    title: "BSc Computer Engineering",
    org: "Politecnico di Milano",
    period: "Graduated 2026",
    text: "Computer engineering fundamentals: hardware, software, networks and applied mathematics.",
    meta: "109/110",
    logo: "/logos/polimi.svg",
  },
  {
    kind: "education",
    title: "Scientific Diploma",
    org: "Liceo Scientifico Madonna della Neve",
    period: "Brescia",
    text: "Scientific high school — mathematics, physics and natural sciences.",
    logo: "/logos/mdn.png",
  },
];

export const exploreCards = [
  { title: "Experience", text: "Tutoring, internship and real-world software work.", href: "#other" },
  { title: "Education", text: "MSc and BSc path at Politecnico di Milano.", href: "#other" },
  { title: "Contact", text: "Open to internships and collaborations — via GitHub & LinkedIn.", href: "#contact" },
];
