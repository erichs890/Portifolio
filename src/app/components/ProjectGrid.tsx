"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ProjectDTO } from "@/types";
import { TechBadge, SparklineChart, LoadingSpinner } from "@/components";
import { formatDate } from "@/utils/helpers";

function generateSparklineData(viewsCount: number): number[] {
  const points = 12;
  const base = Math.max(viewsCount / points, 1);
  return Array.from({ length: points }, (_, i) => {
    const trend = (i / points) * base;
    const noise = (Math.sin(i * 2.5 + viewsCount) * 0.3 + 0.7) * base * 0.5;
    return Math.max(1, Math.round(trend + noise));
  });
}

const statusConfig: Record<string, { label: string; color: string }> = {
  IN_DEVELOPMENT: { label: "Em Desenvolvimento", color: "#F59E0B" },
  IN_PRODUCTION: { label: "Em Produção", color: "#10B981" },
  FINISHED: { label: "Finalizado", color: "#8B5CF6" },
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

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-400">Erro: {error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Nenhum projeto disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project, index) => {
        const status = statusConfig[project.status] || statusConfig.FINISHED;
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
              <div className="group rounded-xl border border-slate-700/50 bg-navy-800/80 overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:scale-[1.01]">
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
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-xs font-medium" style={{ color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                    {project.projectRole === "COLLABORATOR" && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Colaborador
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-slate-50 mb-1 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* Metrics Row */}
                  {project.featured && (
                    <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
                      <Star size={13} fill="currentColor" />
                      <span>Destaque</span>
                    </div>
                  )}

                  {/* Sparkline */}
                  <div className="mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
                    <SparklineChart data={sparkData} color={status.color} height={28} />
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <TechBadge
                        key={tech.id}
                        name={tech.name}
                        color={tech.color}
                      />
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs text-slate-500 bg-slate-800/50 border border-slate-700/30">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-xs text-slate-600">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
