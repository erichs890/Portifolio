"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  Server,
  BarChart3,
  Database,
  Code2,
} from "lucide-react";
import { SectionHeader } from "@/components";

const skills = [
  {
    icon: Code2,
    title: "Desenvolvimento de Software",
    description:
      "Desenvolvimento de soluções completas com Python, da automação à construção de sistemas robustos.",
    color: "#F43F5E",
    techs: ["Python"],
  },
  {
    icon: Monitor,
    title: "Frontend",
    description:
      "Interfaces responsivas com foco em performance e experiência do usuário, da web ao mobile.",
    color: "#3B82F6",
    techs: ["HTML", "CSS", "JavaScript", "React", "React Native"],
  },
  {
    icon: Server,
    title: "Backend",
    description:
      "APIs REST, autenticação, middlewares e arquitetura escalável.",
    color: "#10B981",
    techs: ["Node.js"],
  },
  {
    icon: Database,
    title: "Banco de Dados",
    description:
      "Modelagem relacional, queries otimizadas e backend-as-a-service.",
    color: "#8B5CF6",
    techs: ["SQL", "Supabase"],
  },
  {
    icon: BarChart3,
    title: "Análise de Dados",
    description:
      "Manipulação, limpeza e análise de dados para geração de insights e tomada de decisão.",
    color: "#F59E0B",
    techs: ["Pandas"],
  },
];

export function SkillsSection() {
  return (
    <>
      <SectionHeader
        title="Expertise"
        subtitle="Áreas de especialização com foco em soluções completas e orientadas a dados."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, index) => {
          const Icon = skill.icon;
          return (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-xl border border-slate-700/50 bg-navy-800/50 p-6 transition-all duration-300 hover:border-blue-500/20 hover:bg-navy-800"
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${skill.color}10` }}
                >
                  <Icon size={22} style={{ color: skill.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-50 mb-1">
                    {skill.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    {skill.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.techs.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
