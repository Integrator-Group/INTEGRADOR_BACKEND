import { Request, Response } from "express";
import { AreasServices } from "../services/areasServices";
import { validationResult } from "express-validator";

export class AreasController {
    private areasService: AreasServices;

    constructor() {
        this.areasService = new AreasServices();
    }

    getAll = async(_req: Request, res: Response): Promise<void> => {
        try {
            const areas = await this.areasService.getAllAreas();
            res.status(200).json({
                success: true,
                data: areas
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener las areas',
                error: error instanceof Error ? error.message : 'Error desconocido'
            })
        }
    }

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
      
            const idBranchRaw = req.query.id_branch as string | undefined;
            
            if (!idBranchRaw) {
                res.status(400).json({
                  success: false,
                  message: "El parametro id_branch es obligatorio",
                });
                return;
            }
          
            const idBranch = Number(idBranchRaw);
          
            if (Number.isNaN(idBranch)) {
                res.status(400).json({
                  success: false,
                  message: "El parametro id_branch debe ser numérico",
                });
                return;
            }
          
            const areas = await this.areasService.getAreasByBranche(idBranch);
          
            if (!areas || areas.length === 0) {
                res.status(404).json({
                  success: false,
                  message: "No se encontraron areas en la sucursal indicada",
                });
                return;
            }
          
            res.status(200).json({
                success: true,
                data: areas,
            });
        } catch (error) {
            res.status(500).json({
              success: false,
              message: "Error al obtener las areas por sucursal",
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
                  message: 'Errores de validación',
                  errors: errors.array(),
                });
                return;
            }

            const area = await this.areasService.createArea(req.body);

            res.status(200).json({
                success: true,
                message: 'Sucursal creada con éxito',
                data: area
            });
        } catch (error) {
            if (
                error instanceof Error &&
                [
                  "Ya existe esa area en la sucursal"
                ].includes(error.message)
            ) {
                res.status(409).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al crear el area",
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
                    message: 'ID inválido'
                  })
                  return;
            }

            const area = await this.areasService.updateArea(id, req.body);

            res.status(200).json({
                success: true,
                message: 'Area actualizada con éxito',
                data: area
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Area no encontrada"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else if (
                error instanceof Error &&
                [
                  "El area ya existe en la sucursal"
                ].includes(error.message)
            ) {
                res.status(409).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al actualizar el area",
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
                    message: "ID inválido"
                  })
                  return;
            }

            await this.areasService.deleteArea(id);

            res.status(200).json({
                success: true,
                message: "Area eliminada exitosamente",
                });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Area no encontrada"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al eliminar el area",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    }
}