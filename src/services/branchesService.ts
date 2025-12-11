import { BranchesRepository } from "../repositories/branchesRepository";
import { Branch, BranchCreate, BranchUpdate } from "../models/Branches";

export class BranchesServices {
    private branchesRepository: BranchesRepository;

    constructor() {
        this.branchesRepository = new BranchesRepository();
    }

    async getAllBranches(): Promise<Branch[]> {
        return await this.branchesRepository.findAll();
    }

    async getBranchesById(id: number): Promise<Branch> {
        const branche = await this.branchesRepository.findById(id);
        if (!branche) {
            throw new Error('Sucursal no encontrada');
        }
        return branche;
    }

    async getBranchesByProvinceCanton(id_province: number, id_canton?: number): Promise<Branch[]> {
        const branche = await this.branchesRepository.findByProvinceCanton(id_province, id_canton);
        if (!branche || branche.length === 0) {
            throw new Error('Sucursales no encontradas')
        }
        return branche;
    }

    async createBranche(branche: BranchCreate): Promise<Branch> {
        try {
          const nameExists = await this.branchesRepository.findByName(branche.name);
          if (nameExists) {
            throw new Error("El nombre de la sucursal ya existe");
          }
      
          const phoneExists = await this.branchesRepository.findByPhone(branche.phone);
          if (phoneExists) {
            throw new Error("El número de celular de la sucursal ya existe");
          }
      
          const emailExists = await this.branchesRepository.findByEmail(branche.email);
          if (emailExists) {
            throw new Error("El correo de la sucursal ya existe");
          }
      
          return await this.branchesRepository.create(branche);
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Error al crear la sucursal: " + (error instanceof Error ? error.message : "Error desconocido"));
        }
    }

    async updateBranche(id: number, branche: BranchUpdate): Promise<Branch> {
        try {
          const brancheExists = await this.branchesRepository.findById(id);
          if (!brancheExists) {
            throw new Error("Sucursal no encontrada");
          }
          if (branche.name) {
            const nameExists = await this.branchesRepository.findByName(branche.name);
            if (nameExists && nameExists.id !== id) {
              throw new Error("El nombre de la sucursal ya existe");
            }
          }
          if (branche.phone) {
            const phoneExists = await this.branchesRepository.findByPhone(branche.phone);
            if (phoneExists && phoneExists.id !== id) {
              throw new Error("El número de celular ya existe");
            }
          }
          if (branche.email) {
            const emailExists = await this.branchesRepository.findByEmail(branche.email);
            if (emailExists && emailExists.id !== id) {
              throw new Error("El correo ya existe");
            }
          }
          if (branche.id_manager) {
            const managerExists = await this.branchesRepository.findByManager(branche.id_manager);
            if (managerExists && managerExists.id !== id) {
              throw new Error("El manager ya está asignado a otra sucursal");
            }
          }
          const brancheUpdated = await this.branchesRepository.update(id, branche);
          if (!brancheUpdated) {
            throw new Error("Error al actualizar la sucursal");
          }
      
          return brancheUpdated;
        } catch (error) {
          if (error instanceof Error) throw error;
          throw new Error("Error desconocido al actualizar");
        }
    }

    async deleteBranche(id: number): Promise<void> {
        const brancheExists = await this.branchesRepository.findById(id);
        if (!brancheExists) {
            throw new Error('Sucursal no encontrada');
        }
        await this.branchesRepository.delete(id);
    }
}