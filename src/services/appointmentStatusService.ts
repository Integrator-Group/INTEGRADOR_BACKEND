import { AppointmentStatusRepository } from '../repositories/appointmentStatusRepository';
import { AppointmentState, AppointmentStateCreate, AppointmentStateUpdate } from '../models/Appointment_Status';

export class AppointmentStatusService {
    private appointmentStatusRepository: AppointmentStatusRepository;

    constructor() {
        this.appointmentStatusRepository = new AppointmentStatusRepository();
    }

    async getAllAppointmentStatuses(): Promise<AppointmentState[]> {
        return await this.appointmentStatusRepository.findAll();
    }
    
    async getAppointmentStatusById(id: number): Promise<AppointmentState> {
        const appointmentStatus = await this.appointmentStatusRepository.findById(id);
        if (!appointmentStatus) {
            throw new Error('Estado de la cita no encontrado');
        }
        return appointmentStatus;
    }

    async createAppointmentStatus(appointmentStatus: AppointmentStateCreate): Promise<AppointmentState> {
        try {
            const appointmentStatusExistente = await this.appointmentStatusRepository.findByName(appointmentStatus.name);
            if (appointmentStatusExistente) {
                throw new Error('El nombre del estado de la cita ya existe');
            }
            return await this.appointmentStatusRepository.create(appointmentStatus);
        } catch (error) {
            if (error instanceof Error && error.message === 'El nombre del estado de la cita ya existe') {
                throw error;
            }
            throw new Error('Error al crear el estado de la cita: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    async updateAppointmentStatus(id: number, appointmentStatus: AppointmentStateUpdate): Promise<AppointmentState> {
        try {
            const appointmentStatusExistente = await this.appointmentStatusRepository.findById(id);
            if (!appointmentStatusExistente) {
                throw new Error('Estado de la cita no encontrado');
            }
            const appointmentStatusActualizado = await this.appointmentStatusRepository.update(id, appointmentStatus);
            if (!appointmentStatusActualizado) {
                throw new Error('Error al actualizar el estado de la cita');
            }
            return appointmentStatusActualizado;
        } catch (error) {
            if (error instanceof Error && (error.message === 'Estado de la cita no encontrado' || error.message === 'El nombre del estado de la cita ya existe')) {
                throw error;
            }
            throw new Error('Error al actualizar el estado de la cita: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    async deleteAppointmentStatus(id: number): Promise<void> {
        const appointmentStatusExistente = await this.appointmentStatusRepository.findById(id);
        if (!appointmentStatusExistente) {
            throw new Error('Estado de la cita no encontrado');
        }
        await this.appointmentStatusRepository.delete(id);
    }
}