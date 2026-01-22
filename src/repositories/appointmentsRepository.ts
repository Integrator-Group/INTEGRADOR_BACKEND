import mysq12 from 'mysql2/promise';
import pool from '../config/database';
import { Appointment, AppointmentCreate, AppointmentUpdate } from '../models/Appointments';

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

    async findById(id: number): Promise<Appointment | null> {
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
            WHERE ap.id = ?
            `,
            [id]
        );

        return rows.length > 0 ? rows[0] : null;
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

    async findScheduledByUser(id_user: number): Promise<Appointment[]> {
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
            WHERE ap.id_user = ? AND ap.id_state_appointment = 1
            `,
            [id_user]
        );

        return rows;
    }

    async findFilledByUser(id_user: number): Promise<Appointment[]> {
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
            WHERE ap.id_user = ? AND ap.id_state_appointment = 2
            `,
            [id_user]
        );

        return rows;
    }

    async findCanceledByUser(id_user: number): Promise<Appointment[]> {
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
            WHERE ap.id_user = ? AND ap.id_state_appointment = 3
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

    async findScheduledByProfessional(id_professional: number): Promise<Appointment[]> {
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
            WHERE ap.id_professional = ? AND ap.id_state_appointment = 1
            `,
            [id_professional]
        );

        return rows;
    }

    async findFilledByProfessional(id_professional: number): Promise<Appointment[]> {
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
            WHERE ap.id_professional = ? AND ap.id_state_appointment = 2
            `,
            [id_professional]
        );

        return rows;
    }

    async findCanceledByProfessional(id_professional: number): Promise<Appointment[]> {
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
            WHERE ap.id_professional = ? AND ap.id_state_appointment = 3
            `,
            [id_professional]
        );

        return rows;
    }

    async create(appointmentCreate: AppointmentCreate): Promise<Appointment> {
        const [result] = await pool.execute<mysq12.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
                (id_user, id_professional, id_branch, id_service, id_schedule, start_time, end_time, id_state_appointment, created_at)
            VALUES
                (?,?,?,?,?,?,?,1,NOW())
            `,
            [
                appointmentCreate.id_user, appointmentCreate.id_professional, appointmentCreate.id_branch, 
                appointmentCreate.id_service, appointmentCreate.id_schedule, appointmentCreate.start_time,
                appointmentCreate.end_time
            ]
        )

        const { insertId } = result;
        const newAppointment = await this.findById(insertId);

        if(!newAppointment) {
            throw new Error('Error al registrar la cita');
        }

        return newAppointment;
    }
}