import { technologyRepository } from "@/repositories/technology.repository";
import { TechnologyDTO, TechnologyInput } from "@/types";
import { ApiError } from "@/utils/helpers";

export class TechnologyService {
  async getAllTechnologies(): Promise<TechnologyDTO[]> {
    return technologyRepository.findAll();
  }

  async getTechnologyById(id: string): Promise<TechnologyDTO> {
    const technology = await technologyRepository.findById(id);

    if (!technology) {
      throw new ApiError(404, "Tecnologia não encontrada");
    }

    return technology;
  }

  async createTechnology(data: TechnologyInput): Promise<TechnologyDTO> {
    if (!data.name) {
      throw new ApiError(400, "Nome da tecnologia é obrigatório");
    }

    return technologyRepository.create(data);
  }

  async updateTechnology(
    id: string,
    data: Partial<TechnologyInput>
  ): Promise<TechnologyDTO> {
    const technology = await technologyRepository.findById(id);

    if (!technology) {
      throw new ApiError(404, "Tecnologia não encontrada");
    }

    return technologyRepository.update(id, data);
  }

  async deleteTechnology(id: string): Promise<void> {
    const technology = await technologyRepository.findById(id);

    if (!technology) {
      throw new ApiError(404, "Tecnologia não encontrada");
    }

    await technologyRepository.delete(id);
  }
}

export const technologyService = new TechnologyService();
