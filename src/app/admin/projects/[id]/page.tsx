"use client";

import { useEffect, useState, use } from "react";
import { ProjectDTO } from "@/types";
import { ProjectForm } from "../ProjectForm";
import { LoadingSpinner } from "@/components";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  async function fetchProject() {
    try {
      const response = await fetch(`/api/admin/projects/${id}`);

      if (!response.ok) throw new Error("Projeto não encontrado");

      const data = await response.json();
      setProject(data.data);
    } catch (err) {
      setError("Erro ao carregar projeto");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Editar Projeto
      </h1>
      <ProjectForm project={project} />
    </div>
  );
}
