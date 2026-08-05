export const profile = {
  name: "Shrenik YD",
  title: "Senior Software Engineer",
  location: "Bengaluru, Karnataka 560032",
  email: "shrenikyd@gmail.com",
  phone: "+91 97423 10048",
  linkedin: "https://linkedin.com/in/shrenik-yd",
  github: "https://github.com/shrenikyd",
  resumeFile: "Shrenik_YD_Resume.pdf",
  // relative to /public
  avatar: "images/avatar.jpg",
  summary:
    "Full-stack .NET Software Engineer with 4+ years of experience building and maintaining scalable web applications across the .NET, Angular, and Knockout.js stack. Currently a Senior Software Engineer at Impetus Technologies, working full-stack on a US payroll platform serving 20,000+ employers, including leading the end-to-end integration of Zayzoon (on-demand pay). Strong background in SQL, DevOps (Azure Pipelines, Git), and Agile delivery, with a track record of independently owning features from requirements through deployment.",
  summaryShort:
    "Full-stack .NET engineer. 4+ years. Shipped on-demand pay to 20,000+ employers. Prefers shipping features over writing about them — but here we are.",
};

// Flavor comments shown on hover over each field in the About tab's
// "object literal" — purely decorative, kept factual/true to the resume.
export const fieldNotes = {
  name: "// resume says Shrenik YD",
  title: "// current role, since Jan 2025",
  location: "// IST — usually online till late",
};

export interface TimelineEvent {
  year: number;
  label: string;
  detail: string;
}

// Powers the About-tab career sparkline.
export const timelineEvents: TimelineEvent[] = [
  { year: 2019, label: "MCA begins", detail: "Nitte Meenakshi Institute of Technology" },
  { year: 2021, label: "Quinnox", detail: "Joined as Software Engineer — CRE & ALFR projects" },
  { year: 2025, label: "Impetus", detail: "Senior Software Engineer — IRIS payroll platform" },
];

export type Bullet = string;

export interface Job {
  company: string;
  designation: string;
  period: string;
  branch: string; // git-branch style label
  projects: {
    name: string;
    bullets: Bullet[];
  }[];
  responsibilities?: Bullet[];
  tech: string[];
}

export const jobs: Job[] = [
  {
    company: "Impetus Technologies",
    designation: "Senior Software Engineer",
    period: "Jan 2025 — Present",
    branch: "main",
    projects: [
      {
        name: "IRIS — US Payroll Application",
        bullets: [
          "Worked as a full-stack developer across the entire application lifecycle — front-end, back-end, and API layers — for a US-based payroll platform.",
          "Developed and maintained functionality using VB.NET and C# across legacy and new modules of the platform.",
          "Built and consumed C# Web APIs to support payroll processing and data integration.",
          "Delivered front-end features using Knockout.js, the application's core front-end framework.",
          "Led the end-to-end integration of Zayzoon (on-demand pay) into the payroll platform, scaling the feature to serve 20,000+ employers and several lakh employees.",
          "Collaborated with cross-functional teams to gather requirements, implement features, and resolve defects in an Agile environment.",
        ],
      },
    ],
    tech: ["VB.NET", "C#", "Web API", "Knockout.js", "Angular", "SQL"],
  },
  {
    company: "Quinnox Consultancy Pvt Ltd",
    designation: "Software Engineer",
    period: "Oct 2021 — Jan 2025",
    branch: "quinnox/legacy",
    projects: [
      {
        name: "CRE — Corporate Real Estate",
        bullets: [
          "Delivered end-to-end application development for comprehensive waste management services.",
          "Built and optimized scalable .NET Core and Angular solutions for garbage collection, recycling pickup, and dumpster rental services.",
        ],
      },
      {
        name: "ALFR — Annual Landfill Review",
        bullets: [
          "Automated exporting and analysis of Excel documents with integrated SQL queries.",
        ],
      },
    ],
    responsibilities: [
      "Full SDLC participation from requirement gathering to deployment.",
      "Development and enhancement of MVC architecture-based applications with Angular for interactive front-end development.",
      "Created and optimized SQL queries, views, stored procedures, and functions.",
      "Implemented DevOps practices using Azure Pipelines and Git for CI/CD workflows.",
      "Collaborated with cross-functional teams for defect fixes, enhancements, and new feature implementation.",
    ],
    tech: [".NET Core 8", "C#", "JavaScript", "SQL", "Azure", "MVC", "HTML5", "CSS3"],
  },
];

