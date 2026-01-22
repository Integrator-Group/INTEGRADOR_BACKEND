import { AppointmentsRepository } from "../repositories/appointmentsRepository";
import { Appointment } from "../models/Appointments";

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

    async getAllAppointmentsByProfessional(id_professional: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findAllByProfessional(id_professional);
    }
}