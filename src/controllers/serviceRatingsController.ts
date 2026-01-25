import { Request, Response } from "express";
import { ServiceRatingsServices } from "../services/serviceRatingsServices";
import { validationResult } from "express-validator";

export class ServiceRatingsController {
    private serviceRatingsServices: ServiceRatingsServices;

    constructor() {
        this.serviceRatingsServices = new ServiceRatingsServices();
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

            const rating = await this.serviceRatingsServices.createRating(req.body);

            res.status(200).json({
                success: true,
                message: 'Feedback guardado exitosamente',
                data: rating
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al guardar el feedback',
                error: error instanceof Error ? error.message : 'Error desconocido'
            })
        }
    }
}