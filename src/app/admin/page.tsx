"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectDTO } from "@/types";
import { Button, LoadingSpinner } from "@/components";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response = await fetch("/api/admin/projects");
      const data = await response.json();
      setProjects(data.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.published).length;
  const featuredProjects = projects.filter((p) => p.featured).length;
  const totalViews = projects.reduce((sum, p) => sum + p.viewsCount, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Total de Projetos
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {totalProjects}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Publicados
          </p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {publishedProjects}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Destaques
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {featuredProjects}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Visualizações
          </p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {totalViews}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Ações Rápidas
        </h2>
        <Link href="/admin/projects/new">
          <Button variant="primary">Criar Novo Projeto</Button>
        </Link>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Projetos Recentes
        </h2>
        {projects.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            Nenhum projeto ainda. Crie um novo para começar.
          </p>
        ) : (
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {project.description}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button variant="secondary" size="sm">
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
