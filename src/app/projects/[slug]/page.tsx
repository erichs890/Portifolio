import { Metadata } from "next";
import Link from "next/link";
import { projectService } from "@/services/project.service";
import { Button, Badge, TechBadge } from "@/components";
import { formatDate } from "@/utils/helpers";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink, Code2, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);
    return {
      title: `${project.title} | ELS Portfolio`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.coverImage ? [project.coverImage] : [],
      },
    };
  } catch {
    return { title: "Projeto não encontrado" };
  }
}

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "primary" }> = {
  IN_DEVELOPMENT: { label: "Em Desenvolvimento", variant: "warning" },
  IN_PRODUCTION: { label: "Em Produção", variant: "success" },
  FINISHED: { label: "Finalizado", variant: "primary" },
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  try {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);
    const status = statusConfig[project.status] || statusConfig.FINISHED;

    return (
      <div className="min-h-screen">
        <section className="py-12 md:py-20 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-950/95" />

          <div className="container relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan text-sm font-mono mb-8 transition-colors hover:no-underline"
            >
              <ArrowLeft size={14} />
              cd ../projetos
            </Link>

            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={status.variant}>{status.label}</Badge>
                {project.featured && <Badge variant="primary">featured</Badge>}
                {project.projectRole === "COLLABORATOR" && (
                  <Badge variant="warning">colaborador</Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-text-heading">
                {project.title}
              </h1>

              <p className="text-lg text-text-secondary mb-8 max-w-3xl">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-text-secondary font-mono">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.map((tech) => (
                  <TechBadge key={tech.id} name={tech.name} color={tech.color} />
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {project.repositoryUrl && (
                  <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="md">
                      <span className="inline-flex items-center gap-2">
                        <Code2 size={14} />
                        Repositório
                      </span>
                    </Button>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="md">
                      <span className="inline-flex items-center gap-2">
                        <ExternalLink size={14} />
                        Ver Deploy
                      </span>
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {project.coverImage && (
          <section className="py-8 md:py-12">
            <div className="container">
              <div className="relative rounded-lg overflow-hidden border border-navy-700/50">
                <img src={project.coverImage} alt={project.title} className="w-full object-contain" />
              </div>
            </div>
          </section>
        )}

        {project.longDescription && (
          <section className="py-12 md:py-16">
            <div className="container max-w-3xl">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{project.longDescription}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {project.images.length > 0 && (
          <section className="py-12 md:py-16 border-t border-navy-700/30">
            <div className="container">
              <h2 className="text-2xl font-bold mb-8 text-text-heading">
                <span className="text-accent-cyan font-mono font-normal text-lg mr-2">//</span>
                Galeria
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden border border-navy-700/50 group">
                    <img
                      src={image}
                      alt={`${project.title} - ${index + 1}`}
                      className="w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  } catch {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-heading mb-4">Projeto não encontrado</h1>
          <p className="text-text-secondary mb-8">O projeto que você procura não existe.</p>
          <Link href="/">
            <Button variant="primary">Voltar aos projetos</Button>
          </Link>
        </div>
      </div>
    );
  }
}
