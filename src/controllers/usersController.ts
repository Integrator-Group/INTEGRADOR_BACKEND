import { Request, Response } from 'express';
import { UsersService } from '../services/usersService';
import { UserOrdersService } from '../services/userOrdersService';
import { validationResult } from 'express-validator';

export class UsersController {
    private usersService: UsersService;
    private userOrdersService: UserOrdersService;

    constructor() {
        this.usersService = new UsersService();
        this.userOrdersService = new UserOrdersService();
    }

    getOrdersAndPayments = async (req: Request, res: Response): Promise<void> => {
        try {
            const id_user = parseInt(req.params.id_user, 10);
            if (isNaN(id_user)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido',
                });
                return;
            }

            const limitRaw = req.query.limit as string | undefined;
            const offsetRaw = req.query.offset as string | undefined;

            const limit = limitRaw ? Number(limitRaw) : 50;
            const offset = offsetRaw ? Number(offsetRaw) : 0;

            if (!Number.isFinite(limit) || Number.isNaN(limit) || limit <= 0) {
                res.status(400).json({
                    success: false,
                    message: "El query param 'limit' debe ser un número mayor a 0",
                });
                return;
            }

            if (!Number.isFinite(offset) || Number.isNaN(offset) || offset < 0) {
                res.status(400).json({
                    success: false,
                    message: "El query param 'offset' debe ser un número mayor o igual a 0",
                });
                return;
            }

            const safeLimit = Math.min(Math.floor(limit), 200);
            const safeOffset = Math.floor(offset);

            const data = await this.userOrdersService.getOrdersAndPaymentsByUser(
                id_user,
                safeLimit,
                safeOffset
            );

            res.status(200).json({
                success: true,
                data,
                meta: { limit: safeLimit, offset: safeOffset, count: data.length },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener las órdenes y pagos del usuario',
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