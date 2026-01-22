import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppointmentsServices } from "../services/appointmentsServices";

export class AppointmentsController {
    private readonly appointmentsServices: AppointmentsServices;

    constructor() {
        this.appointmentsServices = new AppointmentsServices;
    }

    getAll = async(req: Request, res: Response): Promise<void> => {
        try {
            const appointments = await this.appointmentsServices.getAllAppointments();
            res.status(200).json({
                success: true,
                data: appointments
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener las citas',
                error: error instanceof Error ? error.message : 'Error desconocido'
            })
        }
    }

    getAllByUser = async(req: Request, res: Response): Promise<void> => {
        try {
            const id_user = parseInt(req.params.id_user, 10);
            if (isNaN(id_user)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const appointments = await this.appointmentsServices.getAllAppointmentsByUser(id_user);
            res.status(200).json({
                success: true,
                data: appointments
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener las citas',
                error: error instanceof Error ? error.message : 'Error desconocido',
              });
        }
    }

    getAllByProffesional = async(req: Request, res: Response): Promise<void> => {
        try {
            const id_professional = parseInt(req.params.id_professional, 10);
            if (isNaN(id_professional)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const appointments = await this.appointmentsServices.getAllAppointmentsByProfessional(id_professional);
            res.status(200).json({
                success: true,
                data: appointments
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener las citas',
                error: error instanceof Error ? error.message : 'Error desconocido',
              });
        }
    }
}