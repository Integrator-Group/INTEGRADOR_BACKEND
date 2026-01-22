import { AppointmentsRepository } from "../repositories/appointmentsRepository";
import { Appointment, AppointmentCreate, AppointmentUpdate } from "../models/Appointments";

export class AppointmentsServices {
    private readonly appointmentsRepository: AppointmentsRepository;

    constructor() {
        this.appointmentsRepository = new AppointmentsRepository();
    }

    async getAllAppointments(): Promise<Appointment[]> {
        return this.appointmentsRepository.findAll();
    }

    async getAllAppointmentsByUser(id_user: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findAllByUser(id_user);
    }

    async getScheduledByUser(id_user: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findScheduledByUser(id_user);
    }

    async getFilledByUser(id_user: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findFilledByUser(id_user);
    }

    async getCanceledByUser(id_user: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findCanceledByUser(id_user);
    }

    async getAllAppointmentsByProfessional(id_professional: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findAllByProfessional(id_professional);
    }

    async getScheduledByProfessional(id_professional: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findScheduledByProfessional(id_professional);
    }

    async getFilledByProfessional(id_professional: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findFilledByProfessional(id_professional);
    }

    async getCanceledByProfessional(id_professional: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findCanceledByProfessional(id_professional)
    }

    async createAppointment(appointment: AppointmentCreate): Promise<Appointment> {
        try {
            return await this.appointmentsRepository.create(appointment);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }

            throw new Error('Error al agendar la cita: ' + (error instanceof Error ? error.message : 'Error desconocido'))
        }
    }
}