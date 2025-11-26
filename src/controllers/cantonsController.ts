import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CantonsService } from '../services/cantonsService';

export class CantonsController {
  private readonly cantonsService: CantonsService;

  constructor() {
    this.cantonsService = new CantonsService();
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cantons = await this.cantonsService.getAllCantons();
      res.status(200).json({
        success: true,
        data: cantons,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener los cantones',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido',
        });
        return;
      }

      const canton = await this.cantonsService.getCantonById(id);
      res.status(200).json({
        success: true,
        data: canton,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Cantón no encontrado') {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al obtener el cantón',
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }
  };

  getByProvince = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_province = parseInt(req.params.id_province, 10);
      if (isNaN(id_province)) {
        res.status(400).json({
          success: false,
          message: 'ID de provincia inválido',
        });
        return;
      }

      const cantons = await this.cantonsService.getCantonsByProvince(id_province);
      res.status(200).json({
        success: true,
        data: cantons,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener los cantones',
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

      const canton = await this.cantonsService.createCanton(req.body);
      res.status(201).json({
        success: true,
        message: 'Cantón creado exitosamente',
        data: canton,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'El nombre del cantón ya existe') {
        res.status(409).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al crear el cantón',
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
        res.status(400).json({
          success: false,
          message: 'ID inválido',
        });
        return;
      }

      const canton = await this.cantonsService.updateCanton(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Cantón actualizado exitosamente',
        data: canton,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Cantón no encontrado' || error.message === 'El nombre del cantón ya existe')
      ) {
        res.status(error.message === 'Cantón no encontrado' ? 404 : 409).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al actualizar el cantón',
          error: error instanceof Error ? error.message : 'Error desconocido',
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
          message: 'ID inválido',
        });
        return;
      }

      await this.cantonsService.deleteCanton(id);
      res.status(200).json({
        success: true,
        message: 'Cantón eliminado exitosamente',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Cantón no encontrado') {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al eliminar el cantón',
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }
  };
}