export const skills = {
  "backend.ts": [
    ".NET Core",
    ".NET MVC 8",
    "Web API",
    "VB.NET",
    "SQL",
    "Stored Procedures",
    "ADO.NET",
    "Entity Framework",
    "Windows Forms",
    "LINQ",
  ],
  "frontend.ts": ["JavaScript", "HTML5", "CSS3", "Angular", "Knockout.js"],
  "devops.ts": ["Azure DevOps", "Git"],
  "languages.ts": ["C#.NET / LINQ", "VB.NET", "Java"],
  "tools.ts": ["Visual Studio (2017/2019/2022)", "VS Code", "Microsoft SQL Server", "Microsoft Azure"],
};

export const education = {
  school: "Nitte Meenakshi Institute of Technology",
  degree: "MCA (Master of Computer Applications)",
  cgpa: "8.43",
  period: "2019 — 2021",
  location: "Bengaluru, India",
};

export const traits = [
  "Self-motivated and results-driven with excellent time management and multitasking skills.",
  "Adept at adapting to new tools and technologies in dynamic environments.",
  "Strong decision-making and problem-solving skills.",
];

export const languagesKnown = ["English", "Kannada"];

// Architecture-narrative layers: how a request actually flows through the
// systems Shrenik has built, top (user-facing) to bottom (infra).
export interface ArchLayer {
  id: string;
  label: string;
  sublabel: string;
  detail: string;
  tech: string[];
}

export const architectureLayers: ArchLayer[] = [
  {
    id: "frontend",
    label: "Front End",
    sublabel: "Angular · Knockout.js · HTML5/CSS3",
    detail:
      "Owns the screens payroll admins and employees actually touch — from Knockout.js-driven views on the legacy IRIS platform to Angular modules on CRE. Built and shipped interactive UI for on-demand pay requests, garbage/recycling/dumpster service workflows, and landfill reporting.",
    tech: ["Angular", "Knockout.js", "HTML5", "CSS3", "JavaScript"],
  },
  {
    id: "api",
    label: "API Layer",
    sublabel: "C# Web API",
    detail:
      "Designed and consumed C# Web APIs that move payroll data between IRIS and downstream services — including the Zayzoon on-demand-pay integration, wired so 20,000+ employers and several lakh employees can draw earned wages before payday without breaking the core payroll run.",
    tech: ["C# Web API", ".NET Core", "REST"],
  },
  {
    id: "backend",
    label: "Application / Backend",
    sublabel: "VB.NET · C# · .NET Core · MVC",
    detail:
      "Maintains and extends business logic across legacy VB.NET modules and modern C#/.NET Core services. On CRE, this meant MVC-architecture services for waste management operations; on IRIS, payroll processing logic spanning years-old code and new feature work side by side.",
    tech: ["VB.NET", "C#", ".NET Core 8", ".NET MVC 8", "Entity Framework", "ADO.NET", "LINQ"],
  },
  {
    id: "data",
    label: "Data Layer",
    sublabel: "SQL Server",
    detail:
      "Writes and tunes the queries, views, stored procedures, and functions that keep payroll runs, landfill reports, and service schedules accurate — plus automated Excel export/analysis pipelines for the Annual Landfill Review.",
    tech: ["SQL", "Stored Procedures", "Views", "Microsoft SQL Server"],
  },
  {
    id: "infra",
    label: "DevOps / Delivery",
    sublabel: "Azure Pipelines · Git · Agile",
    detail:
      "Ships all of the above through Azure Pipelines CI/CD and Git, inside Agile teams — full SDLC ownership from requirement gathering through deployment and defect resolution.",
    tech: ["Azure DevOps", "Git", "CI/CD", "Agile"],
  },
];

export const impactStats = [
  { value: 20000, suffix: "+", label: "employers served on IRIS" },
  { value: 4, suffix: "+", label: "years shipping production .NET" },
  { value: 2, suffix: "", label: "companies, zero gaps" },
  { value: 8.43, suffix: "", label: "CGPA, MCA" },
];
