"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectDTO, CreateProjectDTO, PROJECT_CATEGORIES, type ProjectCategory } from "@/types";
import { Input, Textarea, Select, Button, Modal } from "@/components";
import toast from "react-hot-toast";

interface ProjectFormProps {
  project?: ProjectDTO;
  isLoading?: boolean;
}

export function ProjectForm({ project, isLoading: externalIsLoading }: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [techInput, setTechInput] = useState<string>(
    project?.technologies.map((t) => t.name).join(", ") || ""
  );
  // Showcase fields are edited as plain text and split on save: one highlight per line, stack by comma.
  const [highlightsText, setHighlightsText] = useState((project?.highlights ?? []).join("\n"));
  const [highlightsEnText, setHighlightsEnText] = useState((project?.highlightsEn ?? []).join("\n"));
  const [orderText, setOrderText] = useState(String(project?.order ?? 0));
  const [stackText, setStackText] = useState((project?.featuredStack ?? []).join(", "));
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<CreateProjectDTO>({
    title: project?.title || "",
    titleEn: project?.titleEn || "",
    description: project?.description || "",
    descriptionEn: project?.descriptionEn || "",
    longDescription: project?.longDescription || "",
    longDescriptionEn: project?.longDescriptionEn || "",
    summary: project?.summary || "",
    summaryEn: project?.summaryEn || "",
    categories: project?.categories ?? [],
    projectDate: project?.projectDate ? new Date(project.projectDate).toISOString().slice(0, 10) : "",
    coverImage: project?.coverImage || "",
    images: project?.images ?? [],
    repositoryUrl: project?.repositoryUrl || "",
    liveUrl: project?.liveUrl || "",
    status: project?.status || "IN_DEVELOPMENT",
    projectRole: project?.projectRole || "CREATOR",
    featured: project?.featured || false,
    published: project?.published !== false,
    technologies: [],
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploadingImage(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Erro no upload: ${response.status}`);
      }

      if (!data.data?.url) {
        throw new Error("URL da imagem não retornada");
      }

      setFormData((prev) => ({ ...prev, coverImage: data.data.url }));
      toast.success("Imagem enviada com sucesso!");
      setShowImageModal(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao fazer upload da imagem";
      toast.error(message);
    } finally {
      setUploadingImage(false);
    }
  };

  /** Uploads each picked file and appends it to the project gallery. */
  const uploadGallery = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploadingImage(true);
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body });
        const data = await response.json();
        if (!response.ok || !data.data?.url) throw new Error(data.error || "Erro no upload");
        setFormData((prev) => ({ ...prev, images: [...(prev.images ?? []), data.data.url] }));
      }
      toast.success("Galeria atualizada. Salve o projeto para gravar.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar imagem");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadImage(file);
    } else {
      toast.error("Por favor, arraste uma imagem válida");
    }
  };

  async function resolveTechNames(names: string[]): Promise<string[]> {
    const ids: string[] = [];
    for (const name of names) {
      try {
        // Try to find existing tech
        const searchRes = await fetch("/api/technologies");
        const searchData = await searchRes.json();
        const techs = searchData.data || [];
        const existing = techs.find(
          (t: { name: string }) => t.name.toLowerCase() === name.toLowerCase()
        );

        if (existing) {
          ids.push(existing.id);
        } else {
          // Create new tech
          const createRes = await fetch("/api/technologies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          });
          const createData = await createRes.json();
          if (createData.data?.id) {
            ids.push(createData.data.id);
          }
        }
      } catch {
        // Skip failed techs
      }
    }
    return ids;
  }

  const splitList = (text: string, separator: string, max: number) =>
    text
      .split(separator)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, max);

  const toggleCategory = (category: ProjectCategory) => {
    const current = formData.categories ?? [];
    setFormData({
      ...formData,
      categories: current.includes(category) ? current.filter((c) => c !== category) : [...current, category],
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Parse tech names from input
      const techNames = techInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const techIds = await resolveTechNames(techNames);

      const method = project ? "PUT" : "POST";
      const url = project ? `/api/admin/projects/${project.id}` : "/api/admin/projects";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projectDate: formData.projectDate || null,
          order: Number.parseInt(orderText, 10) || 0,
          highlights: splitList(highlightsText, "\n", 3),
          highlightsEn: splitList(highlightsEnText, "\n", 3),
          featuredStack: splitList(stackText, ",", 5),
          technologies: techIds,
        }),
      });

      if (!response.ok) throw new Error("Erro na requisição");

      toast.success(
        project ? "Projeto atualizado com sucesso!" : "Projeto criado com sucesso!"
      );
      router.push("/admin/projects");
    } catch {
      toast.error("Erro ao salvar projeto");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteProject = async () => {
    if (!project?.id) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "Erro ao deletar projeto");
      }
      toast.success("Projeto deletado com sucesso!");
      setShowDeleteModal(false);
      router.push("/admin/projects");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao deletar projeto");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Informações Básicas */}
      <div className="bg-navy-800 border border-slate-700/50 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6 text-slate-50">
          Informações Básicas
        </h2>
        <div className="space-y-4">
          <Input
            label="Título (PT)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            containerClassName="space-y-2"
          />
          <Input
            label="Title (EN)"
            value={formData.titleEn}
            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
            placeholder="English title (optional)"
            containerClassName="space-y-2"
          />
          <Textarea
            label="Descrição Curta (PT)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            containerClassName="space-y-2"
          />
          <Textarea
            label="Short Description (EN)"
            value={formData.descriptionEn}
            onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
            placeholder="English description (optional)"
            containerClassName="space-y-2"
          />
          <Textarea
            label="Descrição Longa (PT - Markdown)"
            value={formData.longDescription}
            onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
            containerClassName="space-y-2"
          />
          <Textarea
            label="Long Description (EN - Markdown)"
            value={formData.longDescriptionEn}
            onChange={(e) => setFormData({ ...formData, longDescriptionEn: e.target.value })}
            placeholder="English long description (optional)"
            containerClassName="space-y-2"
          />
        </div>
      </div>

      {/* Vitrine: o que aparece nos cards da home */}
      <div className="bg-navy-800 border border-slate-700/50 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-2 text-slate-50">Vitrine</h2>
        <p className="text-sm text-text-secondary mb-6">
          Texto dos cards da home. Sem resumo, o card usa a primeira frase da descrição curta.
        </p>
        <div className="space-y-4">
          <Textarea
            label="Resumo do card (PT, até 220 caracteres)"
            value={formData.summary}
            maxLength={220}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            containerClassName="space-y-2"
          />
          <Textarea
            label="Card summary (EN, up to 220 characters)"
            value={formData.summaryEn}
            maxLength={220}
            onChange={(e) => setFormData({ ...formData, summaryEn: e.target.value })}
            containerClassName="space-y-2"
          />
          <Textarea
            label="Destaques técnicos (PT, um por linha, até 3)"
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            containerClassName="space-y-2"
          />
          <Textarea
            label="Technical highlights (EN, one per line, up to 3)"
            value={highlightsEnText}
            onChange={(e) => setHighlightsEnText(e.target.value)}
            containerClassName="space-y-2"
          />
          <Input
            label="Stack do card (até 5, separadas por vírgula)"
            value={stackText}
            onChange={(e) => setStackText(e.target.value)}
            placeholder="Next.js, TypeScript, Supabase"
            containerClassName="space-y-2"
          />
          <fieldset>
            <legend className="block text-sm font-medium text-text-primary mb-2">Categorias</legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {PROJECT_CATEGORIES.map((category) => (
                <label key={category} className="inline-flex items-center gap-2 min-h-11 text-sm text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.categories ?? []).includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </fieldset>
          <Input
            label="Ordem (menor aparece primeiro; iguais ficam do mais novo ao mais antigo)"
            type="number"
            step={1}
            value={orderText}
            onChange={(e) => setOrderText(e.target.value)}
            containerClassName="space-y-2"
          />
          <Input
            label="Data do projeto (vazio = data de cadastro)"
            type="date"
            value={formData.projectDate ?? ""}
            onChange={(e) => setFormData({ ...formData, projectDate: e.target.value })}
            containerClassName="space-y-2"
          />
        </div>
      </div>

      {/* URLs e Links */}
      <div className="bg-navy-800 border border-slate-700/50 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6 text-slate-50">
          URLs e Links
        </h2>
        <div className="space-y-4">
          <Input
            label="URL do Repositório"
            type="url"
            value={formData.repositoryUrl}
            onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
            containerClassName="space-y-2"
          />
          <Input
            label="URL do Deploy"
            type="url"
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            containerClassName="space-y-2"
          />
        </div>
      </div>

      {/* Galeria */}
      <div className="bg-navy-800 border border-slate-700/50 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-2 text-slate-50">Galeria</h2>
        <p className="text-sm text-text-secondary mb-6">
          Capturas extras da página do projeto (até 12). Prefira imagens em 16:10.
        </p>
        {(formData.images ?? []).length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {(formData.images ?? []).map((src, index) => (
              <li key={src} className="relative rounded-lg overflow-hidden border border-line">
                <img src={src} alt={`Imagem ${index + 1} da galeria`} className="w-full aspect-[16/10] object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, images: (formData.images ?? []).filter((item) => item !== src) })}
                  className="absolute top-1.5 right-1.5 min-h-11 px-3 rounded-md bg-black/70 text-white text-xs font-medium cursor-pointer"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
        <label className="inline-flex items-center min-h-11 px-4 rounded-lg border border-line-strong text-sm font-medium text-text-heading cursor-pointer">
          {uploadingImage ? "Enviando..." : "Adicionar imagens"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={uploadingImage || (formData.images ?? []).length >= 12}
            onChange={(e) => {
              uploadGallery(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {/* Imagem e Status */}
      <div className="bg-navy-800 border border-slate-700/50 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6 text-slate-50">
          Imagem e Status
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Imagem de Capa
            </label>
            {formData.coverImage && (
              <div className="mb-4">
                <img src={formData.coverImage} alt="Preview" className="w-full object-contain rounded-lg" />
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              <Button type="button" variant="secondary" onClick={() => setShowImageModal(true)}>
                {formData.coverImage ? "Trocar Imagem" : "Upload de Imagem"}
              </Button>
              {formData.coverImage && (
                <Button type="button" variant="danger" onClick={() => setFormData({ ...formData, coverImage: "" })}>
                  Remover
                </Button>
              )}
            </div>
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: "IN_DEVELOPMENT", label: "Em Desenvolvimento" },
              { value: "IN_PRODUCTION", label: "Em Produção" },
              { value: "FINISHED", label: "Finalizado" },
            ]}
            containerClassName="space-y-2"
          />

          <Select
            label="Papel no Projeto"
            value={formData.projectRole}
            onChange={(e) => setFormData({ ...formData, projectRole: e.target.value as any })}
            options={[
              { value: "CREATOR", label: "Criador" },
              { value: "CO_CREATOR", label: "Co-Criador" },
              { value: "COLLABORATOR", label: "Colaborador" },
            ]}
            containerClassName="space-y-2"
          />

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span className="text-slate-300">Destacar este projeto</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              <span className="text-slate-300">Publicar</span>
            </label>
          </div>
        </div>
      </div>

      {/* Tecnologias */}
      <div className="bg-navy-800 border border-slate-700/50 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6 text-slate-50">
          Tecnologias
        </h2>
        <Input
          label="Digite as tecnologias separadas por vírgula"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          placeholder="React, Node.js, PostgreSQL"
          containerClassName="space-y-2"
        />
        {techInput && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {techInput.split(",").map((t) => t.trim()).filter(Boolean).map((tech) => (
              <span
                key={tech}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button type="submit" isLoading={isLoading || externalIsLoading} variant="primary">
          {project ? "Atualizar Projeto" : "Criar Projeto"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        {project && (
          <Button type="button" variant="danger" onClick={() => setShowDeleteModal(true)}>
            Deletar Projeto
          </Button>
        )}
      </div>

      {/* Image Upload Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Imagem de Capa"
        footer={<Button variant="secondary" onClick={() => setShowImageModal(false)}>Fechar</Button>}
      >
        <div className="space-y-6">
          <div
            tabIndex={0}
            onPaste={(e) => {
              const items = e.clipboardData?.items;
              if (!items) return;
              for (const item of Array.from(items)) {
                if (item.type.startsWith("image/")) {
                  const file = item.getAsFile();
                  if (file) { uploadImage(file); return; }
                }
              }
              toast.error("Nenhuma imagem encontrada na área de transferência");
            }}
            className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer focus:border-blue-500 focus:outline-none transition-colors hover:border-slate-500"
          >
            <div className="flex flex-col items-center gap-2">
              <p className="text-slate-300 font-medium text-sm">Clique aqui e pressione Ctrl+V para colar a imagem</p>
              <p className="text-xs text-slate-500">Aceita screenshots e imagens copiadas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-sm text-slate-500">ou</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-500/10" : "border-slate-600"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <p className="text-slate-300 font-medium text-sm">Arraste a imagem aqui ou selecione um arquivo</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" id="image-input" />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={uploadingImage}
                onClick={(e) => { e.preventDefault(); document.getElementById("image-input")?.click(); }}
              >
                {uploadingImage ? "Enviando..." : "Selecionar Arquivo"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDeleteProject}>Deletar</Button>
          </>
        }
      >
        <p className="text-slate-300">
          Você tem certeza que deseja deletar este projeto? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </form>
  );
}
