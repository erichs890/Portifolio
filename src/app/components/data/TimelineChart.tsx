"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n, type Lang } from "@/lib/i18n";
import type { TimelineColumn } from "@/lib/dataviz";
import { formatProjectDate, localized, type ProjectCardData } from "@/lib/projects";
import type { ProjectStatus } from "@/types";
import { STATUS_META } from "../projects/ProjectParts";

const FILL: Record<ProjectStatus, string> = {
  IN_PRODUCTION: "bg-chart-prod",
  FINISHED: "bg-chart-done",
  IN_DEVELOPMENT: "bg-chart-dev",
};
const STATUSES: ProjectStatus[] = ["IN_PRODUCTION", "FINISHED", "IN_DEVELOPMENT"];

const monthLabel = (month: string, lang: Lang) => formatProjectDate(`${month}-01T00:00:00.000Z`, lang);

/**
 * Unit timeline: one square per project, stacked by month and coloured by status.
 * Status is never colour alone — each square carries the status icon, and the legend names it.
 */
export function TimelineChart({ columns, hint }: { columns: TimelineColumn[]; hint: string }) {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<ProjectCardData | null>(null);
  const all = columns.flatMap((column) => (column.kind === "month" ? column.projects : []));

  return (
    <div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
        {STATUSES.filter((status) => all.some((p) => p.status === status)).map((status) => {
          const Icon = STATUS_META[status].icon;
          return (
            <li key={status} className="inline-flex items-center gap-2 text-sm text-body">
              <span className={`grid place-items-center w-5 h-5 rounded-[4px] text-chart-on ${FILL[status]}`}>
                <Icon size={12} aria-hidden="true" />
              </span>
              {t(STATUS_META[status].label)}
              <span className="font-mono text-muted tabular-nums">{all.filter((p) => p.status === status).length}</span>
            </li>
          );
        })}
      </ul>

      <div className="flex items-end gap-2 pb-2 border-b border-line-strong" onMouseLeave={() => setActive(null)}>
        {columns.map((column) =>
          column.kind === "gap" ? (
            <div key={`gap-${column.from}`} className="flex-1 max-w-16 pb-3 text-center font-mono text-xs text-muted" aria-hidden="true">
              · · ·
            </div>
          ) : (
            <ul key={column.month} className="flex flex-col-reverse gap-[2px]" aria-label={monthLabel(column.month, lang)}>
              {column.projects.map((project) => {
                const Icon = STATUS_META[project.status].icon;
                const title = localized(lang, project.title, project.titleEn);
                return (
                  <li key={project.slug}>
                    <Link
                      href={`/projects/${project.slug}`}
                      aria-label={`${title} — ${t(STATUS_META[project.status].label)}, ${monthLabel(column.month, lang)}`}
                      onMouseEnter={() => setActive(project)}
                      onFocus={() => setActive(project)}
                      onBlur={() => setActive(null)}
                      className={`grid place-items-center w-11 h-11 rounded-[4px] text-chart-on transition-[filter,opacity] duration-150 hover:brightness-110 ${
                        FILL[project.status]
                      } ${active && active.slug !== project.slug ? "opacity-45" : ""}`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )
        )}
      </div>

      <div className="flex gap-2 pt-2" aria-hidden="true">
        {columns.map((column) =>
          column.kind === "gap" ? (
            <div key={`gap-${column.from}`} className="flex-1 max-w-16" />
          ) : (
            <div key={column.month} className="w-11 text-center font-mono text-[11px] leading-tight text-muted">
              {monthLabel(column.month, lang).replace(/ de /, " ").split(" ").map((part) => (
                <span key={part} className="block">
                  {part}
                </span>
              ))}
            </div>
          )
        )}
      </div>

      <p aria-hidden="true" className="mt-4 pt-3 min-h-[3rem] border-t border-line text-sm text-muted">
        {active ? (
          <>
            <strong className="font-semibold text-heading">{localized(lang, active.title, active.titleEn)}</strong> ·{" "}
            {t(STATUS_META[active.status].label)} · {formatProjectDate(active.date, lang)}
          </>
        ) : (
          hint
        )}
      </p>

      {/* Table view of the same data for screen readers. The wrapper is what hides it: a table ignores a 1px width. */}
      <div className="sr-only">
      <table>
        <caption>{t("dataTimelineTitle")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("detailDate")}</th>
            {STATUSES.map((status) => (
              <th key={status} scope="col">
                {t(STATUS_META[status].label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {columns.map(
            (column) =>
              column.kind === "month" && (
                <tr key={column.month}>
                  <th scope="row">{monthLabel(column.month, lang)}</th>
                  {STATUSES.map((status) => (
                    <td key={status}>{column.projects.filter((p) => p.status === status).length}</td>
                  ))}
                </tr>
              )
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
