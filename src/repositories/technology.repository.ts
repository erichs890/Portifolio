import { prisma } from "@/lib/prisma";
import { TechnologyDTO, TechnologyInput } from "@/types";
import { generateSlug } from "@/utils/helpers";

export class TechnologyRepository {
  async findAll(): Promise<TechnologyDTO[]> {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: "asc" },
    });

    return technologies as TechnologyDTO[];
  }

  async findById(id: string): Promise<TechnologyDTO | null> {
    const technology = await prisma.technology.findUnique({
      where: { id },
    });

    return technology as TechnologyDTO | null;
  }

  async findBySlug(slug: string): Promise<TechnologyDTO | null> {
    const technology = await prisma.technology.findUnique({
      where: { slug },
    });

    return technology as TechnologyDTO | null;
  }

  async create(data: TechnologyInput): Promise<TechnologyDTO> {
    const slug = data.slug || generateSlug(data.name);

    const technology = await prisma.technology.create({
      data: {
        name: data.name,
        slug,
        color: data.color,
        icon: data.icon,
      },
    });

    return technology as TechnologyDTO;
  }

  async update(
    id: string,
    data: Partial<TechnologyInput>
  ): Promise<TechnologyDTO> {
    const technology = await prisma.technology.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color,
        icon: data.icon,
      },
    });

    return technology as TechnologyDTO;
  }

  async delete(id: string): Promise<void> {
    await prisma.technology.delete({
      where: { id },
    });
  }
}

export const technologyRepository = new TechnologyRepository();
