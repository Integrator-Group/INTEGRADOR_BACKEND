import { Request, Response } from "express";
import { MessagingsServices } from "../services/messagingsServices";
import { validationResult } from "express-validator";

export class MessagingsController {
    private messagingsServices: MessagingsServices;

    constructor() {
        this.messagingsServices = new MessagingsServices();
    }

    getAllBySender = async(req: Request, res: Response): Promise<void> => {
        try {
            const sender_id = parseInt(req.params.sender_id, 10);
            if (isNaN(sender_id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const messagings = await this.messagingsServices.findAllBySender(sender_id);
            res.status(200).json({
                success: true,
                data: messagings
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los mensajes',
                error: error instanceof Error ? error.message : 'Error desconocido',
              });
        }
    }

    getAllBySenderDeleted = async(req: Request, res: Response): Promise<void> => {
        try {
            const sender_id = parseInt(req.params.sender_id, 10);
            if (isNaN(sender_id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const messagings = await this.messagingsServices.findAllBySenderDeleted(sender_id);
            res.status(200).json({
                success: true,
                data: messagings
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los mensajes',
                error: error instanceof Error ? error.message : 'Error desconocido',
              });
        }
    }

    getAllByReceiver = async(req: Request, res: Response): Promise<void> => {
        try {
            const receiver_id = parseInt(req.params.receiver_id, 10);
            if (isNaN(receiver_id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const messagings = await this.messagingsServices.findAllByReceiver(receiver_id);
            res.status(200).json({
                success: true,
                data: messagings
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los mensajes',
                error: error instanceof Error ? error.message : 'Error desconocido',
              });
        }
    }

    getAllByReceiverDeleted = async(req: Request, res: Response): Promise<void> => {
        try {
            const receiver_id = parseInt(req.params.receiver_id, 10);
            if (isNaN(receiver_id)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const messagings = await this.messagingsServices.findAllByReceiverDeleted(receiver_id);
            res.status(200).json({
                success: true,
                data: messagings
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los mensajes',
                error: error instanceof Error ? error.message : 'Error desconocido',
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

            const messaging = await this.messagingsServices.create(req.body);
            res.status(200).json({
                success: true,
                message: 'Mensaje enviado exitosamente',
                data: messaging
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al enviar el mensaje",
                error: error instanceof Error ? error.message : "Error desconocido",
            })
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

            const messaging = await this.messagingsServices.update(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Mensaje actualizado con exito',
                data: messaging
            })
        } catch (error) {
            if (error instanceof Error && error.message === 'Mensaje no encontrado') {
                res.status(404).json({
                    success: false,
                    message: error.message
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: "Error al actualizar el mensaje",
                    error: error instanceof Error ? error.message : "Error desconocido",
                });
            }
        }
    }
}