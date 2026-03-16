import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { InventoryService } from '../services/inventoryService';

export class InventoryController {
    private readonly inventoryService: InventoryService;

    constructor() {
        this.inventoryService = new InventoryService();
    }

    getAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const inventory = await this.inventoryService.getAllInventory();
            res.status(200).json({
                success: true,
                data: inventory,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener el inventario',
                error: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID inválido' });
                return;
            }

            const inventory = await this.inventoryService.getInventoryById(id);
            res.status(200).json({ success: true, data: inventory });
        } catch (error) {
            if (error instanceof Error && error.message === 'Inventario no encontrado') {
                res.status(404).json({ success: false, message: error.message });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener el inventario',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        }
    };

    getByBranch = async (req: Request, res: Response): Promise<void> => {
        try {
            const id_branch = parseInt(req.params.id_branch, 10);
            if (isNaN(id_branch)) {
                res.status(400).json({ success: false, message: 'ID de sucursal inválido' });
                return;
            }

            const nameQuery = req.query.name as string | undefined;
            const nameFilter = nameQuery?.trim();
            const inventory = nameFilter
                ? await this.inventoryService.getInventoryByBranchAndName(id_branch, nameFilter)
                : await this.inventoryService.getInventoryByBranch(id_branch);

            res.status(200).json({ success: true, data: inventory });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener el inventario de la sucursal',
                error: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    };

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

            const inventory = await this.inventoryService.createInventory(req.body);
            res.status(201).json({
                success: true,
                message: 'Inventario creado exitosamente',
                data: inventory,
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Ya existe un registro de inventario para este item en esta sucursal'
            ) {
                res.status(409).json({ success: false, message: error.message });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al crear el inventario',
                    error: error instanceof Error ? error.message : 'Error desconocido',
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
                    message: 'Errores de validación',
                    errors: errors.array(),
                });
                return;
            }

            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID inválido' });
                return;
            }

            const inventory = await this.inventoryService.updateInventory(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Inventario actualizado exitosamente',
                data: inventory,
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Inventario no encontrado') {
                res.status(404).json({ success: false, message: error.message });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al actualizar el inventario',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: 'ID inválido' });
                return;
            }

            await this.inventoryService.deleteInventory(id);
            res.status(200).json({
                success: true,
                message: 'Inventario eliminado exitosamente',
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Inventario no encontrado') {
                res.status(404).json({ success: false, message: error.message });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al eliminar el inventario',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        }
    };
}
