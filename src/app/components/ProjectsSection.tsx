"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Kw, QueryHeading } from "@/components/QueryHeading";
import { useI18n } from "@/lib/i18n";
import { sortByNewest, type ProjectCardData } from "@/lib/projects";
import { PROJECT_CATEGORIES, type ProjectCategory, type ProjectStatus } from "@/types";
import { FeaturedProject } from "./projects/FeaturedProject";
import { FILTER_EVENT } from "./data/DataSection";
import { ProjectCard } from "./projects/ProjectCard";
import { CATEGORY_LABEL, STATUS_META } from "./projects/ProjectParts";

const STATUSES: ProjectStatus[] = ["IN_PRODUCTION", "FINISHED", "IN_DEVELOPMENT"];

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 px-3.5 rounded-full border text-sm font-medium cursor-pointer transition-colors ${
        pressed
          ? "border-accent bg-accent text-on-accent"
          : "border-line bg-surface-1 text-body hover:border-line-strong hover:text-heading"
      }`}
    >
      {children}
    </button>
  );
}

export function ProjectsSection({ projects }: { projects: ProjectCardData[] | null }) {
  const { t } = useI18n();
  const [category, setCategory] = useState<ProjectCategory | null>(null);
  const [status, setStatus] = useState<ProjectStatus | null>(null);

  // The "projects by area" chart in the Data section drives this filter.
  useEffect(() => {
    const onFilter = (event: Event) => {
      setCategory((event as CustomEvent<ProjectCategory>).detail);
      setStatus(null);
      document.getElementById("project-list")?.scrollIntoView({ block: "start" });
    };
    window.addEventListener(FILTER_EVENT, onFilter);
    return () => window.removeEventListener(FILTER_EVENT, onFilter);
  }, []);

  const sorted = useMemo(() => sortByNewest(projects ?? []), [projects]);
  const categories = PROJECT_CATEGORIES.filter((c) => sorted.some((p) => p.categories.includes(c)));
  const statuses = STATUSES.filter((s) => sorted.some((p) => p.status === s));

  if (!projects) {
    return <p className="font-mono text-sm text-muted">{t("termError")}</p>;
  }

  const filtering = category !== null || status !== null;
  const featured = sorted.filter((p) => p.featured);
  // With a filter on, featured projects join the grid so nothing matching is hidden.
  const grid = filtering
    ? sorted.filter((p) => (!category || p.categories.includes(category)) && (!status || p.status === status))
    : sorted.filter((p) => !p.featured);

  const conditions = [
    !filtering && <>NOT featured</>,
    category && <>&apos;{category}&apos; = ANY(categories)</>,
    status && <>status = &apos;{status}&apos;</>,
  ].filter(Boolean);

  return (
    <>
      {featured.length > 0 && (
        <div className="mb-20 md:mb-28">
          <QueryHeading
            sql={
              <>
                <Kw>SELECT</Kw> * <Kw>FROM</Kw> projects <Kw>WHERE</Kw> featured <Kw>ORDER BY</Kw> date <Kw>DESC</Kw>;
              </>
            }
            title={t("projFeatured")}
            rows={featured.length}
          />
          <div className="grid gap-6 md:gap-8">
            {featured.map((project, index) => (
              <FeaturedProject key={project.slug} project={project} flip={index % 2 === 1} priority={index === 0} />
            ))}
          </div>
        </div>
      )}

      <div id="project-list" className="scroll-mt-24" />
      <QueryHeading
        sql={
          <>
            <Kw>SELECT</Kw> * <Kw>FROM</Kw> projects <Kw>WHERE</Kw>{" "}
            {conditions.map((condition, i) => (
              <span key={i}>
                {i > 0 && (
                  <>
                    {" "}
                    <Kw>AND</Kw>{" "}
                  </>
                )}
                {condition}
              </span>
            ))}
            ;
          </>
        }
        title={filtering ? t("projAll") : t("projRest")}
        rows={grid.length}
      />

      <div className="mb-8 grid gap-3">
        <div role="group" aria-label={t("filterCategory")} className="flex flex-wrap gap-2">
          <Chip pressed={category === null} onClick={() => setCategory(null)}>
            {t("filterAll")}
          </Chip>
          {categories.map((c) => (
            <Chip key={c} pressed={category === c} onClick={() => setCategory(category === c ? null : c)}>
              {t(CATEGORY_LABEL[c])}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label={t("filterStatus")} className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <Chip key={s} pressed={status === s} onClick={() => setStatus(status === s ? null : s)}>
              {t(STATUS_META[s].label)}
            </Chip>
          ))}
        </div>
      </div>

      {grid.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-body">{t("projNoMatch")}</p>
          <button
            type="button"
            onClick={() => {
              setCategory(null);
              setStatus(null);
            }}
            className="btn-secondary mt-4 cursor-pointer"
          >
            {t("filterClear")}
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {grid.map((project) => (
              <motion.li
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </>
  );
}
