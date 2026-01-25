import { Request, Response } from "express";
import { NotificationsServices } from "../services/notificationsServices";
import { validationResult } from "express-validator";

export class NotificationsController {
    private notificationsServices: NotificationsServices;

    constructor() {
        this.notificationsServices = new NotificationsServices();
    }

    findAllByUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id_user = parseInt(req.params.id_user, 10);
            if (isNaN(id_user)) {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido',
                });
                return;
            }

            const notifications = await this.notificationsServices.getAllNotificationsByUser(id_user);
            res.status(200).json({
                success: true,
                data: notifications
            })
        } catch(error) {
            if (error instanceof Error && error.message === 'Usuario no encontrado') {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener las notificaciones',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
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

            const notification = await this.notificationsServices.createNotification(req.body);
            res.status(200).json({
                success: true,
                message: 'Notificación creada exitosamente',
                data: notification
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear la notificación',
                error: error instanceof Error ? error.message : 'Error desconocido',
            })
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "ID inválido",
                });
                return;
            }
          
            const notification = await this.notificationsServices.updateNotification(id);
          
            res.status(200).json({
                success: true,
                message: "Notificación actualizada exitosamente",
                data: notification,
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Notificación no encontrada") {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
      
            res.status(500).json({
                success: false,
                message: "Error al actualizar la notificación",
                error: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
}