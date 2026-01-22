import { SchedulesRepository } from "../repositories/schedulesRepository";
import { Schedule, ScheduleCreate, ScheduleUpdate } from "../models/Schedules";

export class SchedulesServices {
    private schedulesRepository: SchedulesRepository;

    constructor() {
        this.schedulesRepository = new SchedulesRepository();
    }

    async findAll(): Promise<Schedule[]> {
        return this.schedulesRepository.findAll();
    }

    async findById(id: number): Promise<Schedule | null> {
        const schedule = await this.schedulesRepository.findById(id);
        if (!schedule) {
            throw new Error('Horario no encontrado');
        }
        return schedule;
    }
    
    async createSchedule(schedule: ScheduleCreate): Promise<Schedule> {
        try {
            return await this.schedulesRepository.create(schedule);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error desconocido al crear");
        }
    }

    async updateSchedule(id: number, schedule: ScheduleUpdate): Promise<Schedule | null> {
        try {
            const scheduleExists = await this.schedulesRepository.findById(id);
            if (!scheduleExists) {
                throw new Error('Horario no encontrado');
            }
            return await this.schedulesRepository.update(id, schedule);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error desconocido al actualizar");
        }
    }

    async deleteSchedule(id: number): Promise<void> {
        const scheduleExist = await this.schedulesRepository.findById(id);

        if (!scheduleExist) {
            throw new Error('Horario no encontrado')
        }

        await this.schedulesRepository.delete(id);
    }
}