import { ProvincesRepository } from '../repositories/provincesRepository';
import { Province, ProvinceCreate, ProvinceUpdate } from '../models/Provinces';

export class ProvincesService {
  private readonly provincesRepository: ProvincesRepository;

  constructor() {
    this.provincesRepository = new ProvincesRepository();
  }

  async getAllProvinces(): Promise<Province[]> {
    return this.provincesRepository.findAll();
  }

  async getProvinceById(id: number): Promise<Province> {
    const province = await this.provincesRepository.findById(id);
    if (!province) {
      throw new Error('Provincia no encontrada');
    }
    return province;
  }

  async createProvince(provinceData: ProvinceCreate): Promise<Province> {
    try {
      const existingProvince = await this.provincesRepository.findByName(provinceData.name);
      if (existingProvince) {
        throw new Error('El nombre de la provincia ya existe');
      }
      return await this.provincesRepository.create(provinceData);
    } catch (error) {
      if (error instanceof Error && error.message === 'El nombre de la provincia ya existe') {
        throw error;
      }
      throw new Error('Error al crear la provincia: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }

  async updateProvince(id: number, provinceData: ProvinceUpdate): Promise<Province> {
    try {
      const province = await this.provincesRepository.findById(id);
      if (!province) {
        throw new Error('Provincia no encontrada');
      }

      if (provinceData.name && provinceData.name !== province.name) {
        const repeatedProvince = await this.provincesRepository.findByName(provinceData.name);
        if (repeatedProvince) {
          throw new Error('El nombre de la provincia ya existe');
        }
      }

      const updatedProvince = await this.provincesRepository.update(id, provinceData);
      if (!updatedProvince) {
        throw new Error('Error al actualizar la provincia');
      }
      return updatedProvince;
    } catch (error) {
      if (error instanceof Error && (error.message === 'Provincia no encontrada' || error.message === 'El nombre de la provincia ya existe')) {
        throw error;
      }
      throw new Error('Error al actualizar la provincia: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }

  async deleteProvince(id: number): Promise<void> {
    const province = await this.provincesRepository.findById(id);
    if (!province) {
      throw new Error('Provincia no encontrada');
    }
    await this.provincesRepository.delete(id);
  }
}

