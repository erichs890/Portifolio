"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Maximize2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  formatProjectDate,
  localized,
  localizedList,
  type ProjectDetailData,
  type ProjectLink,
} from "@/lib/projects";
import { Lightbox } from "@/app/components/projects/Lightbox";
import {
  CATEGORY_LABEL,
  ProjectCover,
  ROLE_LABEL,
  StatusPill,
  TagList,
} from "@/app/components/projects/ProjectParts";

interface Props {
  project: ProjectDetailData;
  previous: ProjectLink | null;
  next: ProjectLink | null;
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-3 border-b border-line last:border-b-0">
      <dt className="mb-1.5 font-mono text-xs text-muted">{label}</dt>
      <dd className="text-[15px] text-heading">{children}</dd>
    </div>
  );
}

export function ProjectDetailClient({ project, previous, next }: Props) {
  const { t, lang } = useI18n();
  const [viewing, setViewing] = useState<number | null>(null);

  const title = localized(lang, project.title, project.titleEn);
  const highlights = localizedList(lang, project.highlights, project.highlightsEn);
  const body =
    localized(lang, project.longDescription ?? "", project.longDescriptionEn) ||
    localized(lang, project.description, project.descriptionEn);
  const address = project.liveUrl?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") ?? project.slug;

  // The cover opens the viewer too, so the full uncropped screenshot is always one click away.
  const images = [
    ...(project.cover ? [{ src: project.cover, alt: `${t("coverAlt")} ${title}` }] : []),
    ...project.gallery.map((src, i) => ({ src, alt: `${title} — ${t("gallery").toLowerCase()} ${i + 1}` })),
  ];
  const galleryOffset = project.cover ? 1 : 0;

  return (
    <div className="container pt-8 pb-20 md:pt-12 md:pb-28">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 min-h-11 mb-6 text-sm font-medium text-muted hover:text-heading hover:no-underline transition-colors"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        {t("backToProjects")}
      </Link>

      <header className="max-w-4xl mb-10">
        <div className="flex flex-wrap gap-2 mb-5">
          <StatusPill status={project.status} />
        </div>
        <h1 className="!text-[clamp(2.25rem,5vw,4rem)]">{title}</h1>
        <p className="mt-5 max-w-[60ch] text-[clamp(1.05rem,1.4vw,1.25rem)] text-body">
          {localized(lang, project.summary, project.summaryEn)}
        </p>
      </header>

      {project.cover && (
        <div className="relative max-w-5xl mb-12 md:mb-16 rounded-2xl overflow-hidden border border-line shadow-[var(--shadow-lg)]">
          <ProjectCover src={project.cover} alt={images[0].alt} address={address} sizes="(min-width: 1024px) 1024px, 100vw" priority />
          <button
            type="button"
            onClick={() => setViewing(0)}
            aria-label={t("lightboxOpen")}
            className="absolute bottom-3 right-3 grid place-items-center w-11 h-11 rounded-[10px] border border-line bg-surface-1/90 text-heading hover:border-line-strong cursor-pointer"
          >
            <Maximize2 size={17} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-12 lg:gap-16 items-start">
        <article className="min-w-0">
          {highlights.length > 0 && (
            <section className="mb-10">
              <h2 className="!text-xl mb-4">{t("detailHighlights")}</h2>
              <ul className="grid gap-2.5 max-w-[70ch]">
                {highlights.map((item) => (
                  <li key={item} className="grid grid-cols-[1.75rem_1fr] text-body">
                    <span aria-hidden="true" className="font-mono text-accent-text">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <h2 className="!text-xl mb-4">{t("detailAbout")}</h2>
          <div className="prose max-w-[70ch] text-[1.0625rem] leading-[1.75] prose-headings:font-display prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-img:rounded-xl">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </article>

        <aside aria-label={t("detailSheet")} className="lg:sticky lg:top-24 rounded-2xl border border-line bg-surface-1 p-5">
          <h2 className="!text-base mb-1 font-mono !font-medium !tracking-normal text-muted" style={{ fontStretch: "100%" }}>
            {t("detailSheet")}
          </h2>
          <dl>
            <Fact label={t("detailRole")}>{t(ROLE_LABEL[project.role])}</Fact>
            <Fact label={t("detailDate")}>
              <time dateTime={project.date.slice(0, 10)}>{formatProjectDate(project.date, lang)}</time>
            </Fact>
            <Fact label={t("detailStatus")}>
              <StatusPill status={project.status} />
            </Fact>
            {project.categories.length > 0 && (
              <Fact label={t("detailCategories")}>
                {project.categories.map((category) => t(CATEGORY_LABEL[category])).join(" · ")}
              </Fact>
            )}
            {project.fullStack.length > 0 && (
              <Fact label={`${t("detailStack")} (${project.fullStack.length})`}>
                <TagList tags={project.fullStack} />
              </Fact>
            )}
          </dl>
          {(project.liveUrl || project.repositoryUrl) && (
            <div className="mt-4 grid gap-2.5">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center hover:no-underline">
                  {t("viewDeploy")}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
              {project.repositoryUrl && (
                <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary justify-center hover:no-underline">
                  <Code2 size={15} aria-hidden="true" />
                  {t("repository")}
                </a>
              )}
            </div>
          )}
        </aside>
      </div>

      {project.gallery.length > 0 && (
        <section className="mt-16 md:mt-20">
          <h2 className="!text-2xl mb-6">{t("gallery")}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.gallery.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setViewing(i + galleryOffset)}
                  aria-label={`${t("lightboxOpen")} ${i + 1}`}
                  className="block w-full rounded-xl overflow-hidden border border-line hover:border-accent-text transition-colors cursor-pointer"
                >
                  <ProjectCover src={src} alt="" sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(previous || next) && (
        <nav aria-label={t("navOther")} className="mt-16 md:mt-24 pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-4">
          {previous ? (
            <Link
              href={`/projects/${previous.slug}`}
              className="group p-5 rounded-2xl border border-line bg-surface-1 hover:border-accent-text hover:no-underline transition-colors"
            >
              <span className="flex items-center gap-1.5 mb-2 font-mono text-xs text-muted">
                <ArrowLeft size={13} aria-hidden="true" />
                {t("navPrev")}
              </span>
              <span className="font-display text-lg font-bold text-heading group-hover:text-accent-text transition-colors">
                {localized(lang, previous.title, previous.titleEn)}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="group p-5 rounded-2xl border border-line bg-surface-1 hover:border-accent-text hover:no-underline transition-colors sm:text-right"
            >
              <span className="flex items-center sm:justify-end gap-1.5 mb-2 font-mono text-xs text-muted">
                {t("navNext")}
                <ArrowRight size={13} aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-bold text-heading group-hover:text-accent-text transition-colors">
                {localized(lang, next.title, next.titleEn)}
              </span>
            </Link>
          )}
        </nav>
      )}

      {viewing !== null && (
        <Lightbox images={images} index={viewing} onChange={setViewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}

export function ProjectNotFound() {
  const { t } = useI18n();
  return (
    <div className="container py-28 text-center">
      <h1 className="!text-4xl mb-4">{t("projectNotFound")}</h1>
      <p className="mb-8 text-body">{t("projectNotFoundDesc")}</p>
      <Link href="/#projects" className="btn-primary hover:no-underline">
        {t("backToProjectsBtn")}
      </Link>
    </div>
  );
}
