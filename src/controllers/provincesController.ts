import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ProvincesService } from '../services/provincesService';

export class ProvincesController {
  private readonly provincesService: ProvincesService;

  constructor() {
    this.provincesService = new ProvincesService();
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const provinces = await this.provincesService.getAllProvinces();
      res.status(200).json({
        success: true,
        data: provinces,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener las provincias',
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

      const province = await this.provincesService.getProvinceById(id);
      res.status(200).json({
        success: true,
        data: province,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Provincia no encontrada') {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al obtener la provincia',
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
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

      const province = await this.provincesService.createProvince(req.body);
      res.status(201).json({
        success: true,
        message: 'Provincia creada exitosamente',
        data: province,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'El nombre de la provincia ya existe') {
        res.status(409).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al crear la provincia',
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

      const province = await this.provincesService.updateProvince(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Provincia actualizada exitosamente',
        data: province,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Provincia no encontrada' || error.message === 'El nombre de la provincia ya existe')
      ) {
        res.status(error.message === 'Provincia no encontrada' ? 404 : 409).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al actualizar la provincia',
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

      await this.provincesService.deleteProvince(id);
      res.status(200).json({
        success: true,
        message: 'Provincia eliminada exitosamente',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Provincia no encontrada') {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al eliminar la provincia',
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }
  };
}

