import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PaymentStatusService } from '../services/paymentStatusService';

export class PaymentStatusController {
    private readonly paymentStatusService: PaymentStatusService;

    constructor() {
        this.paymentStatusService = new PaymentStatusService();
    }

    getAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const paymentStatuses = await this.paymentStatusService.getAllPaymentStatuses();
            res.status(200).json({
                success: true,
                data: paymentStatuses,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los estados de pago',
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

            const paymentStatus = await this.paymentStatusService.getPaymentStatusById(id);
            res.status(200).json({
                success: true,
                data: paymentStatus,
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Estado de pago no encontrado') {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener el estado de pago',
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

            const paymentStatus = await this.paymentStatusService.createPaymentStatus(req.body);
            res.status(201).json({
                success: true,
                message: 'Estado de pago creado exitosamente',
                data: paymentStatus,
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'El nombre del estado de pago ya existe') {
                res.status(409).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al crear el estado de pago',
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

            const paymentStatus = await this.paymentStatusService.updatePaymentStatus(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Estado de pago actualizado exitosamente',
                data: paymentStatus,
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Estado de pago no encontrado') {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else if (error instanceof Error && error.message === 'El nombre del estado de pago ya existe') {
                res.status(409).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al actualizar el estado de pago',
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

            await this.paymentStatusService.deletePaymentStatus(id);
            res.status(200).json({
                success: true,
                message: 'Estado de pago eliminado exitosamente',
            });
        } catch (error) {
            if (error instanceof Error && error.message === 'Estado de pago no encontrado') {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al eliminar el estado de pago',
                    error: error instanceof Error ? error.message : 'Error desconocido',
                });
            }
        }
    };
}

