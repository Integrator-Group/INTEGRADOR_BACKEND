import { Request, Response } from "express";
import { ItemsServices } from "../services/itemsServices";
import { validationResult } from "express-validator";

export class ItemsController {
    private itemsServices: ItemsServices;

    constructor() {
        this.itemsServices = new ItemsServices();
    }

    getAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const items = await this.itemsServices.getAllItems();
            res.status(200).json({
                success: true,
                data: items
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los items',
                error: error instanceof Error ? error.message : 'Error desconocido'
            })
        }
    }

    create = async(req: Request, res: Response): Promise<void> => {
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

            const item = await this.itemsServices.createItem(req.body);

            res.status(200).json({
                success: true,
                message: 'Item creado exitosamente',
                data: item
            })
        } catch (error) {
            if (
                error instanceof Error &&
                [
                  "El nombre del item ya existe"
                ].includes(error.message)
            ) {
                res.status(409).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al crear el item",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    }

    update = async(req: Request, res: Response): Promise<void> => {
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

            const item = await this.itemsServices.updateItem(id, req.body);
            res.status(200).json({
                success: true,
                message: "Item actualizado exitosamente",
                data: item,
              });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Item no encontrado"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else if (
                error instanceof Error &&
                [
                  "El nombre del item ya existe"
                ].includes(error.message)
            ) {
                res.status(409).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al actualizar el item",
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
    
            await this.itemsServices.deleteItem(id);
    
            res.status(200).json({
              success: true,
              message: "Item eliminado exitosamente",
              });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Item no encontrado"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al eliminar el item",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    }
}