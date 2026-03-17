import mysq12 from 'mysql2/promise';
import pool from '../config/database';
import { Appointment, AppointmentCreate, AppointmentUpdate } from '../models/Appointments';

export class AppointmentsRepository {
    private readonly tableName = 'appointments';
    private readonly canceledStateId = 3;
    private readonly reversedPaymentStatusId = 4;

    async findAll(): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
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
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                us.email AS user_email,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name,
                ap.schedule_date
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
                ap.seq_val,
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
                ap.seq_val,
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
                ap.seq_val,
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
                ap.seq_val,
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

    async findAllByProfessionalDate(id_professional: number, startDate: string, endDate: string): Promise<Appointment[]> {
        const startDateFormatted = new Date(startDate).toISOString().split('T')[0];
        const endDateFormatted = new Date(endDate).toISOString().split('T')[0];
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
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
                aps.name AS state_name,
                ap.schedule_date
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_professional = ?
              AND ap.schedule_date >= ?
              AND ap.schedule_date <= ?
            ORDER BY ap.schedule_date ASC, ap.start_time ASC
            `,
            [id_professional, startDateFormatted, endDateFormatted]
        );

        return rows;
    }

    async findAllByProfessional(id_professional: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
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
                aps.name AS state_name,
                ap.schedule_date
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
                ap.seq_val,
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
                ap.seq_val,
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
                ap.seq_val,
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

    async findAllByBranch(id_branch: number, startDate: string, endDate: string): Promise<Appointment[]> {
        const startDateFormatted = new Date(startDate).toISOString().split('T')[0];
        const endDateFormatted = new Date(endDate).toISOString().split('T')[0];

        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
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
                aps.name AS state_name,
                ap.schedule_date
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_branch = ?
              AND ap.schedule_date >= ?
              AND ap.schedule_date <= ?
            ORDER BY ap.schedule_date ASC, ap.start_time ASC
            `,
            [id_branch, startDateFormatted, endDateFormatted]
        );

        return rows;
    }

    async create(appointmentCreate: AppointmentCreate): Promise<Appointment> {
        const [result] = await pool.execute<mysq12.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
                (seq_val, id_user, id_professional, id_branch, id_service, id_schedule, 
                start_time, end_time, id_state_appointment, schedule_date, created_at)
            VALUES
                (?,?,?,?,?,?,?,?,?,?,NOW())
            `,
            [
                appointmentCreate.seq_val, appointmentCreate.id_user, appointmentCreate.id_professional, appointmentCreate.id_branch, 
                appointmentCreate.id_service, appointmentCreate.id_schedule, appointmentCreate.start_time,
                appointmentCreate.end_time, appointmentCreate.id_state_appointment ?? 1, appointmentCreate.schedule_date
            ]
        )

        const { insertId } = result;
        const newAppointment = await this.findById(insertId);

        if(!newAppointment) {
            throw new Error('Error al registrar la cita');
        }

        return newAppointment;
    }

    async createWithLoyalty(
        appointmentCreate: AppointmentCreate,
        pointsDelta: number,
        reason: string | null
    ): Promise<Appointment> {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.execute<mysq12.ResultSetHeader>(
                `
                INSERT INTO ${this.tableName}
                    (seq_val, id_user, id_professional, id_branch, id_service, id_schedule, 
                    start_time, end_time, id_state_appointment, schedule_date, created_at)
                VALUES
                    (?,?,?,?,?,?,?,?,?,?,NOW())
                `,
                [
                    appointmentCreate.seq_val,
                    appointmentCreate.id_user,
                    appointmentCreate.id_professional,
                    appointmentCreate.id_branch,
                    appointmentCreate.id_service,
                    appointmentCreate.id_schedule,
                    appointmentCreate.start_time,
                    appointmentCreate.end_time,
                    appointmentCreate.id_state_appointment ?? 1,
                    appointmentCreate.schedule_date,
                ]
            );

            const insertId = result.insertId;

            if (Number.isFinite(pointsDelta) && pointsDelta !== 0) {
                await conn.execute(
                    `
                    INSERT INTO customer_loyalty (id_user, points)
                    VALUES (?, 0)
                    ON DUPLICATE KEY UPDATE id_user = VALUES(id_user)
                    `,
                    [appointmentCreate.id_user]
                );

                await conn.execute(
                    `
                    UPDATE customer_loyalty
                    SET points = points + ?
                    WHERE id_user = ?
                    `,
                    [pointsDelta, appointmentCreate.id_user]
                );

                await conn.execute(
                    `
                    INSERT INTO loyalty_transactions (id_user, points_delta, reason, created_at)
                    VALUES (?, ?, ?, NOW())
                    `,
                    [appointmentCreate.id_user, pointsDelta, reason]
                );
            }

            await conn.commit();
            const created = await this.findById(insertId);
            if (!created) throw new Error('Error al registrar la cita');
            return created;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    async update(id: number, appointment: AppointmentUpdate): Promise<Appointment | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (appointment.id_branch !== undefined) {
            updates.push('id_branch = ?');
            values.push(appointment.id_branch)
        }

        if (appointment.id_schedule !== undefined) {
            updates.push('id_schedule = ?');
            values.push(appointment.id_schedule)
        }

        if (appointment.start_time !== undefined) {
            updates.push('start_time = ?');
            values.push(appointment.start_time)
        }

        if (appointment.end_time !== undefined) {
            updates.push('end_time = ?');
            values.push(appointment.end_time)
        }

        if (appointment.id_state_appointment !== undefined) {
            updates.push('id_state_appointment = ?');
            values.push(appointment.id_state_appointment)
        }

        if (appointment.schedule_date !== undefined) {
            updates.push('schedule_date = ?');
            values.push(appointment.schedule_date)
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        updates.push('updated_at = NOW()')
        values.push(id);
        await pool.execute(
            `
            UPDATE ${this.tableName}
            SET ${updates.join(', ')}
            WHERE id = ?
            `,
            values
        );

        return this.findById(id);
    }

    async cancelAndReversePayment(id_appointment: number): Promise<Appointment> {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [apptResult] = await conn.execute<mysq12.ResultSetHeader>(
                `
                UPDATE ${this.tableName}
                SET id_state_appointment = ?, updated_at = NOW()
                WHERE id = ?
                `,
                [this.canceledStateId, id_appointment]
            );

            if (apptResult.affectedRows === 0) {
                throw new Error('Cita no encontrada');
            }

            await conn.execute(
                `
                UPDATE payments
                SET id_status_payment = ?, updated_at = NOW()
                WHERE id_appointment = ?
                `,
                [this.reversedPaymentStatusId, id_appointment]
            );

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }

        const updated = await this.findById(id_appointment);
        if (!updated) throw new Error('Cita no encontrada');
        return updated;
    }
}