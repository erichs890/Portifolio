"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ExternalLink, Code2 } from "lucide-react";
import { ProjectDTO } from "@/types";
import { TechBadge, SparklineChart, LoadingSpinner } from "@/components";
import { formatDate } from "@/utils/helpers";
import { useI18n } from "@/lib/i18n";

function generateSparklineData(viewsCount: number): number[] {
  const points = 12;
  const base = Math.max(viewsCount / points, 1);
  return Array.from({ length: points }, (_, i) => {
    const trend = (i / points) * base;
    const noise = (Math.sin(i * 2.5 + viewsCount) * 0.3 + 0.7) * base * 0.5;
    return Math.max(1, Math.round(trend + noise));
  });
}

const statusKeys: Record<string, { key: "statusInDev" | "statusInProd" | "statusFinished"; color: string }> = {
  IN_DEVELOPMENT: { key: "statusInDev", color: "#F59E0B" },
  IN_PRODUCTION: { key: "statusInProd", color: "#10B981" },
  FINISHED: { key: "statusFinished", color: "#64ffda" },
};

export function ProjectGrid() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/projects?pageSize=12");
      if (!response.ok) throw new Error("Erro ao carregar projetos");
      const data = await response.json();
      setProjects(data?.data?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }

  const { t, lang } = useI18n();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-400 font-mono text-sm">Error: {error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">{t("noProjects")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project, index) => {
        const statusInfo = statusKeys[project.status] || statusKeys.FINISHED;
        const status = { label: t(statusInfo.key), color: statusInfo.color };
        const sparkData = generateSparklineData(project.viewsCount);

        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Link href={`/projects/${project.slug}`} className="block hover:no-underline">
              <div className="group rounded-lg border border-navy-700/50 bg-navy-800/80 overflow-hidden transition-all duration-300 hover:border-accent-cyan/30 hover:shadow-[0_0_30px_rgba(100,255,218,0.07)]">
                {/* Cover Image */}
                {project.coverImage && (
                  <div className="relative overflow-hidden">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/20 to-transparent" />
                  </div>
                )}

                {/* Body */}
                <div className="p-5">
                  {/* Status & Role */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-xs font-mono" style={{ color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                    {project.projectRole === "CO_CREATOR" && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        {t("coCreator")}
                      </span>
                    )}
                    {project.projectRole === "COLLABORATOR" && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {t("collaborator")}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-text-heading mb-2 group-hover:text-accent-cyan transition-colors">
                    {lang === "en" && project.titleEn ? project.titleEn : project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                    {lang === "en" && project.descriptionEn ? project.descriptionEn : project.description}
                  </p>

                  {/* Sparkline */}
                  <div className="mb-4 opacity-40 group-hover:opacity-80 transition-opacity">
                    <SparklineChart data={sparkData} color={status.color} height={24} />
                  </div>

                  {/* Featured */}
                  {project.featured && (
                    <div className="flex items-center gap-1 text-accent-cyan text-xs font-mono mb-3">
                      <Star size={12} fill="currentColor" />
                      <span>{t("featured")}</span>
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <TechBadge key={tech.id} name={tech.name} color={tech.color} />
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono text-text-secondary bg-navy-900/50 border border-navy-700/30">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer: Date + Links */}
                  <div className="flex items-center justify-between pt-3 border-t border-navy-700/30">
                    <span className="text-xs font-mono text-text-muted">
                      {formatDate(project.createdAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      {project.repositoryUrl && (
                        <Code2 size={14} className="text-text-secondary hover:text-accent-cyan transition-colors" />
                      )}
                      {project.liveUrl && (
                        <ExternalLink size={14} className="text-text-secondary hover:text-accent-cyan transition-colors" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
