import { AreasRepository } from "../repositories/areasRepository";
import { Area, AreaCreate, AreaUpdate } from "../models/Areas";

export class AreasServices {
    private areasRepository: AreasRepository;

    constructor() {
        this.areasRepository = new AreasRepository();
    }

    async getAllAreas(): Promise<Area[]> {
        return await this.areasRepository.findAll();
    }

    async getAreasById(id: number): Promise<Area> {
        const area = await this.areasRepository.findById(id);
        if (!area) {
            throw new Error('Area no encontrada');
        }

        return area;
    }

    async getAreasByBranche(id_branche: number): Promise<Area[]> {
        return await this.areasRepository.findByBranche(id_branche);
    }

    async getBranchByArea(name: string): Promise<Area> {
        const area = await this.areasRepository.findByArea(name);
        if (!area) {
            throw new Error('Sucursal no encontrada');
        }

        return area;
    }

    async createArea(area: AreaCreate): Promise<Area> {
        try {
            const areaExists = await this.areasRepository.findByBranchAndName(
              area.id_branch,
              area.name
            );
  
            if (areaExists) {
              throw new Error('Ya existe un área con ese nombre en esta sucursal');
            }
        
            return await this.areasRepository.create(area);
  
        } catch (error) {
            if (error instanceof Error) {
              throw error;
            }
            throw new Error(
              'Error al crear el área: ' +
                (error instanceof Error ? error.message : 'Error desconocido')
            );
        }
    }
    
    async updateArea(id: number, area: AreaUpdate): Promise<Area> {
        try {
            const areaExists = await this.areasRepository.findById(id);
            if (!areaExists) {
              throw new Error("Área no encontrada");
            }
      
            if (area.name) {
                const effectiveBranchId = area.id_branch ?? areaExists.id_branch;
      
                const duplicatedArea = await this.areasRepository.findByBranchAndName(
                  effectiveBranchId,
                  area.name
                );
      
                if (duplicatedArea && duplicatedArea.id !== id) {
                  throw new Error(
                    "Ya existe un área con ese nombre en esta sucursal"
                      );
                }
            }
      
            const areaUpdated = await this.areasRepository.update(id, area);
            if (!areaUpdated) {
                throw new Error("Error al actualizar el área");
            }
      
            return areaUpdated;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error desconocido al actualizar el área");
        }
    }
    
    async deleteArea(id: number): Promise<void> {
        const areaExists = await this.areasRepository.findById(id);
        if (!areaExists) {
            throw new Error('Area no encontrada');
        }
        await this.areasRepository.delete(id);
    }
}