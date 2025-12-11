import { Request, Response } from "express";
import { NotifcationPreferencesService } from "../services/notificationPreferencesService";
import { NotificationPreferenceCreate, NotificationPreferenceUpdate } from "../models/Notification_Preferences";
import { validationResult } from "express-validator";

export class NotificationPreferencesController {
    private notificationPreferencesService: NotifcationPreferencesService;

    constructor() {
        this.notificationPreferencesService = new NotifcationPreferencesService();
    }

    getByUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
                return;
            }

            const idUserRaw = req.params.id_user as string | undefined;

            if (!idUserRaw) {
                res.status(400).json({
                    success: false,
                    message: "El parámetro id_user es obligatorio",
                });
                return;
            }

            const idUser = Number(idUserRaw);

            if (Number.isNaN(idUser)) {
                res.status(400).json({
                    success: false,
                    message: "El parámetro id_user debe ser numérico",
                });
                return;
            }

            const preference = await this.notificationPreferencesService.getPreferencesByUser(idUser);

            res.status(200).json({
                success: true,
                data: preference,
            });
        } catch (error) {
            if (error instanceof Error && error.message === "No se encontraron preferencias") {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: "Error al obtener las preferencias del usuario",
                error: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    savePreferences = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
                return;
            }

            const idUserRaw = req.params.id_user as string | undefined;

            if (!idUserRaw) {
                res.status(400).json({
                    success: false,
                    message: "El parámetro id_user es obligatorio",
                });
                return;
            }

            const idUser = Number(idUserRaw);

            if (Number.isNaN(idUser)) {
                res.status(400).json({
                    success: false,
                    message: "El parámetro id_user debe ser numérico",
                });
                return;
            }

            const emailEnable =
                req.body.email_enable === true ||
                req.body.email_enable === "true";

            const whatsappEnable =
                req.body.whatsapp_enable === true ||
                req.body.whatsapp_enable === "true";

            const idStateBody = req.body.id_state;
            const idState =
                typeof idStateBody === "number"
                    ? idStateBody
                    : Number(idStateBody) || 1;

            const create: NotificationPreferenceCreate = {
                email_enable: emailEnable,
                whatsapp_enable: whatsappEnable,
                id_state: idState,
            };

            const update: NotificationPreferenceUpdate = {
                email_enable: emailEnable,
                whatsapp_enable: whatsappEnable
            };

            const preference = await this.notificationPreferencesService.savePreferences(
                idUser,
                create,
                update
            );

            res.status(200).json({
                success: true,
                message: "Preferencias guardadas correctamente",
                data: preference,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al guardar las preferencias",
                error: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
}