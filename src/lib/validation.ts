import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const CreateProjectSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres").max(200),
  description: z
    .string()
    .min(10, "Descrição deve ter no mínimo 10 caracteres")
    .max(2000),
  longDescription: z.string().max(5000).optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  repositoryUrl: z.string().optional().or(z.literal("")),
  liveUrl: z.string().optional().or(z.literal("")),
  status: z.enum(["IN_DEVELOPMENT", "IN_PRODUCTION", "FINISHED"]).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  technologies: z.array(z.string()).optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  order: z.number().int().optional(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export const TechnologySchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(50),
  slug: z.string().min(2).max(50).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().optional(),
});

export type TechnologyInput = z.infer<typeof TechnologySchema>;
