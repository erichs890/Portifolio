import { Metadata } from "next";
import Link from "next/link";
import { projectService } from "@/services/project.service";
import { Button } from "@/components";
import { ProjectDetailClient } from "./ProjectDetailClient";

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
    return { title: "Project not found" };
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  try {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);

    return <ProjectDetailClient project={project} />;
  } catch {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-heading mb-4">Project not found</h1>
          <p className="text-text-secondary mb-8">The project you are looking for does not exist.</p>
          <Link href="/">
            <Button variant="primary">Back to projects</Button>
          </Link>
        </div>
      </div>
    );
  }
}
