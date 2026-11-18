import { prisma } from "@/lib/prisma";
import { ProjectDTO, CreateProjectDTO, UpdateProjectDTO } from "@/types";
import { generateSlug } from "@/utils/helpers";

export class ProjectRepository {
  async findAll(
    published?: boolean,
    skip?: number,
    take?: number
  ): Promise<ProjectDTO[]> {
    const projects = await prisma.project.findMany({
      where: published !== undefined ? { published } : {},
      include: { technologies: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take,
    });

    return projects as ProjectDTO[];
  }

  async findById(id: string): Promise<ProjectDTO | null> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { technologies: true },
    });

    return project as ProjectDTO | null;
  }

  async findBySlug(slug: string): Promise<ProjectDTO | null> {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: { technologies: true },
    });

    return project as ProjectDTO | null;
  }

  async findPublishedBySlug(slug: string): Promise<ProjectDTO | null> {
    const project = await prisma.project.findUnique({
      where: { slug, published: true },
      include: { technologies: true },
    });

    return project as ProjectDTO | null;
  }

  async create(data: CreateProjectDTO): Promise<ProjectDTO> {
    const slug = generateSlug(data.title);

    const project = await prisma.project.create({
      data: {
        title: data.title,
        titleEn: data.titleEn,
        slug,
        description: data.description,
        descriptionEn: data.descriptionEn,
        longDescription: data.longDescription,
        longDescriptionEn: data.longDescriptionEn,
        summary: data.summary,
        summaryEn: data.summaryEn,
        highlights: data.highlights,
        highlightsEn: data.highlightsEn,
        categories: data.categories,
        featuredStack: data.featuredStack,
        projectDate: data.projectDate ? new Date(data.projectDate) : data.projectDate,
        coverImage: data.coverImage,
        images: data.images,
        repositoryUrl: data.repositoryUrl,
        liveUrl: data.liveUrl,
        status: data.status || "IN_DEVELOPMENT",
        projectRole: data.projectRole || "CREATOR",
        featured: data.featured || false,
        order: data.order ?? 0,
        published: data.published !== false,
        technologies: data.technologies
          ? {
              connect: data.technologies.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { technologies: true },
    });

    return project as ProjectDTO;
  }

  async update(id: string, data: UpdateProjectDTO): Promise<ProjectDTO> {
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        titleEn: data.titleEn,
        description: data.description,
        descriptionEn: data.descriptionEn,
        longDescription: data.longDescription,
        longDescriptionEn: data.longDescriptionEn,
        summary: data.summary,
        summaryEn: data.summaryEn,
        highlights: data.highlights,
        highlightsEn: data.highlightsEn,
        categories: data.categories,
        featuredStack: data.featuredStack,
        projectDate: data.projectDate ? new Date(data.projectDate) : data.projectDate,
        coverImage: data.coverImage,
        images: data.images,
        repositoryUrl: data.repositoryUrl,
        liveUrl: data.liveUrl,
        status: data.status,
        projectRole: data.projectRole,
        featured: data.featured,
        published: data.published,
        order: data.order,
        technologies: data.technologies
          ? {
              set: [],
              connect: data.technologies.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { technologies: true },
    });

    return project as ProjectDTO;
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({
      where: { id },
    });
  }

  async incrementViews(id: string): Promise<void> {
    await prisma.project.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });
  }

  async toggleLike(id: string, liked: boolean): Promise<void> {
    await prisma.project.update({
      where: { id },
      data: { likesCount: { increment: liked ? 1 : -1 } },
    });
  }

  async countTotal(published?: boolean): Promise<number> {
    return prisma.project.count({
      where: published !== undefined ? { published } : {},
    });
  }
}

export const projectRepository = new ProjectRepository();
