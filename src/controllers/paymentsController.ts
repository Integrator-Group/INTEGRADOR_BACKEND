import { Request, Response } from "express";
import { PaymentsServices } from "../services/paymentsServices";
import { validationResult } from "express-validator";

export class PaymentsController {
    private paymentsServices: PaymentsServices;

    constructor() {
        this.paymentsServices = new PaymentsServices();
    }

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                })

                return;
            }

            const payment = await this.paymentsServices.createPayment(req.body);

            res.status(200).json({
                success: true,
                message: 'Pago creado exitosamente',
                data: payment
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear el pago',
                error: error instanceof Error ? error.message : 'Error desconocido'
            })
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
                  message: "ID inválido",
                });
                return;
            }

            const payment = await this.paymentsServices.updatePayment(id, req.body);

            res.status(200).json({
                success: true,
                message: 'Pago actualizado correctamente',
                data: payment
            })
        } catch (error) {
            if (error instanceof Error && error.message === "Pago no encontrada"
            ) {
                res.status(404).json({
                  success: false,
                  message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Error al actualizar el pago",
                    error: error instanceof Error ? error.message : "Error desconocido",
                })
            }
        }
    }
}