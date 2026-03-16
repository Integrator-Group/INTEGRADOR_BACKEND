import { CantonsRepository } from '../repositories/cantonsRepository';
import { Canton, CantonCreate, CantonUpdate } from '../models/Cantons';

export class CantonsService {
  private readonly cantonsRepository: CantonsRepository;

  constructor() {
    this.cantonsRepository = new CantonsRepository();
  }

  async getAllCantons(): Promise<Canton[]> {
    return this.cantonsRepository.findAll();
  }

  async getCantonById(id: number): Promise<Canton> {
    const canton = await this.cantonsRepository.findById(id);
    if (!canton) {
      throw new Error('Cantón no encontrado');
    }
    return canton;
  }

  async getCantonsByProvince(id_province: number): Promise<Canton[]> {
    return this.cantonsRepository.findByProvince(id_province);
  }

  async createCanton(cantonData: CantonCreate): Promise<Canton> {
    try {
      const existingCanton = await this.cantonsRepository.findByName(cantonData.name);
      if (existingCanton) {
        throw new Error('El nombre del cantón ya existe');
      }
      return await this.cantonsRepository.create(cantonData);
    } catch (error) {
      if (error instanceof Error && error.message === 'El nombre del cantón ya existe') {
        throw error;
      }
      throw new Error('Error al crear el cantón: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }

  async updateCanton(id: number, cantonData: CantonUpdate): Promise<Canton> {
    try {
      const canton = await this.cantonsRepository.findById(id);
      if (!canton) {
        throw new Error('Cantón no encontrado');
      }

      const updatedCanton = await this.cantonsRepository.update(id, cantonData);
      if (!updatedCanton) {
        throw new Error('Error al actualizar el cantón');
      }
      return updatedCanton;
    } catch (error) {
      if (error instanceof Error && (error.message === 'Cantón no encontrado' || error.message === 'El nombre del cantón ya existe')) {
        throw error;
      }
      throw new Error('Error al actualizar el cantón: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }

  async deleteCanton(id: number): Promise<void> {
    const canton = await this.cantonsRepository.findById(id);
    if (!canton) {
      throw new Error('Cantón no encontrado');
    }
    await this.cantonsRepository.delete(id);
  }
}

