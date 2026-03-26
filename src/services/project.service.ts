import { projectRepository } from "@/repositories/project.repository";
import {
  ProjectDTO,
  CreateProjectDTO,
  UpdateProjectDTO,
  PaginatedResponse,
} from "@/types";
import { ApiError } from "@/utils/helpers";

export class ProjectService {
  async getAllProjects(
    page: number = 1,
    pageSize: number = 12,
    featured?: boolean,
    status?: string
  ): Promise<PaginatedResponse<ProjectDTO>> {
    const skip = (page - 1) * pageSize;

    const projects = await projectRepository.findAll(
      true,
      skip,
      pageSize
    );

    const total = await projectRepository.countTotal(true);

    return {
      data: projects,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getProjectBySlug(slug: string): Promise<ProjectDTO> {
    const project = await projectRepository.findPublishedBySlug(slug);

    if (!project) {
      throw new ApiError(404, "Projeto não encontrado");
    }

    return project;
  }

  async searchProjects(query: string): Promise<ProjectDTO[]> {
    const projects = await projectRepository.findAll(true);

    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getAdminProjects(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<ProjectDTO>> {
    const skip = (page - 1) * pageSize;

    const projects = await projectRepository.findAll(undefined, skip, pageSize);
    const total = await projectRepository.countTotal();

    return {
      data: projects,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getProjectById(id: string): Promise<ProjectDTO> {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new ApiError(404, "Projeto não encontrado");
    }

    return project;
  }

  async createProject(data: CreateProjectDTO): Promise<ProjectDTO> {
    if (!data.title || !data.description) {
      throw new ApiError(400, "Título e descrição são obrigatórios");
    }

    return projectRepository.create(data);
  }

  async updateProject(
    id: string,
    data: UpdateProjectDTO
  ): Promise<ProjectDTO> {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new ApiError(404, "Projeto não encontrado");
    }

    return projectRepository.update(id, data);
  }

  async deleteProject(id: string): Promise<void> {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new ApiError(404, "Projeto não encontrado");
    }

    await projectRepository.delete(id);
  }

  async toggleLike(id: string, liked: boolean): Promise<ProjectDTO> {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new ApiError(404, "Projeto não encontrado");
    }

    await projectRepository.toggleLike(id, liked);

    return projectRepository.findById(id) as Promise<ProjectDTO>;
  }
}

export const projectService = new ProjectService();
