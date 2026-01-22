import mysq12 from 'mysql2/promise';
import pool from '../config/database';
import { Appointment } from '../models/Appointments';

export class AppointmentsRepository {
    private readonly tableName = 'appointments';

    async findAll(): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            `
        );

        return rows;
    }

    async findAllByUser(id_user: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_user = ?
            `,
            [id_user]
        );

        return rows;
    }

    async findAllByProfessional(id_professional: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_professional = ?
            `,
            [id_professional]
        );

        return rows;
    }
}