"use client";

import { useMemo, type ReactNode } from "react";
import { Kw, QueryHeading } from "@/components/QueryHeading";
import { useI18n } from "@/lib/i18n";
import { categoryCounts, stackRanking, timeline } from "@/lib/dataviz";
import { localized, sortByNewest, type ProjectCardData } from "@/lib/projects";
import { ProjectCard } from "../projects/ProjectCard";
import { CATEGORY_LABEL } from "../projects/ProjectParts";
import { BarChart } from "./BarChart";
import { TimelineChart } from "./TimelineChart";

/** Fired by the area chart; ProjectsSection listens and applies the category filter. */
export const FILTER_EVENT = "portfolio:filter-category";

function ChartCard({ title, note, children, className = "" }: { title: string; note: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`rounded-2xl border border-line bg-surface-1 p-5 md:p-6 ${className}`}>
      <figcaption className="mb-5">
        <h3 className="!text-lg">{title}</h3>
        <p className="mt-1.5 text-sm text-muted">{note}</p>
      </figcaption>
      {children}
    </figure>
  );
}

export function DataSection({ projects }: { projects: ProjectCardData[] }) {
  const { t, lang } = useI18n();

  const titles = useMemo(
    () => new Map(projects.map((p) => [p.slug, localized(lang, p.title, p.titleEn)])),
    [projects, lang]
  );
  const describe = (slugs: string[]) =>
    `${slugs.length} ${t(slugs.length === 1 ? "countProject" : "countProjects")}: ${slugs.map((slug) => titles.get(slug)).join(", ")}`;

  const stack = useMemo(() => stackRanking(projects), [projects]);
  const areas = useMemo(() => categoryCounts(projects), [projects]);
  const columns = useMemo(() => timeline(projects), [projects]);
  const dataProjects = useMemo(() => sortByNewest(projects.filter((p) => p.categories.includes("DATA"))), [projects]);

  return (
    <>
      <QueryHeading
        sql={
          <>
            <Kw>SELECT</Kw> stack, category, date, status <Kw>FROM</Kw> projects;
          </>
        }
        title={t("dataTitle")}
      >
        <p className="mt-4 max-w-[60ch] text-body">{t("dataLead")}</p>
      </QueryHeading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title={t("dataStackTitle")} note={t("dataStackNote")}>
          <BarChart
            rows={stack.map((item) => ({ key: item.key, label: item.key, value: item.count, detail: describe(item.slugs) }))}
            hint={t("dataHoverHint")}
          />
        </ChartCard>

        <ChartCard title={t("dataAreaTitle")} note={t("dataAreaNote")}>
          <BarChart
            rows={areas.map((item) => ({
              key: item.key,
              label: t(CATEGORY_LABEL[item.key]),
              value: item.count,
              detail: describe(item.slugs),
            }))}
            hint={t("dataAreaHint")}
            onSelect={(category) => window.dispatchEvent(new CustomEvent(FILTER_EVENT, { detail: category }))}
          />
        </ChartCard>

        <ChartCard title={t("dataTimelineTitle")} note={t("dataTimelineNote")} className="lg:col-span-2">
          <TimelineChart columns={columns} hint={t("dataTimelineHint")} />
        </ChartCard>
      </div>

      {dataProjects.length > 0 && (
        <div className="mt-14">
          <h3 className="!text-2xl mb-6">{t("dataProjectsTitle")}</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dataProjects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
