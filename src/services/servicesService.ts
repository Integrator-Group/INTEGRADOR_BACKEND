import { ServicesRepository } from "../repositories/servicesRepository";
import { Service, ServiceCreate, ServiceUpdate } from "../models/Services";

export class ServicesServices {
    private servicesRepository: ServicesRepository;

    constructor() {
        this.servicesRepository = new ServicesRepository();
    }

    async getServicesByBranch(id_branch: number): Promise<Service[]> {
        const service = await this.servicesRepository.findServicesByBranch(id_branch);
        if (!service || service.length === 0) {
            throw new Error('Servicios no encontrados');
        }
        return service;
    }

    async getServicesById(id: number): Promise<Service> {
        const service = await this.servicesRepository.findServiceById(id);
        if (!service) {
            throw new Error('Servicios no encontrados');
        }
        return service;
    }

    async getServicesByArea(id_area: number): Promise<Service[]> {
        const service = await this.servicesRepository.findServicesByArea(id_area);
        if (!service || service.length === 0) {
            throw new Error('Servicios no encontrados');
        }
        return service;
    }

    async createService(service: ServiceCreate): Promise<Service> {
        try {
            const nameExists = await this.servicesRepository.findServiceByName(service.id_branch, service.id_area, service.name);
            if (nameExists) {
                throw new Error('El servicio ya existe en esta sucursal y área');
            }

            return await this.servicesRepository.create(service);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
              }
              throw new Error("Error al crear el servicio: " + (error instanceof Error ? error.message : "Error desconocido"));
        }
    }

    async updateService(id: number, service: ServiceUpdate): Promise<Service> {
        try {
            const serviceExists = await this.servicesRepository.findServiceById(id);
            if (!serviceExists) {
                throw new Error('Servicio no encontrado');
            }

            if(service.name) {
                const effectiveBranchId = service.id_branch ?? serviceExists.id_branch;
                const effectiveAreaId = service.id_area ?? serviceExists.id_area;

                const duplicated = await this.servicesRepository.findServiceByName(effectiveBranchId, effectiveAreaId, service.name);
                if (duplicated) {
                    throw new Error('Ya existe un servicio en la sucursal y área');
                }
            }

            const serviceUpdate = await this.servicesRepository.update(id, service);
            if (!serviceUpdate) {
                throw new Error('Error al actualizar el servicio');
            }

            return serviceUpdate;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error("Error desconocido al actualizar");
        }
    }

    async deleteService(id: number): Promise<void> {
        const serviceExists = await this.servicesRepository.findServiceById(id);
        if (!serviceExists) {
            throw new Error('Servicio no encontrado');
        }

        await this.servicesRepository.delete(id);
    }
}