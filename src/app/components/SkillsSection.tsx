"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components";
import { useI18n } from "@/lib/i18n";

const categories = [
  {
    title: "Core Dev",
    color: "#64ffda",
    techs: ["Python", "JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    title: "Frontend",
    color: "#60a5fa",
    techs: ["React", "React Native", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Backend & APIs",
    color: "#10B981",
    techs: ["Node.js", "REST APIs", "Prisma ORM"],
  },
  {
    title: "Database / Supabase",
    color: "#8B5CF6",
    techs: ["PostgreSQL", "SQL", "Supabase", "Row Level Security"],
  },
  {
    title: "Data & Analytics",
    color: "#F59E0B",
    techs: ["Pandas", "Data Viz", "ETL", "KPIs & Reports"],
  },
  {
    title: "DevOps & Tools",
    color: "#F43F5E",
    techs: ["Git", "Vercel", "Docker", "CI/CD"],
  },
];

export function SkillsSection() {
  const { t } = useI18n();

  return (
    <>
      <SectionHeader
        title={t("sectionTechStack")}
        subtitle={t("sectionTechStackSub")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="rounded-lg border border-navy-700/50 bg-navy-800/50 p-5 transition-all duration-300 hover:border-accent-cyan/20 hover:bg-navy-800"
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <h3
                className="text-sm font-semibold font-mono uppercase tracking-wider"
                style={{ color: cat.color }}
              >
                {cat.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.techs.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2.5 py-1 rounded bg-navy-900/80 text-text-primary border border-navy-700/50 hover:border-accent-cyan/30 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
