import {
  siCss,
  siDocker,
  siGit,
  siGithubactions,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siPandas,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons";
import type { TranslationKey } from "@/lib/i18n";
import type { ProjectDTO } from "@/types";

export interface StackItem {
  name: string;
  /** SVG path from Simple Icons (CC0), drawn in the text colour. Skills without a logo have none. */
  icon?: string;
  /** Other spellings used in project records, so usage counts find them. */
  aliases?: string[];
}

export interface StackGroup {
  id: string;
  label: TranslationKey;
  items: StackItem[];
}

export const STACK_GROUPS: StackGroup[] = [
  {
    id: "core",
    label: "techCoreDev",
    items: [
      { name: "Python", icon: siPython.path },
      { name: "TypeScript", icon: siTypescript.path },
      { name: "JavaScript", icon: siJavascript.path },
      { name: "HTML", icon: siHtml5.path },
      { name: "CSS", icon: siCss.path },
    ],
  },
  {
    id: "frontend",
    label: "techFrontend",
    items: [
      { name: "React", icon: siReact.path },
      { name: "React Native", icon: siReact.path },
      { name: "Next.js", icon: siNextdotjs.path },
      { name: "Tailwind CSS", icon: siTailwindcss.path },
    ],
  },
  {
    id: "backend",
    label: "techBackend",
    items: [
      { name: "Node.js", icon: siNodedotjs.path },
      { name: "REST APIs", aliases: ["REST API"] },
      { name: "Prisma ORM", icon: siPrisma.path, aliases: ["Prisma"] },
    ],
  },
  {
    id: "database",
    label: "techDatabase",
    items: [
      { name: "PostgreSQL", icon: siPostgresql.path },
      { name: "SQL" },
      { name: "Supabase", icon: siSupabase.path },
      { name: "Row Level Security", aliases: ["Row-Level Security", "RLS"] },
    ],
  },
  {
    id: "data",
    label: "techData",
    items: [{ name: "Pandas", icon: siPandas.path }, { name: "Data Viz" }, { name: "ETL" }, { name: "KPIs & Reports" }],
  },
  {
    id: "devops",
    label: "techDevops",
    items: [
      { name: "Git", icon: siGit.path },
      { name: "Vercel", icon: siVercel.path },
      { name: "Docker", icon: siDocker.path },
      { name: "CI/CD", icon: siGithubactions.path, aliases: ["GitHub Actions"] },
    ],
  },
];

/** "React 19", "TailwindCSS v4", "Supabase (PostgreSQL, Auth)" → "react", "tailwindcss", "supabase". */
export function normalizeTech(name: string): string {
  return name
    .replace(/\(.*$/, "")
    .replace(/\bv?\d+(\.\d+)*\b/g, "")
    .toLowerCase()
    .replace(/[^a-z+#]/g, "");
}

/** How many published projects list each stack item among their technologies. */
export function techUsage(projects: ProjectDTO[]): Record<string, number> {
  const perProject = projects.map((project) => new Set(project.technologies.map((tech) => normalizeTech(tech.name))));
  const usage: Record<string, number> = {};
  for (const group of STACK_GROUPS) {
    for (const item of group.items) {
      const names = [item.name, ...(item.aliases ?? [])].map(normalizeTech);
      usage[item.name] = perProject.filter((techs) => names.some((name) => techs.has(name))).length;
    }
  }
  return usage;
}
