import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppointmentsServices } from "../services/appointmentsServices";

export class AppointmentsController {
    private readonly appointmentsServices: AppointmentsServices;

    constructor() {
        this.appointmentsServices = new AppointmentsServices;
    }

    getAll = async(_req: Request, res: Response): Promise<void> => {
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

    getScheduledByUser = async(req: Request, res: Response): Promise<void> => {
        try {
            const id_user = parseInt(req.params.id_user, 10);
            if (isNaN(id_user)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const appointments = await this.appointmentsServices.getScheduledByUser(id_user);
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

    getFilledByUser = async(req: Request, res: Response): Promise<void> => {
        try {
            const id_user = parseInt(req.params.id_user, 10);
            if (isNaN(id_user)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const appointments = await this.appointmentsServices.getFilledByUser(id_user);
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

    getCanceledByUser = async(req: Request, res: Response): Promise<void> => {
        try {
            const id_user = parseInt(req.params.id_user, 10);
            if (isNaN(id_user)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const appointments = await this.appointmentsServices.getCanceledByUser(id_user);
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

    getAllByProfessional = async(req: Request, res: Response): Promise<void> => {
        try {
            const id_professional = parseInt(req.params.id_professional, 10);
            if (isNaN(id_professional)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }
            const date = req.query.date as string;
            if (!date) {
                const appointments = await this.appointmentsServices.getAllAppointmentsByProfessional(id_professional);
                res.status(200).json({
                    success: true,
                    data: appointments
                })
                return;
            }

            const appointments = await this.appointmentsServices.getAllAppointmentsByProfessionalDate(id_professional, date);
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

    getScheduledByProfessional = async(req: Request, res: Response): Promise<void> => {
        try {
            const id_professional = parseInt(req.params.id_professional, 10);
            if (isNaN(id_professional)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const appointments = await this.appointmentsServices.getScheduledByProfessional(id_professional);
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

    getFilledByProfessional = async(req: Request, res: Response): Promise<void> => {
        try {
            const id_professional = parseInt(req.params.id_professional, 10);
            if (isNaN(id_professional)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const appointments = await this.appointmentsServices.getFilledByProfessional(id_professional);
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

    getCanceledByProfessional = async(req: Request, res: Response): Promise<void> => {
        try {
            const id_professional = parseInt(req.params.id_professional, 10);
            if (isNaN(id_professional)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                })
                return;
            }

            const appointments = await this.appointmentsServices.getCanceledByProfessional(id_professional);
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

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                })

                return;
            }

            const appointment = await this.appointmentsServices.createAppointment(req.body);

            res.status(200).json({
                success: true,
                message: 'Cita agendada con éxito',
                data: appointment
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al agendar la cita',
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
                    message: 'Errores de validación',
                    errors: errors.array()
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

            const appointment = await this.appointmentsServices.updateAppointment(id, req.body);

            res.status(200).json({
                success: true,
                message:'Cita actualizada exitosamente',
                data: appointment
            })
        } catch (error) {
            if (error instanceof Error && error.message === 'Cita no encontrada') {
                res.status(404).json({
                    success: false,
                    message: error.message
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error l actualizar la cita',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                })
            }
        }
    }

    cancel = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "ID inválido",
                });
                return;
            }

            const appointment = await this.appointmentsServices.cancelAppointment(id);
            res.status(200).json({
                success: true,
                message: "Cita cancelada y pago reversado (si existía)",
                data: appointment,
            });
        } catch (error) {
            if (error instanceof Error && error.message === "Cita no encontrada") {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Error al cancelar la cita",
                error: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
}