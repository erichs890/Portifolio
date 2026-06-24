"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ExternalLink, Code2 } from "lucide-react";
import { ProjectDTO } from "@/types";
import { TechBadge, SparklineChart } from "@/components";
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="surface-card overflow-hidden animate-pulse">
            <div className="h-44 bg-navy-700/30" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-24 bg-navy-700/40 rounded" />
              <div className="h-5 w-3/4 bg-navy-700/40 rounded" />
              <div className="h-3 w-full bg-navy-700/30 rounded" />
              <div className="h-3 w-5/6 bg-navy-700/30 rounded" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-navy-700/30 rounded-md" />
                <div className="h-6 w-16 bg-navy-700/30 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`/projects/${project.slug}`} className="block hover:no-underline h-full">
              <div className="group surface-card border-gradient h-full flex flex-col overflow-hidden">
                {/* Cover Image */}
                {project.coverImage && (
                  <div className="relative overflow-hidden">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-44 object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/30 to-transparent" />
                    {/* status pill over image */}
                    <span
                      className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono backdrop-blur-md bg-navy-950/60 border"
                      style={{ color: status.color, borderColor: `${status.color}3a` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                      {status.label}
                    </span>
                  </div>
                )}

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Status (no image) + Role + Featured */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {!project.coverImage && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono" style={{ color: status.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                        {status.label}
                      </span>
                    )}
                    {project.projectRole === "CO_CREATOR" && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        {t("coCreator")}
                      </span>
                    )}
                    {project.projectRole === "COLLABORATOR" && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {t("collaborator")}
                      </span>
                    )}
                    {project.featured && (
                      <span className="ml-auto inline-flex items-center gap-1 text-accent-amber text-[10px] font-mono">
                        <Star size={11} fill="currentColor" />
                        {t("featured")}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-semibold text-text-heading mb-2 group-hover:text-accent-cyan transition-colors duration-300">
                    {lang === "en" && project.titleEn ? project.titleEn : project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                    {lang === "en" && project.descriptionEn ? project.descriptionEn : project.description}
                  </p>

                  {/* Sparkline */}
                  <div className="mb-4 opacity-50 group-hover:opacity-90 transition-opacity duration-300">
                    <SparklineChart data={sparkData} color={status.color} height={24} />
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <TechBadge key={tech.id} name={tech.name} color={tech.color} />
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono text-text-secondary bg-navy-950/50 border border-white/5">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer: Date + Links */}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-xs font-mono text-text-muted">
                      {formatDate(project.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-cyan opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      {project.liveUrl && <ExternalLink size={13} />}
                      {project.repositoryUrl && <Code2 size={13} />}
                      <span>→</span>
                    </span>
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
