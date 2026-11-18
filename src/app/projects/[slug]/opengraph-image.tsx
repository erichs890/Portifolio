import { OG_SIZE, ogCard } from "@/lib/ogImage";
import { toCardData } from "@/lib/projects";
import { getPublishedProjects } from "@/lib/publicProjects";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — project`;
export const size = OG_SIZE;
export const contentType = "image/png";

/** One social card per project, drawn from its title, summary and main stack. */
export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = (await getPublishedProjects())?.find((project) => project.slug === slug);

  if (!record) {
    return ogCard({ prompt: "SELECT * FROM projects;", title: SITE.name, subtitle: SITE.role });
  }

  const project = toCardData(record);
  return ogCard({
    prompt: `SELECT * FROM projects WHERE slug = '${project.slug}';`,
    title: project.titleEn || project.title,
    subtitle: project.summaryEn || project.summary,
    tags: project.stack,
  });
}
