import type { Lang } from "@/lib/i18n";
import type { ProjectCardData } from "@/lib/projects";
import { SITE } from "@/lib/site";

/**
 * Public origin of the site, without a trailing slash. Set NEXT_PUBLIC_SITE_URL for a custom domain;
 * on Vercel it falls back to the production domain Vercel assigns.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return vercel ? `https://${vercel}` : "http://localhost:3000";
}

export const SITE_COPY: Record<Lang, { title: string; description: string; about: string; aboutDescription: string; notFound: string }> = {
  en: {
    title: `${SITE.name} | Full Stack Developer & Data Analyst`,
    description:
      "Portfolio of Erich Lima Schlaepfer, a full stack developer and data analyst in Fortaleza, Brazil: web and mobile products, data dashboards and security tooling.",
    about: "About",
    aboutDescription:
      "Computer Science student in Fortaleza, Brazil, building full stack products, data dashboards and security tooling.",
    notFound: "Project not found",
  },
  pt: {
    title: `${SITE.name} | Desenvolvedor Full Stack e Analista de Dados`,
    description:
      "Portfólio de Erich Lima Schlaepfer, desenvolvedor full stack e analista de dados em Fortaleza: produtos para web e mobile, painéis de dados e ferramentas de segurança.",
    about: "Sobre",
    aboutDescription:
      "Estudante de Ciência da Computação em Fortaleza, construindo produtos full stack, painéis de dados e ferramentas de segurança.",
    notFound: "Projeto não encontrado",
  },
};

/** schema.org Person for the site owner. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: siteUrl(),
    jobTitle: SITE.role,
    address: { "@type": "PostalAddress", addressLocality: "Fortaleza", addressRegion: "CE", addressCountry: "BR" },
    sameAs: [SITE.github, SITE.linkedin],
  };
}

/** schema.org SoftwareSourceCode when the repository is public, CreativeWork otherwise. */
export function projectJsonLd(project: ProjectCardData, lang: Lang) {
  const url = `${siteUrl()}/projects/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": project.repositoryUrl ? "SoftwareSourceCode" : "CreativeWork",
    name: lang === "en" && project.titleEn ? project.titleEn : project.title,
    description: lang === "en" && project.summaryEn ? project.summaryEn : project.summary,
    url,
    inLanguage: lang === "pt" ? "pt-BR" : "en",
    dateCreated: project.date.slice(0, 10),
    keywords: project.stack.join(", "),
    author: { "@type": "Person", name: SITE.name, url: siteUrl() },
    ...(project.cover ? { image: project.cover } : {}),
    ...(project.repositoryUrl ? { codeRepository: project.repositoryUrl } : {}),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };
}

/** Serialises JSON-LD for a script tag; "<" is escaped so content can never close the tag. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
