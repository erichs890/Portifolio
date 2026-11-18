import type { ProjectCardData } from "@/lib/projects";
import { PROJECT_CATEGORIES, type ProjectCategory, type ProjectStatus } from "@/types";

/** One bar: a label, how many projects it covers, and which ones. */
export interface BarDatum<K extends string = string> {
  key: K;
  count: number;
  slugs: string[];
}

function tally<K extends string>(projects: ProjectCardData[], keysOf: (project: ProjectCardData) => K[]): BarDatum<K>[] {
  const groups = new Map<K, string[]>();
  for (const project of projects) {
    for (const key of new Set(keysOf(project))) {
      groups.set(key, [...(groups.get(key) ?? []), project.slug]);
    }
  }
  return [...groups.entries()]
    .map(([key, slugs]) => ({ key, count: slugs.length, slugs }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

/** Core technologies (each project's card stack), ranked by how many projects use them. */
export function stackRanking(projects: ProjectCardData[], limit = 8): BarDatum[] {
  return tally(projects, (project) => project.stack).slice(0, limit);
}

/** Projects per area. A project can sit in more than one, so the bars do not add up to the total. */
export function categoryCounts(projects: ProjectCardData[]): BarDatum<ProjectCategory>[] {
  const counts = tally(projects, (project) => project.categories);
  return PROJECT_CATEGORIES.flatMap((category) => counts.filter((item) => item.key === category)).sort(
    (a, b) => b.count - a.count
  );
}

export type TimelineColumn =
  | { kind: "month"; month: string; projects: ProjectCardData[] }
  /** A run of months with no projects, collapsed so the chart stays readable on a phone. */
  | { kind: "gap"; from: string; to: string };

const STATUS_ORDER: ProjectStatus[] = ["IN_PRODUCTION", "FINISHED", "IN_DEVELOPMENT"];

function nextMonth(month: string): string {
  const [year, index] = month.split("-").map(Number);
  return index === 12 ? `${year + 1}-01` : `${year}-${String(index + 1).padStart(2, "0")}`;
}

/** Projects by month (YYYY-MM), oldest first, with empty stretches collapsed into one gap column. */
export function timeline(projects: ProjectCardData[]): TimelineColumn[] {
  const byMonth = new Map<string, ProjectCardData[]>();
  for (const project of projects) {
    const month = project.date.slice(0, 7);
    byMonth.set(month, [...(byMonth.get(month) ?? []), project]);
  }
  const months = [...byMonth.keys()].sort();
  const columns: TimelineColumn[] = [];
  months.forEach((month, i) => {
    if (i > 0) {
      const from = nextMonth(months[i - 1]);
      if (from !== month) {
        let to = from;
        while (nextMonth(to) !== month) to = nextMonth(to);
        columns.push({ kind: "gap", from, to });
      }
    }
    const items = [...byMonth.get(month)!].sort(
      (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || a.title.localeCompare(b.title)
    );
    columns.push({ kind: "month", month, projects: items });
  });
  return columns;
}

/**
 * Figures quoted from the project write-ups. Each one names the project it comes from and is shown
 * only while that project is published, so the strip never cites something that is not on the site.
 */
export const PROOF_POINTS = [
  { slug: "openrct", value: 42, label: "proofFunctions" },
  { slug: "bazar-do-renascer", value: 22, label: "proofTests" },
  { slug: "bazar-do-renascer", value: 100, label: "proofLighthouse" },
] as const;
