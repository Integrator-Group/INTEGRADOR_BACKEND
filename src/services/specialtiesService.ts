import { SpecialtieRepository } from "../repositories/specialtiesRepository";
import { Specialtie, SpecialtieCreate, SpecialtieUpdate } from "../models/Specialties";

export class SpecialtieService {
    private specialtieRepository: SpecialtieRepository;

    constructor() {
        this.specialtieRepository = new SpecialtieRepository();
    }

    async getAllSpecialties(): Promise<Specialtie[]> {
        return await this.specialtieRepository.findAll();
    }

    async getSpecialtiesById(id: number): Promise<Specialtie> {
        const specialtie = await this.specialtieRepository.findById(id);
        if (!specialtie) {
            throw new Error('Especialidad no encontrada');
        }

        return specialtie;
    }

    async getSpecialtiesByBranchAndArea(id_branch: number, id_area?: number): Promise<Specialtie[]> {
        const specialtie = await this.specialtieRepository.findByBranchAndArea(id_branch, id_area);
        if (!specialtie || specialtie.length === 0) {
            throw new Error('Especialidades no encontradas')
        }
        return specialtie;
    }

    async createSpecialtie(specialtie: SpecialtieCreate): Promise<Specialtie> {
        try {
            const specialtieExists = await this.specialtieRepository.findByBranchAndAreaAndName(
                specialtie.id_branch, specialtie.id_area, specialtie.name
            )

            if (specialtieExists) {
                throw new Error('La especialidad ya existe en la area de esta sucursal');
            }

            return await this.specialtieRepository.create(specialtie);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
              }
              throw new Error("Error al crear la especialidad: " + (error instanceof Error ? error.message : "Error desconocido"));
        }
    }

    async updateSpecialtie(id: number, specialtie: SpecialtieUpdate): Promise<Specialtie> {
        try {
            const specialtieExists = await this.specialtieRepository.findById(id);
            if (!specialtieExists) {
              throw new Error("Especialidad no encontrada");
            }
      
            if (specialtie.name) {
                const effectiveBranchId = specialtie.id_branch ?? specialtieExists.id_branch;
                const effectiveAreaId   = specialtie.id_area   ?? specialtieExists.id_area;
                
                const duplicated = await this.specialtieRepository.findByBranchAndAreaAndName(
                  effectiveBranchId,
                  effectiveAreaId,
                  specialtie.name
                );
              
                if (duplicated && duplicated.id !== id) {
                    throw new Error(
                        "Ya existe una especialidad con ese nombre en esa área y sucursal"
                    );
                }
            }
      
            const specialtieUpdated = await this.specialtieRepository.update(id, specialtie);
            if (!specialtieUpdated) {
              throw new Error("Error al actualizar la especialidad");
            }
      
            return specialtieUpdated;
        } catch (error) {
            if (error instanceof Error) {
              throw error;
            }
            throw new Error("Error desconocido al actualizar la especialidad");
        }
    }      

    async deleteSpecialtie(id: number): Promise<void> {
        const specialtieExists = await this.specialtieRepository.findById(id);
        if (!specialtieExists) {
            throw new Error('Especialidad no encontrada');
        }

        await this.specialtieRepository.delete(id);
    }
}