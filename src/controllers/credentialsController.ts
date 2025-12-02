import { Request, Response } from 'express';
import { CredentialsService } from '../services/credentialsService';
import { validationResult } from 'express-validator';

export class CredentialsController {
    private credentialsService: CredentialsService;

    constructor() {
        this.credentialsService = new CredentialsService();
    }

    login = async (req: Request, res: Response): Promise<void> => {
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

            const loginResponse = await this.credentialsService.login(req.body);
            
            if (!loginResponse.success) {
                res.status(401).json({
                    success: false,
                    message: loginResponse.message,
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: loginResponse.message,
                data: loginResponse.user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al iniciar sesión',
                error: error instanceof Error ? error.message : 'Error desconocido',
            });
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

            const credential = await this.credentialsService.updateCredentials(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Credenciales actualizadas exitosamente',
                data: {
                    id: credential.id,
                    id_user: credential.id_user,
                    username: credential.username,
                    id_state: credential.id_state,
                },
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Credenciales no encontradas') {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else if (error instanceof Error && error.message === 'El username ya está en uso') {
                res.status(409).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al actualizar las credenciales',
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

            await this.credentialsService.deleteCredentials(id);
            res.status(200).json({
                success: true,
                message: 'Credenciales eliminadas exitosamente',
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Credenciales no encontradas') {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al eliminar las credenciales',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        }
    };
}