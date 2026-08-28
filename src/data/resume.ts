export const profile = {
  name: "Shrenik YD",
  title: "Senior Software Engineer",
  location: "Bengaluru, Karnataka 560032",
  email: "shrenikyd@gmail.com",
  phone: "+91 97423 10048",
  linkedin: "https://linkedin.com/in/shrenik-yd",
  github: "https://github.com/shrenikyd",
  resumeFile: "Shrenik_YD_Resume.pdf",
  // root-relative path under /public — always resolve through
  // withBasePath() before using, since this deploys under a subpath
  avatar: "/images/avatar.jpg",
  summary:
    "A full-stack .NET engineer who's just as comfortable in C#, VB.NET, .NET Core, and Java on the back end as in Angular, Knockout.js, and vanilla JavaScript/HTML5/CSS3 on the front, with SQL Server and Azure (DevOps, AI Services) rounding out the stack. Thinks like a systems engineer — comfortable reasoning through data structures & algorithms and system design, not just wiring up features. Self-motivated and results-driven, with the time-management and multitasking instincts that come from juggling several codebases at once. Adapts quickly to new tools and technologies rather than sticking to what's familiar, and leans on strong decision-making and problem-solving skills to own things end to end.",
  summaryShort:
    "Full-stack .NET engineer — C#, VB.NET, .NET Core, Java, Angular, Knockout.js, SQL Server, Azure. Strong on DSA and system design, self-motivated, adaptable, and quick to pick up whatever tool the problem calls for.",
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
  { year: 2021, label: "Quinnox", detail: "Joined as Software Engineer — WM's CRE, ALFR & Power BI reporting" },
  { year: 2025, label: "Impetus", detail: "Senior Software Engineer — IRIS Software Group's payroll platforms" },
];

export type Bullet = string;

