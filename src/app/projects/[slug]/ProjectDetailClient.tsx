"use client";

import Link from "next/link";
import { Button, Badge, TechBadge } from "@/components";
import { formatDate } from "@/utils/helpers";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink, Code2, Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ProjectDTO } from "@/types";

const statusKeys: Record<string, { key: "statusInDev" | "statusInProd" | "statusFinished"; variant: "success" | "warning" | "primary" }> = {
  IN_DEVELOPMENT: { key: "statusInDev", variant: "warning" },
  IN_PRODUCTION: { key: "statusInProd", variant: "success" },
  FINISHED: { key: "statusFinished", variant: "primary" },
};

const roleKeys: Record<string, "collaborator" | "coCreator" | undefined> = {
  COLLABORATOR: "collaborator",
  CO_CREATOR: "coCreator",
};

export function ProjectDetailClient({ project }: { project: ProjectDTO }) {
  const { t, lang } = useI18n();
  const statusInfo = statusKeys[project.status] || statusKeys.FINISHED;

  const title = lang === "en" && project.titleEn ? project.titleEn : project.title;
  const description = lang === "en" && project.descriptionEn ? project.descriptionEn : project.description;
  const longDesc = lang === "en" && project.longDescriptionEn ? project.longDescriptionEn : project.longDescription;
  const roleKey = roleKeys[project.projectRole];

  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-12 md:pt-28 md:pb-16 relative">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-accent-violet/10 rounded-full blur-[130px] -z-10" />

        <div className="container relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan text-sm font-mono mb-8 transition-colors hover:no-underline"
          >
            <ArrowLeft size={14} />
            {t("backToProjects")}
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <Badge variant={statusInfo.variant}>{t(statusInfo.key)}</Badge>
              {project.featured && <Badge variant="primary">{t("featured")}</Badge>}
              {roleKey && <Badge variant="warning">{t(roleKey)}</Badge>}
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-text-heading tracking-tight leading-[1.02]">
              {title}
            </h1>

            <p className="text-lg text-text-secondary mb-8 max-w-3xl">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-text-secondary font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((tech) => (
                <TechBadge key={tech.id} name={tech.name} color={tech.color} />
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.repositoryUrl && (
                <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="md">
                    <span className="inline-flex items-center gap-2">
                      <Code2 size={14} />
                      {t("repository")}
                    </span>
                  </Button>
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="md">
                    <span className="inline-flex items-center gap-2">
                      <ExternalLink size={14} />
                      {t("viewDeploy")}
                    </span>
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {project.coverImage && (
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
              <div className="absolute -inset-4 bg-accent-cyan/5 blur-2xl -z-10" />
              <img src={project.coverImage} alt={title} className="w-full object-contain" />
            </div>
          </div>
        </section>
      )}

      {longDesc && (
        <section className="py-12 md:py-16">
          <div className="container max-w-3xl">
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent-cyan prose-a:no-underline hover:prose-a:underline prose-strong:text-text-heading prose-code:text-accent-cyan prose-code:before:content-none prose-code:after:content-none prose-img:rounded-xl prose-img:border prose-img:border-white/10">
              <ReactMarkdown>{longDesc}</ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {project.images.length > 0 && (
        <section className="py-12 md:py-16 border-t border-white/5">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-text-heading tracking-tight">
              <span className="text-accent-cyan font-mono font-normal text-lg mr-2">//</span>
              {t("gallery")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden border border-white/10 group transition-all duration-300 hover:border-accent-cyan/30 hover:shadow-[0_0_30px_-8px_var(--glow-cyan)]"
                >
                  <img
                    src={image}
                    alt={`${title} - ${index + 1}`}
                    className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
