"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { formatProjectDate, localized, type ProjectCardData } from "@/lib/projects";
import { CATEGORY_LABEL, ProjectCover, StatusPill, TagList } from "./ProjectParts";

/** Compact card: the whole card is one link to the project page. */
export function ProjectCard({ project }: { project: ProjectCardData }) {
  const { t, lang } = useI18n();
  const title = localized(lang, project.title, project.titleEn);

  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full hover:no-underline">
      <article className="surface-card h-full flex flex-col overflow-hidden">
        <div className="border-b border-line">
          <ProjectCover
            src={project.cover}
            alt={`${t("coverAlt")} ${title}`}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-col flex-1 gap-3 p-5">
          <div>
            <StatusPill status={project.status} />
          </div>
          <h3 className="!text-xl text-heading group-hover:text-accent-text transition-colors">{title}</h3>
          <p className="text-[14.5px] text-body">{localized(lang, project.summary, project.summaryEn)}</p>
          <TagList tags={project.stack} />
          <div className="mt-auto pt-3 flex justify-between gap-3 border-t border-line font-mono text-xs text-muted">
            <time dateTime={project.date.slice(0, 10)}>{formatProjectDate(project.date, lang)}</time>
            <span>{project.categories.map((category) => t(CATEGORY_LABEL[category])).join(" · ")}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
