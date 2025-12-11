import { Request, Response } from "express";
import { BranchesServices } from "../services/branchesService";
import { validationResult } from "express-validator";

export class BranchesController {
    private branchesService: BranchesServices;

    constructor() {
        this.branchesService = new BranchesServices();
    }

    getAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const branches = await this.branchesService.getAllBranches();
            res.status(200).json({
                success: true,
                data: branches
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener las sucursales',
                error: error instanceof Error ? error.message : 'Error desconocido'
            })
        }
    };

    getByProvinceCantons = async (req: Request, res: Response): Promise<void> => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.status(400).json({
              success: false,
              errors: errors.array(),
            });
            return;
          }
    
          const idProvinceRaw = req.query.id_province as string | undefined;
          const idCantonRaw = req.query.id_canton as string | undefined;
    
          if (!idProvinceRaw) {
            res.status(400).json({
              success: false,
              message: "El parámetro id_province es obligatorio",
            });
            return;
          }
    
          const id_province = Number(idProvinceRaw);
          const id_canton = idCantonRaw ? Number(idCantonRaw) : undefined;
    
          if (Number.isNaN(id_province)) {
            res.status(400).json({
              success: false,
              message: "El parámetro id_province debe ser numérico",
            });
            return;
          }
    
          if (id_canton !== undefined && Number.isNaN(id_canton)) {
            res.status(400).json({
              success: false,
              message: "El parámetro id_canton debe ser numérico",
            });
            return;
          }
    
          const branches = await this.branchesService.getBranchesByProvinceCanton(
            id_province,
            id_canton
          );
    
          if (!branches || branches.length === 0) {
            res.status(404).json({
              success: false,
              message: "No se encontraron sucursales para la ubicación indicada",
            });
            return;
          }
    
          res.status(200).json({
            success: true,
            data: branches,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: "Error al obtener las sucursales por provincia y cantón",
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
    
            const branch = await this.branchesService.createBranche(req.body);
    
            res.status(201).json({
              success: true,
              message: "Sucursal creada exitosamente",
              data: branch,
            });
        } catch (error) {
            if (
                error instanceof Error &&
                [
                  "El nombre de la sucursal ya existe",
                  "El número de celular de la sucursal ya existe",
                  "El correo de la sucursal ya existe",
                  "El manager ya esta asignado a otra sucursal",
                ].includes(error.message)
            ) {
                res.status(409).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al crear la sucursal",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    };
    
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
    
            const branch = await this.branchesService.updateBranche(id, req.body);
    
            res.status(200).json({
              success: true,
              message: "Sucursal actualizada exitosamente",
              data: branch,
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Sucursal no encontrada"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else if (
                error instanceof Error &&
                [
                  "El nombre de la sucursal ya existe",
                  "El número de celular de la sucursal ya existe",
                  "El correo de la sucursal ya existe",
                  "El manager ya esta asignado a otra sucursal",
                ].includes(error.message)
            ) {
                res.status(409).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al actualizar la sucursal",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    };
    
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
    
            await this.branchesService.deleteBranche(id);
    
            res.status(200).json({
              success: true,
              message: "Sucursal eliminada exitosamente",
              });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Sucursal no encontrada"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al eliminar la sucursal",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    };
}