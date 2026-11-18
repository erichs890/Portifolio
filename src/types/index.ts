export type Role = "ADMIN" | "VIEWER";

export type ProjectStatus = "IN_DEVELOPMENT" | "IN_PRODUCTION" | "FINISHED";

export type ProjectRole = "CREATOR" | "CO_CREATOR" | "COLLABORATOR";

export const PROJECT_CATEGORIES = ["WEB", "MOBILE", "DATA", "AI", "SECURITY", "SYSTEMS"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

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
  /** One or two lines that fit a card without truncation. */
  summary: string | null;
  summaryEn: string | null;
  /** Up to three technical highlights, shown on featured projects. */
  highlights: string[];
  highlightsEn: string[];
  categories: ProjectCategory[];
  /** The four or five technologies worth showing on a card; the full list stays on the project page. */
  featuredStack: string[];
  /** When the project happened; falls back to createdAt (the day the record was added). */
  projectDate: Date | null;
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
  summary?: string;
  summaryEn?: string;
  highlights?: string[];
  highlightsEn?: string[];
  categories?: ProjectCategory[];
  featuredStack?: string[];
  projectDate?: string | null;
  order?: number;
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
  summary?: string;
  summaryEn?: string;
  highlights?: string[];
  highlightsEn?: string[];
  categories?: ProjectCategory[];
  featuredStack?: string[];
  projectDate?: string | null;
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
