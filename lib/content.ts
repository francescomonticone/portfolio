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
};

export const projects: Project[] = [
  {
    id: "01",
    type: "Personal Project",
    title: "PoliMi T2A Study Plan",
    stack: ["TypeScript", "React", "AI-assisted"],
    description:
      "Interactive planner for a Computer Science & Engineering Master's study plan: course combinations, constraint checking and student-oriented course info. Independent project — not an official Politecnico di Milano application.",
    points: ["Course selection", "Constraint checking", "Compatible combinations"],
    codePublic: true,
    academic: false,
    photos: [],
  },
  {
    id: "02",
    type: "Real-world Project",
    title: "Healthcare Desktop App",
    stack: ["Tauri", "React", "Rust", "SQLCipher"],
    description:
      "Cross-platform desktop app for healthcare professionals: patient evaluations, assessment parameters over time, PDF reports and Excel export with secure SQLCipher storage.",
    points: ["Evaluations", "PDF + Excel export", "Secure storage"],
    codePublic: false,
    academic: false,
    photos: [
      "/project_foto/health1.png",
      "/project_foto/health2.png",
      "/project_foto/health3.png",
      "/project_foto/health4.png",
    ],
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
    codePublic: false,
    academic: true,
    photos: [],
  },
  {
    id: "04",
    type: "Academic Project",
    title: "ROS 2 Mapping & Navigation",
    stack: ["ROS 2", "Nav2", "SLAM", "AMCL"],
    description:
      "Full 2D mapping and autonomous navigation pipeline: occupancy grids from bag files, AMCL, costmaps, DWB controller and a custom C++ NavigateToPose goal publisher in Stage + RViz2.",
    points: ["SLAM maps", "Nav2 stack", "Custom C++ node"],
    codePublic: false,
    academic: true,
    photos: ["/project_foto/ROS2-mapping-and-navigation/Screenshots/map.png", "/project_foto/ROS2-mapping-and-navigation/Screenshots/nav2_navigation.png"],
  },
  {
    id: "05",
    type: "Academic Project",
    title: "MESOS Board Game",
    stack: ["Java", "Maven", "Team of 4"],
    description:
      "Software implementation of a board game with object-oriented design, testing and collaborative development practices.",
    points: ["OOP design", "Testing", "Team workflow"],
    codePublic: false,
    academic: true,
    photos: [],
  },
  {
    id: "06",
    type: "Personal Project",
    title: "AirDocs",
    stack: ["Swift", "macOS", "Vision"],
    description:
      "Hands-free macOS interaction via hand tracking: Vision + AVFoundation landmarks, pinch-based cursor control with smoothing and dead zones.",
    points: ["Hand landmarks", "Pinch control", "Smoothing"],
    codePublic: true,
    academic: false,
    photos: [],
  },
  {
    id: "07",
    type: "Personal Project",
    title: "PomoGP",
    stack: ["Web App", "F1 Telemetry"],
    description:
      "Formula 1 themed Pomodoro focus timer with live telemetry, real circuits and team radio — built for high performance.",
    points: ["Focus timer", "Real circuits", "Team radio"],
    codePublic: true,
    academic: false,
    photos: ["/project_foto/pomoGP/pomoGP-screenshot.png"],
  },
  {
    id: "08",
    type: "Academic Project",
    title: "ROS 2 Odometry",
    stack: ["ROS 2", "C++", "TF", "RViz2"],
    description:
      "Odometry system for a skid-steering mobile robot: experimental wheel calibration against ground-truth TF data, trajectory error metrics.",
    points: ["Wheel calibration", "TF analysis", "Error metrics"],
    codePublic: false,
    academic: true,
    photos: [
      "/project_foto/ROS2-odometry-for-Bunker-Pro/odometry-rviz-1.png",
      "/project_foto/ROS2-odometry-for-Bunker-Pro/odometry-rviz-2.png",
    ],
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
  { school: "Politecnico di Milano", degree: "BSc Computer Engineering", period: "Expected September 2026" },
  { school: "Liceo Scientifico Madonna della Neve", degree: "Scientific Diploma — 90/100", period: "Brescia" },
];

export const certifications = [
  "TOEIC Listening & Reading — 965/990",
  "Politecnico di Milano — Git Certification",
  "ECDL Base",
  "Il Grifone d'Acciaio Scholarship",
  "PoliMi Merit-Based Scholarship",
];

export type MinorProject = {
  title: string;
  stack: string[];
  description: string;
};

/** Progettini minori: per aggiungerne uno, basta appendere qui. */
export const minorProjects: MinorProject[] = [
  {
    title: "Hardware Task-List Module",
    stack: ["VHDL", "FPGA", "FSM"],
    description:
      "VHDL module managing an ordered task list in external RAM — FSMs for insert, remove, priority and clear, verified in Vivado.",
  },
];

export const exploreCards = [
  { title: "Experience", text: "Tutoring, internship and real-world software work.", href: "#other" },
  { title: "Education", text: "MSc and BSc path at Politecnico di Milano.", href: "#other" },
  { title: "Contact", text: "Open to internships and collaborations — via GitHub & LinkedIn.", href: "#contact" },
];
