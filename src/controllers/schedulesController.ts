import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { SchedulesServices } from "../services/schedulesServices";

export class SchedulesController {
    private schedulesServices: SchedulesServices;

    constructor() {
        this.schedulesServices = new SchedulesServices();
    }

    findAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const schedules = await this.schedulesServices.findAll();
            res.status(200).json({
                success: true,
                data: schedules
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los horarios',
                error: error instanceof Error ? error.message : 'Error desconocido'
            })
        }
    }

    private parseAndValidateDate(queryDate: string | undefined): string {
        if (queryDate) {
            const match = queryDate.match(/^\d{4}-\d{2}-\d{2}$/);
            if (match && !isNaN(Date.parse(queryDate))) {
                return queryDate;
            }
        }
        return new Date().toISOString().split('T')[0];
    }

    findByUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id_user = parseInt(req.params.id_user, 10);
            if (isNaN(id_user)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                });
                return;
            }

            const day = req.params.day;
            if (!day) {
                res.status(400).json({
                    success: false,
                    message: 'Día inválido'
                });
                return;
            }

            const date = this.parseAndValidateDate(req.query.date as string | undefined);
            const schedules = await this.schedulesServices.findSchedulesByUserWithAppointments(id_user, day, date);
            res.status(200).json({
                success: true,
                data: schedules
            })
        } catch (error) {
            if (error instanceof Error && error.message === 'Horarios no encontrados') {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Error al obtener los horarios',
                error: error instanceof Error ? error.message : 'Error desconocido'
            })
        }
    }

    findByArea = async (req: Request, res: Response): Promise<void> => {
        try {
            const id_area = parseInt(req.params.id_area, 10);
            if (isNaN(id_area)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de área inválido'
                });
                return;
            }

            const day = req.params.day;
            if (!day) {
                res.status(400).json({
                    success: false,
                    message: 'Día inválido'
                });
                return;
            }

            const date = this.parseAndValidateDate(req.query.date as string | undefined);
            const schedules = await this.schedulesServices.findSchedulesByAreaWithAppointments(id_area, day, date);
            res.status(200).json({
                success: true,
                data: schedules
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los horarios del área',
                error: error instanceof Error ? error.message : 'Error desconocido'
            })
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
            const schedule = await this.schedulesServices.createSchedule(req.body);

            res.status(200).json({
                success: true,
                message: 'Horario creado con éxito',
                data: schedule
            })
        } catch (error) {
            res.status(500).json({
              success: false,
              message: "Error al crear el horario",
              error: error instanceof Error ? error.message : "Error desconocido",
            });
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

            const schedule = await this.schedulesServices.updateSchedule(id, req.body);

            res.status(200).json({
                success: true,
                message: 'Horario actualizado con éxito',
                data: schedule
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

    delete = async(req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "ID inválido"
                  })
                  return;
            }

            await this.schedulesServices.deleteSchedule(id);

            res.status(200).json({
                success: true,
                message: 'Horario eliminado correctamente'
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Horario no encontrado"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                  success: false,
                  message: "Error al eliminar el horario",
                  error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    }
}