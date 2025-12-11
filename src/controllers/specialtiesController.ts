import { Request, Response } from "express";
import { SpecialtieService } from "../services/specialtiesService";
import { validationResult } from "express-validator";

export class SpecialtiesController {
    private specialtieService: SpecialtieService;

    constructor() {
        this.specialtieService = new SpecialtieService();
    }

    getAll = async(_req: Request, res: Response): Promise<void> => {
        try {
            const specialtie = await this.specialtieService.getAllSpecialties();
            res.status(200).json({
                success: true,
                data: specialtie
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener las especialidades',
                error: error instanceof Error ? error.message : 'Error desconocido'
            })
        }
    }

    getByBranchAndArea = async(req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array()
                })
                return;
            }

            const idBranchRaw = req.query.id_branch as string | undefined;
            const idAreaRaw = req.query.id_area as string | undefined;

            if (!idBranchRaw) {
                res.status(400).json({
                    success: false,
                    message: 'El parametro de la sucursal es obligatorio'
                })
                return;
            }

            const id_branch = Number(idBranchRaw);
            const id_area = idAreaRaw ? Number(idAreaRaw) : undefined;

            if (Number.isNaN(id_branch)) {
                res.status(400).json({
                    success: false,
                    message: 'El parametro de la sucursal debe ser numérico'
                })
                return;
            }

            if (id_area !== undefined && Number.isNaN(id_area)) {
                res.status(400).json({
                    success: false,
                    message: 'El parametro del area debe ser numérico'
                })
                return;
            }

            const specialties = await this.specialtieService.getSpecialtiesByBranchAndArea(
                id_branch, id_area
            );

            if (!specialties || specialties.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No se encontraron especialidades para esas especificaciones'
                })
                return;
            }

            res.status(200).json({
                success: true,
                data: specialties
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener las especialidades por sucursal y area",
                error: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

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

            const specialtie = await this.specialtieService.createSpecialtie(req.body);

            res.status(200).json({
                success: true,
                message: 'Especialidad creada exitosamente',
                data: specialtie
            });
        } catch (error) {
            if (
                error instanceof Error &&
                [
                  "La especialidad ya existe en el area de esa sucursal"
                ].includes(error.message)
            ) {
                res.status(409).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al crear la especialidad",
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

            const specialtie = await this.specialtieService.updateSpecialtie(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Especialidad actualizada exitosamente',
                data: specialtie
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Especialidad no encontrada"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else if (
                error instanceof Error &&
                [
                  "La especialidad ya existe en el area de esa sucursal"
                ].includes(error.message)
            ) {
                res.status(409).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al actualizar la especialidad",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({
                  success: false,
                  message: "ID inválido",
                });
                return;
            }

            await this.specialtieService.deleteSpecialtie(id);

            res.status(200).json({
                success: true,
                message: 'Especialidad eliminada exitosamente'
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Especialidad no encontrada"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al eliminar la especialidad",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    }
}