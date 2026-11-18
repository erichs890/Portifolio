"use client";

import Link from "next/link";
import { AnimatedCounter } from "@/components";
import { useI18n } from "@/lib/i18n";
import { PROOF_POINTS } from "@/lib/dataviz";
import { localized, type ProjectCardData } from "@/lib/projects";

/** A row of real figures under the hero. Each one links to the project it comes from. */
export function ProofStrip({ projects }: { projects: ProjectCardData[] }) {
  const { t, lang } = useI18n();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const points = PROOF_POINTS.filter((point) => bySlug.has(point.slug));

  if (points.length === 0) return null;

  return (
    <section aria-label={t("proofLabel")} className="border-t border-line">
      <ul className="container grid grid-cols-1 sm:grid-cols-3 gap-x-6">
        {points.map((point) => {
          const project = bySlug.get(point.slug)!;
          return (
            <li key={point.label} className="py-7 pr-4">
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-bold text-heading tabular-nums">
                <AnimatedCounter value={point.value} duration={900} />
              </p>
              <p className="mt-2 text-sm text-body">{t(point.label)}</p>
              <Link
                href={`/projects/${point.slug}`}
                className="inline-flex items-center min-h-11 -my-2 font-mono text-xs text-accent-text hover:underline"
              >
                {localized(lang, project.title, project.titleEn)} →
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
