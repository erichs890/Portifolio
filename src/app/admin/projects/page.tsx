"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectDTO } from "@/types";
import { Button, Modal, LoadingSpinner } from "@/components";
import toast from "react-hot-toast";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response = await fetch("/api/admin/projects");
      const data = await response.json();
      setProjects(data.data.data || []);
    } catch (error) {
      toast.error("Erro ao carregar projetos");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/projects/${projectToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Erro ao deletar projeto");
      }

      toast.success("Projeto deletado com sucesso!");
      setProjects(projects.filter((p) => p.id !== projectToDelete));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao deletar projeto");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Meus Projetos
        </h1>
        <Link href="/admin/projects/new">
          <Button variant="primary">Novo Projeto</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Nenhum projeto criado ainda.
          </p>
          <Link href="/admin/projects/new">
            <Button variant="primary">Criar Primeiro Projeto</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Publicado
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Visualizações
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {project.title}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === "IN_PRODUCTION"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : project.status === "IN_DEVELOPMENT"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {project.status === "IN_PRODUCTION"
                        ? "Produção"
                        : project.status === "IN_DEVELOPMENT"
                          ? "Desenvolvimento"
                          : "Finalizado"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {project.published ? (
                      <span className="text-green-600 dark:text-green-400">
                        Sim
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">
                        Não
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {project.viewsCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="secondary" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setProjectToDelete(project.id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        Deletar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteModalOpen(false);
                setProjectToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Deletar
            </Button>
          </>
        }
      >
        <p className="text-gray-700 dark:text-gray-300">
          Você tem certeza que deseja deletar este projeto? Esta ação não pode
          ser desfeita.
        </p>
      </Modal>
    </div>
  );
}
