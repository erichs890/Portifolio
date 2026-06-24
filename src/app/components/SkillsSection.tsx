"use client";

import { motion } from "framer-motion";
import { Code2, Layers, Server, Database, BarChart3, Wrench, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components";
import { useI18n } from "@/lib/i18n";

interface Category {
  title: string;
  color: string;
  icon: LucideIcon;
  techs: string[];
}

const categories: Category[] = [
  { title: "Core Dev", color: "#64ffda", icon: Code2, techs: ["Python", "JavaScript", "TypeScript", "HTML", "CSS"] },
  { title: "Frontend", color: "#60a5fa", icon: Layers, techs: ["React", "React Native", "Next.js", "Tailwind CSS"] },
  { title: "Backend & APIs", color: "#10B981", icon: Server, techs: ["Node.js", "REST APIs", "Prisma ORM"] },
  { title: "Database / Supabase", color: "#8B5CF6", icon: Database, techs: ["PostgreSQL", "SQL", "Supabase", "Row Level Security"] },
  { title: "Data & Analytics", color: "#F59E0B", icon: BarChart3, techs: ["Pandas", "Data Viz", "ETL", "KPIs & Reports"] },
  { title: "DevOps & Tools", color: "#F43F5E", icon: Wrench, techs: ["Git", "Vercel", "Docker", "CI/CD"] },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function SkillsSection() {
  const { t } = useI18n();

  return (
    <>
      <SectionHeader index="01" title={t("sectionTechStack")} subtitle={t("sectionTechStackSub")} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
              className="group surface-card border-gradient p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="grid place-items-center w-9 h-9 rounded-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}14`, border: `1px solid ${cat.color}2e` }}
                >
                  <Icon size={17} style={{ color: cat.color }} />
                </span>
                <h3
                  className="text-sm font-semibold font-mono uppercase tracking-wider"
                  style={{ color: cat.color }}
                >
                  {cat.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.techs.map((tech) => (
                  <span key={tech} className="chip">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