export interface Job {
  company: string;
  designation: string;
  period: string;
  branch: string; // git-branch style label
  projects: {
    name: string; // the application actually built/maintained
    client?: string; // the company the employer staffed Shrenik to build it for
    period?: string;
    bullets: Bullet[];
    highlight?: string; // standout stat/callout for the Projects tab card
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
        name: "Claims Intelligence",
        client: "PCMI Corporation",
        period: "Jul 2026 — Present",
        bullets: [
          "Working as a full-stack developer on Claims Intelligence, PCMI's AI-powered F&I claims platform, building features across both front-end and back-end layers.",
          "Building new front-end modules with Angular 21 and back-end services with .NET Core.",
          "Integrating Azure AI Services into the platform to support AI-driven functionality.",
          "Designing and consuming APIs backed by SQL Server for core application workflows.",
        ],
      },
      {
        name: "USPAYROLL",
        client: "IRIS Software Group",
        period: "Jan 2025 — Jun 2026",
        bullets: [
          "Worked as a full-stack developer across the entire application lifecycle — front-end, back-end, and API layers.",
          "Developed and maintained functionality using VB.NET and C# across legacy and new modules of the platform.",
          "Built and consumed C# Web APIs to support payroll processing and data integration.",
          "Led the end-to-end integration of Zayzoon (on-demand pay), scaling the feature to serve 20,000+ employers and several lakh employees.",
        ],
        highlight: "20,000+ employers served",
      },
      {
        name: "IRISPAYROLL",
        client: "IRIS Software Group",
        period: "Jan 2025 — Jun 2026",
        bullets: [
          "Delivered front-end features using Knockout.js, the application's core front-end framework.",
          "Supported multi-location payroll service delivery across US client sites.",
          "Collaborated with cross-functional teams to gather requirements, implement features, and resolve defects in an Agile environment.",
        ],
      },
    ],
    responsibilities: [
      "Full-stack ownership across front-end, back-end and API layers on AI-powered claims and payroll platforms.",
      "Built new modules in Angular 21 and .NET Core while maintaining legacy VB.NET and Knockout.js areas of the same products.",
      "Designed and consumed C# Web APIs backed by SQL Server for core claims and payroll workflows.",
      "Integrated Azure AI Services into the claims platform to support AI-driven functionality.",
      "Worked in an Agile environment with cross-functional teams on requirements, feature delivery and defect resolution.",
    ],
    tech: [
      "Angular 21",
      ".NET Core",
      "Azure AI Services",
      "VB.NET",
      "C#",
      "Web API",
      "Knockout.js",
      "SQL",
    ],
  },
  {
    company: "Quinnox Consultancy Pvt Ltd",
    designation: "Software Engineer",
    period: "Oct 2021 — Jan 2025",
    branch: "quinnox/legacy",
    projects: [
      {
        name: "CRE",
        client: "WM (Waste Management, Inc.)",
        bullets: [
          "Delivered end-to-end application development for comprehensive waste management services.",
          "Built and optimized scalable .NET Core and Angular solutions for garbage collection, recycling pickup, and dumpster rental services.",
        ],
      },
      {
        name: "ALFR — Annual Landfill Review",
        client: "WM (Waste Management, Inc.)",
        bullets: [
          "Automated exporting and analysis of Excel documents with integrated SQL queries.",
        ],
      },
      {
        name: "Power BI Reporting",
        client: "WM (Waste Management, Inc.)",
        bullets: [
          "Built landfill and waste-service reporting dashboards in Power BI, surfacing operational metrics for WM's landfill and collection operations.",
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
    tech: [".NET Core 8", "C#", "JavaScript", "SQL", "Azure", "MVC", "HTML5", "CSS3", "Power BI"],
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
  "frontend.ts": ["JavaScript", "HTML5", "CSS3", "Angular 21", "Knockout.js"],
  "ai.ts": ["Azure AI Services"],
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

// Rotating "fortune"-style quips for the About sidebar's now.focus panel —
// dry, factual-with-a-wink, matching the tone of profile.summaryShort above.
export const devQuotes = [
  "reads the stack trace before the Stack Overflow tab",
  "ships the feature, then ships the polish",
  "two companies, zero employment gaps",
  "picks up new tools faster than new small talk",
  "still owns the Zayzoon integration, four years in",
  "believes the best documentation is a working example",
];

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
    sublabel: "Angular 21 · Knockout.js · HTML5/CSS3",
    detail:
      "Owns the screens people actually touch — from Knockout.js-driven views on IRIS Software Group's payroll platforms to Angular modules on WM's CRE, and now Angular 21 on PCMI's Claims Intelligence. Built and shipped interactive UI for on-demand pay requests, garbage/recycling/dumpster service workflows, landfill reporting, and Claims Intelligence's newer full-stack features.",
    tech: ["Angular 21", "Knockout.js", "HTML5", "CSS3", "JavaScript"],
  },
  {
    id: "api",
    label: "API Layer",
    sublabel: "C# Web API",
    detail:
      "Designed and consumed C# Web APIs that move data between front-end and back-end services — including the Zayzoon on-demand-pay integration on IRIS Software Group's USPAYROLL, wired so 20,000+ employers and several lakh employees could draw earned wages before payday, and the API layer now underpinning PCMI's Claims Intelligence project.",
    tech: ["C# Web API", ".NET Core", "REST"],
  },
  {
    id: "backend",
    label: "Application / Backend",
    sublabel: "VB.NET · C# · .NET Core · MVC",
    detail:
      "Maintains and extends business logic across legacy VB.NET modules and modern C#/.NET Core services. On WM's CRE, this meant MVC-architecture services for waste management operations; on IRIS Software Group's payroll platforms, payroll processing logic spanning years-old code and new feature work side by side. Now building out .NET Core services for PCMI's Claims Intelligence project.",
    tech: ["VB.NET", "C#", ".NET Core 8", ".NET MVC 8", "Entity Framework", "ADO.NET", "LINQ"],
  },
  {
    id: "ai",
    label: "AI Services",
    sublabel: "Azure AI Services",
    detail:
      "The newest layer — integrating Azure AI Services into PCMI's Claims Intelligence build, adding intelligent capabilities alongside the traditional API and data layers.",
    tech: ["Azure AI Services"],
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
  { value: 20000, suffix: "+", label: "employers served on USPAYROLL" },
  { value: 4, suffix: "+", label: "years shipping production .NET" },
  { value: 2, suffix: "", label: "companies, zero gaps" },
  { value: 8.43, suffix: "", label: "CGPA, MCA" },
];
