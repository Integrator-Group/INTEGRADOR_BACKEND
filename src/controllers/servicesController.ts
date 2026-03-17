import { Request, Response } from "express";
import { ServicesServices } from "../services/servicesService";
import { validationResult } from "express-validator";

export class ServicesController {
    private servicesServices: ServicesServices;

    constructor() {
        this.servicesServices = new ServicesServices();
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const limitRaw = req.query.limit as string | undefined;
            const offsetRaw = req.query.offset as string | undefined;

            const limit = limitRaw ? Number(limitRaw) : 50;
            const offset = offsetRaw ? Number(offsetRaw) : 0;

            if (!Number.isFinite(limit) || Number.isNaN(limit) || limit <= 0) {
                res.status(400).json({
                    success: false,
                    message: "El query param 'limit' debe ser un número mayor a 0",
                });
                return;
            }

            if (!Number.isFinite(offset) || Number.isNaN(offset) || offset < 0) {
                res.status(400).json({
                    success: false,
                    message: "El query param 'offset' debe ser un número mayor o igual a 0",
                });
                return;
            }

            const safeLimit = Math.min(Math.floor(limit), 200);
            const safeOffset = Math.floor(offset);

            const services = await this.servicesServices.getAllServices(safeLimit, safeOffset);

            res.status(200).json({
                success: true,
                data: services,
                meta: { limit: safeLimit, offset: safeOffset, count: services.length },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener los servicios",
                error: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const idRaw = req.params.id as string | undefined;
            if (!idRaw) {
                res.status(400).json({
                    success: false,
                    message: "El parámetro 'id' es obligatorio",
                });
                return;
            }

            const id = Number(idRaw);
            if (Number.isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "El parámetro 'id' debe ser numérico",
                });
                return;
            }

            const service = await this.servicesServices.getServicesById(id);

            res.status(200).json({
                success: true,
                data: service,
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Servicios no encontrados") {
                res.status(404).json({
                    success: false,
                    message: "Servicio no encontrado",
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: "Error al obtener el servicio",
                error: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    };

    getByBranch = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
                return;
            }
          
            const idBranchRaw = req.params.id_branch as string | undefined;
          
            if (!idBranchRaw) {
                res.status(400).json({
                    success: false,
                    message: "El parametro de la sucursal es obligatorio",
                });
                return;
            }
          
            const idBranch = Number(idBranchRaw);
          
            if (Number.isNaN(idBranch)) {
                res.status(400).json({
                    success: false,
                    message: "El parametro de la sucursal debe ser numérico",
                });
                return;
            }
          
            const services = await this.servicesServices.getServicesByBranch(idBranch);
          
            if (!services || services.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No se encontraron servicios para esas especificaciones",
                });
                return;
            }
          
            res.status(200).json({
                success: true,
                data: services,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener los servicios por sucursal",
                error: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    };
    
    getByArea = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const idAreaRaw = req.params.id_area as string | undefined;
            if (!idAreaRaw) {
                res.status(400).json({
                    success: false,
                    message: "El parametro de la area es obligatorio",
                });
                return;
            }
            const idArea = Number(idAreaRaw);
            if (Number.isNaN(idArea)) {
                res.status(400).json({
                    success: false,
                    message: "El parametro de la area debe ser numérico",
                });
                return;
            }

            const services = await this.servicesServices.getServicesByArea(idArea);
            if (!services || services.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No se encontraron servicios para esa area",
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: services,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener los servicios por area",
                error: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                  success: false,
                  message: "Errores de validación",
                  errors: errors.array(),
                });
                return;
            }

            const service = await this.servicesServices.createService(req.body);

            res.status(200).json({
                success: true,
                message: 'Servicio creado exitosamente',
                data: service
            });
        } catch (error) {
            if (
                error instanceof Error &&
                [
                  "El servicio ya existe en el area de esa sucursal"
                ].includes(error.message)
            ) {
                res.status(409).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al crear el servicio",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                  success: false,
                  message: "Errores de validación",
                  errors: errors.array(),
                });
                return;
            }

            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({
                  success: false,
                  message: "ID inválido",
                });
                return;
            }

            const service = await this.servicesServices.updateService(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Servicio actualizado exitosamente',
                data: service
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Servicio no encontrado"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else if (
                error instanceof Error &&
                [
                  "El servicio ya existe en el area de esa sucursal"
                ].includes(error.message)
            ) {
                res.status(409).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al actualizar el servicio",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    }

    delete = async(req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({
                  success: false,
                  message: "ID inválido",
                });
                return;
            }

            await this.servicesServices.deleteService(id);

            res.status(200).json({
                success: true,
                message: 'Servicio eliminado exitosamente'
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Servicio no encontrado"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al eliminar el servicio",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    }
}