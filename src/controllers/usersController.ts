import { Request, Response } from 'express';
import { UsersService } from '../services/usersService';
import { validationResult } from 'express-validator';

export class UsersController {
    private usersService: UsersService;

    constructor() {
        this.usersService = new UsersService();
    }

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
            const user = await this.usersService.getUserById(id);
            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuario no encontrado') {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener el usuario',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        }
    };

    getByRole = async (req: Request, res: Response): Promise<void> => {
        try {
            const id_role = parseInt(req.params.id_role, 10);
            if (isNaN(id_role)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de rol inválido',
                });
                return;
            }
            const users = await this.usersService.getUsersByRole(id_role);
            res.status(200).json({
                success: true,
                data: users,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los usuarios por rol',
                error: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    };

    getByArea = async (req: Request, res: Response): Promise<void> => {
        try {
            const id_area = parseInt(req.params.id_area, 10);
            if (isNaN(id_area)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de area inválido',
                });
            }
            const users = await this.usersService.getUsersByArea(id_area);
            res.status(200).json({
                success: true,
                data: users,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los usuarios por area',
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

            const user = await this.usersService.createUser(req.body);
            res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente',
                data: user,
            });
        } catch (error) {
            if (error instanceof Error && (
                error.message === 'La identificación ya está registrada' ||
                error.message === 'El email ya está registrado' ||
                error.message === 'El teléfono ya está registrado'
            )) {
                res.status(409).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al crear el usuario',
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

            const user = await this.usersService.updateUser(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: user,
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuario no encontrado') {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else if (error instanceof Error && (
                error.message === 'La identificación ya está registrada' ||
                error.message === 'El email ya está registrado' ||
                error.message === 'El teléfono ya está registrado'
            )) {
                res.status(409).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al actualizar el usuario',
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

            await this.usersService.deleteUser(id);
            res.status(200).json({
                success: true,
                message: 'Usuario eliminado exitosamente',
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Usuario no encontrado') {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al eliminar el usuario',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        }
    };
}