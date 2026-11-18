"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { localized, localizedList, type ProjectCardData } from "@/lib/projects";
import { ProjectCover, RolePill, StatusPill, TagList } from "./ProjectParts";

/** Large row for the strongest projects: cover on one side, the case for it on the other. */
export function FeaturedProject({ project, flip, priority }: { project: ProjectCardData; flip: boolean; priority?: boolean }) {
  const { t, lang } = useI18n();
  const title = localized(lang, project.title, project.titleEn);
  const highlights = localizedList(lang, project.highlights, project.highlightsEn);
  const address = project.liveUrl?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") ?? project.slug;

  return (
    <article className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6 lg:gap-10 items-center p-5 md:p-7 rounded-[18px] border border-line bg-surface-1">
      <div className={`rounded-xl overflow-hidden border border-line ${flip ? "lg:order-2" : ""}`}>
        <ProjectCover
          src={project.cover}
          alt={`${t("coverAlt")} ${title}`}
          address={address}
          sizes="(min-width: 1024px) 600px, 100vw"
          priority={priority}
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap gap-2 mb-4">
          <StatusPill status={project.status} />
          <RolePill role={project.role} />
        </div>

        <h3 className="!text-[clamp(1.5rem,2.4vw,2rem)] mb-1">
          <Link href={`/projects/${project.slug}`} className="inline-block py-2.5 text-heading hover:text-accent-text hover:no-underline transition-colors">
            {title}
          </Link>
        </h3>
        <p className="max-w-[52ch] text-body">{localized(lang, project.summary, project.summaryEn)}</p>

        {highlights.length > 0 && (
          <ul className="mt-4 grid gap-2">
            {highlights.map((item) => (
              <li key={item} className="grid grid-cols-[1.75rem_1fr] text-[15px] text-body">
                <span aria-hidden="true" className="font-mono text-accent-text">
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5">
          <TagList tags={project.stack} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !px-4 !text-sm hover:no-underline">
              {t("viewDeploy")}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          {project.repositoryUrl && (
            <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-4 !text-sm hover:no-underline">
              <Code2 size={15} aria-hidden="true" />
              {t("repository")}
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`${t("viewDetails")}: ${title}`}
            className="inline-flex items-center gap-1.5 min-h-11 px-2 text-sm font-semibold text-accent-text hover:no-underline group"
          >
            {t("viewDetails")}
            <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
