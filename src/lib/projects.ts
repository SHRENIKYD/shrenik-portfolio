import { jobs } from "@/data/resume";

// One canonical list of projects, flattened out of the jobs they belong to,
// each with a URL slug. Both the work list and the per-project pages read from
// here so a card and its page can never disagree about what exists.

export type Project = (typeof jobs)[number]["projects"][number] & {
  slug: string;
  company: string;
  designation: string;
  branch: string;
  tech: string[];
};

/** "ALFR — Annual Landfill Review" → "alfr-annual-landfill-review" */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const allProjects: Project[] = jobs.flatMap((job) =>
  job.projects.map((proj) => ({
    ...proj,
    slug: slugify(proj.name),
    company: job.company,
    designation: job.designation,
    branch: job.branch,
    tech: job.tech,
  }))
);

export function getProject(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

/** Neighbours for the prev/next links at the foot of a project page. */
export function neighbours(slug: string): { prev?: Project; next?: Project } {
  const i = allProjects.findIndex((p) => p.slug === slug);
  if (i < 0) return {};
  return { prev: allProjects[i - 1], next: allProjects[i + 1] };
}
