export type Role = "ADMIN" | "VIEWER";

export type ProjectStatus = "IN_DEVELOPMENT" | "IN_PRODUCTION" | "FINISHED";

export type ProjectRole = "CREATOR" | "CO_CREATOR" | "COLLABORATOR";

export interface UserDTO {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnologyDTO {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechnologyInput {
  name: string;
  slug?: string;
  color?: string;
  icon?: string;
}

export interface ProjectDTO {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string;
  description: string;
  descriptionEn: string | null;
  longDescription: string | null;
  longDescriptionEn: string | null;
  coverImage: string | null;
  images: string[];
  repositoryUrl: string | null;
  liveUrl: string | null;
  status: ProjectStatus;
  projectRole: ProjectRole;
  featured: boolean;
  published: boolean;
  order: number;
  viewsCount: number;
  likesCount: number;
  technologies: TechnologyDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDTO {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  longDescription?: string;
  longDescriptionEn?: string;
  coverImage?: string;
  images?: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  status?: ProjectStatus;
  projectRole?: ProjectRole;
  featured?: boolean;
  published?: boolean;
  technologies?: string[]; // technology IDs
}

export interface UpdateProjectDTO {
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  longDescription?: string;
  longDescriptionEn?: string;
  coverImage?: string;
  images?: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  status?: ProjectStatus;
  projectRole?: ProjectRole;
  featured?: boolean;
  published?: boolean;
  order?: number;
  technologies?: string[]; // technology IDs
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
