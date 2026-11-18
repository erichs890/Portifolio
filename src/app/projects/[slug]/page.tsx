import type { Metadata } from "next";
import { resolveLang } from "@/lib/lang.server";
import { localized, sortByNewest, toCardData, toDetailData, type ProjectLink } from "@/lib/projects";
import { getPublishedProjects } from "@/lib/publicProjects";
import { jsonLdScript, projectJsonLd, SITE_COPY } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { ProjectDetailClient, ProjectNotFound } from "./ProjectDetailClient";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const [{ slug }, lang, projects] = await Promise.all([params, resolveLang(), getPublishedProjects()]);
  const record = projects?.find((project) => project.slug === slug);
  if (!record) return { title: `${SITE_COPY[lang].notFound} | ${SITE.name}`, robots: { index: false } };

  const project = toCardData(record);
  const title = localized(lang, project.title, project.titleEn);
  const description = localized(lang, project.summary, project.summaryEn);
  return {
    title: `${title} | ${SITE.name}`,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title, description, type: "article", url: `/projects/${slug}` },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [{ slug }, lang, projects] = await Promise.all([params, resolveLang(), getPublishedProjects()]);
  const record = projects?.find((project) => project.slug === slug);
  if (!projects || !record) return <ProjectNotFound />;

  // Previous/next follow the order of the home page.
  const ordered = sortByNewest(projects.map(toCardData));
  const position = ordered.findIndex((item) => item.slug === slug);
  const link = (index: number): ProjectLink | null => {
    const item = ordered[index];
    return item ? { slug: item.slug, title: item.title, titleEn: item.titleEn } : null;
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(projectJsonLd(ordered[position], lang)) }} />
      <ProjectDetailClient project={toDetailData(record)} previous={link(position - 1)} next={link(position + 1)} />
    </>
  );
}
