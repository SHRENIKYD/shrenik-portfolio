import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import BetaBackground from "@/components/beta/BetaBackground";
import { allProjects, getProject, neighbours } from "@/lib/projects";
import { profile } from "@/data/resume";
import { SITE_ORIGIN } from "@/lib/site";
import { withBasePath } from "@/lib/basePath";

// A real page per project, statically generated at build time.
//
// The portfolio was a single URL, which meant nobody could share a specific
// piece of work and search engines had exactly one document to index. These
// give each project its own address, title and description — and, unlike the
// one-page site, they are reachable without sitting through the entry
// sequence first.

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const description =
    project.highlight ?? project.bullets[0]?.slice(0, 155) ?? profile.summaryShort;
  const title = `${project.name} — ${profile.name}`;
  const url = withBasePath(`/work/${project.slug}/`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [{ url: withBasePath("/og.png"), width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = neighbours(slug);

  // Enough for a search result to be worth clicking, and for a person to
  // understand what this was without the rest of the site.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    about: project.client ?? project.company,
    author: { "@type": "Person", name: profile.name, url: SITE_ORIGIN },
    keywords: project.tech.join(", "),
    datePublished: project.period,
  };

  return (
    <div className="relative min-h-screen">
      <BetaBackground />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-mono text-sm font-medium tracking-[0.2em] text-[#e8efe9] transition-colors hover:text-[#39ff8e]"
          >
            SHRENIK.YD
          </Link>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#556058] transition-colors hover:text-[#39ff8e]"
          >
            <ArrowLeft size={13} />
            All work
          </Link>
        </div>

        <article className="mt-16 sm:mt-24">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#6b7a72]">
            <span>{project.company}</span>
            {project.period && <span className="text-[#556058]">· {project.period}</span>}
          </div>

          <h1
            className="mt-5 font-bold leading-[1.02] tracking-tight text-[#e8efe9]"
            style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)" }}
          >
            {project.name}
          </h1>

          {project.client && (
            <p className="mt-3 font-mono text-sm text-[#39ff8e]">for {project.client}</p>
          )}

          <p className="mt-2 font-mono text-xs text-[#556058]">
            {project.designation} · {project.branch}
          </p>

          {project.highlight && (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#39ff8e]/35 bg-[#39ff8e]/[0.07] px-3.5 py-1.5 font-mono text-xs text-[#39ff8e]">
              <Sparkles size={13} />
              {project.highlight}
            </div>
          )}

          <ul className="mt-10 space-y-4 border-t border-[#1c2621] pt-8">
            {project.bullets.map((b) => (
              <li key={b} className="flex gap-3 leading-relaxed text-[#a9b5ac]">
                <span className="shrink-0 text-[#39ff8e]">▸</span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-[#1c2621] pt-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6b7a72]">
              Stack at {project.company}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-[#8b978f]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </article>

        <nav className="mt-20 flex flex-col gap-3 border-t border-[#1c2621] pt-8 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              href={`/work/${prev.slug}/`}
              className="group inline-flex items-center gap-2 font-mono text-xs text-[#556058] transition-colors hover:text-[#39ff8e]"
            >
              <ArrowLeft size={13} />
              {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/work/${next.slug}/`}
              className="group inline-flex items-center gap-2 font-mono text-xs text-[#556058] transition-colors hover:text-[#39ff8e] sm:justify-end"
            >
              {next.name}
              <ArrowRight size={13} />
            </Link>
          )}
        </nav>

        <div className="mt-16 rounded-2xl border border-[#1c2621] p-7 backdrop-blur-md">
          <p className="text-sm leading-relaxed text-[#a9b5ac]">
            {profile.name} — {profile.title.toLowerCase()} in{" "}
            {profile.location.split(",")[0]}.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
            <a href={`mailto:${profile.email}`} className="text-[#39ff8e] hover:underline">
              {profile.email}
            </a>
            <Link href="/" className="text-[#556058] hover:text-[#39ff8e]">
              The full portfolio →
            </Link>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        // structured data so a search result can show what this actually is
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
