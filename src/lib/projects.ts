import type { ProjectCategory, ProjectDTO, ProjectRole, ProjectStatus } from "@/types";
import type { Lang } from "@/lib/i18n";
import type { PlaygroundProject } from "@/lib/sqlPlayground";

/** A project as the public pages show it: plain, serialisable, with fallbacks already applied. */
export interface ProjectCardData {
  slug: string;
  title: string;
  titleEn: string | null;
  summary: string;
  summaryEn: string | null;
  highlights: string[];
  highlightsEn: string[];
  categories: ProjectCategory[];
  stack: string[];
  status: ProjectStatus;
  role: ProjectRole;
  featured: boolean;
  /** Manual position: lower comes first. Projects with the same value fall back to newest first. */
  order: number;
  /** ISO date: when the project happened, or when it was added if that is unknown. */
  date: string;
  cover: string | null;
  repositoryUrl: string | null;
  liveUrl: string | null;
}

/** Everything the project page needs on top of the card data. */
export interface ProjectDetailData extends ProjectCardData {
  description: string;
  descriptionEn: string | null;
  longDescription: string | null;
  longDescriptionEn: string | null;
  fullStack: string[];
  gallery: string[];
}

/** Just enough to link to a neighbouring project. */
export interface ProjectLink {
  slug: string;
  title: string;
  titleEn: string | null;
}

const CARD_STACK_SIZE = 5;

function firstSentence(text: string): string {
  const match = text.match(/^[\s\S]*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

export function toCardData(project: ProjectDTO): ProjectCardData {
  return {
    slug: project.slug,
    title: project.title,
    titleEn: project.titleEn || null,
    // Projects without a written summary fall back to the first sentence, never to a cut-off paragraph.
    summary: project.summary || firstSentence(project.description),
    summaryEn: project.summaryEn || (project.descriptionEn ? firstSentence(project.descriptionEn) : null),
    highlights: project.highlights ?? [],
    highlightsEn: project.highlightsEn ?? [],
    categories: project.categories ?? [],
    stack: project.featuredStack?.length
      ? project.featuredStack
      : project.technologies.slice(0, CARD_STACK_SIZE).map((tech) => tech.name),
    status: project.status,
    role: project.projectRole,
    featured: project.featured,
    order: project.order ?? 0,
    date: new Date(project.projectDate ?? project.createdAt).toISOString(),
    cover: project.coverImage || null,
    repositoryUrl: project.repositoryUrl || null,
    liveUrl: project.liveUrl || null,
  };
}

export function toDetailData(project: ProjectDTO): ProjectDetailData {
  return {
    ...toCardData(project),
    description: project.description,
    descriptionEn: project.descriptionEn || null,
    longDescription: project.longDescription || null,
    longDescriptionEn: project.longDescriptionEn || null,
    fullStack: project.technologies.map((tech) => tech.name),
    gallery: project.images ?? [],
  };
}

/** The order used everywhere on the site: the manual `order` first, then newest first. */
export function sortByNewest<T extends { date: string; order: number }>(projects: T[]): T[] {
  return [...projects].sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));
}

export function toPlaygroundProject(project: ProjectDTO): PlaygroundProject {
  return {
    name: project.title,
    slug: project.slug,
    status: project.status,
    role: project.projectRole,
    featured: project.featured,
    createdAt: new Date(project.projectDate ?? project.createdAt).toISOString().slice(0, 10),
    repositoryUrl: project.repositoryUrl || null,
    liveUrl: project.liveUrl || null,
    stack: project.technologies.map((tech) => tech.name),
  };
}

const LOCALES: Record<Lang, string> = { en: "en-US", pt: "pt-BR" };

/** "May 2026" / "mai. de 2026" — always in the active language. UTC keeps server and browser in agreement. */
export function formatProjectDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

export function localized(lang: Lang, pt: string, en: string | null): string {
  return lang === "en" && en ? en : pt;
}

export function localizedList(lang: Lang, pt: string[], en: string[]): string[] {
  return lang === "en" && en.length > 0 ? en : pt;
}
