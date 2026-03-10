import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Schedule, ScheduleCreate, ScheduleUpdate, ScheduleWithAppointments } from '../models/Schedules';

export class SchedulesRepository {
    private readonly tableName = 'schedules';

    async findAll(): Promise<Schedule[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                sc.id,
                sc.id_user,
                sc.id_branch,
                sc.day,
                sc.start_time,
                sc.end_time,
                sc.is_available,
                sc.created_at,
                sc.updated_at,
                sc.deleted_at
            FROM ${this.tableName} AS sc
            WHERE sc.deleted_at IS NULL
            `
        )

        return rows;
    }

    async findById(id: number): Promise<Schedule | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                sc.id,
                sc.id_user,
                sc.id_branch,
                sc.day,
                sc.start_time,
                sc.end_time,
                sc.is_available,
                sc.created_at,
                sc.updated_at,
                sc.deleted_at
            FROM ${this.tableName} AS sc
            WHERE sc.id = ? AND sc.deleted_at IS NULL
            `,
            [id]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    private buildScheduleWithAppointmentsSelect(): string {
        return `
            SELECT
                sc.id,
                sc.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                sc.id_branch,
                br.name AS name_branch,
                sc.day,
                sc.start_time,
                sc.end_time,
                sc.is_available,
                sc.created_at,
                sc.updated_at,
                sc.deleted_at,
                (
                    SELECT COALESCE(JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', ap.id,
                            'seq_val', ap.seq_val,
                            'start_time', ap.start_time,
                            'end_time', ap.end_time,
                            'state_name', aps.name,
                            'id_state_appointment', ap.id_state_appointment
                        )
                    ), JSON_ARRAY())
                    FROM appointments ap
                    JOIN appointment_status aps ON ap.id_state_appointment = aps.id
                    WHERE ap.id_schedule = sc.id AND ap.id_state_appointment IN (1, 2)
                ) AS appointments
            FROM ${this.tableName} AS sc
            LEFT JOIN users us ON sc.id_user = us.id
            LEFT JOIN branches br ON sc.id_branch = br.id
            WHERE sc.deleted_at IS NULL
        `;
    }

    private parseScheduleWithAppointments(row: any): ScheduleWithAppointments {
        const appointments = typeof row.appointments === 'string'
            ? JSON.parse(row.appointments || '[]')
            : (row.appointments || []);
        const { appointments: _, ...scheduleData } = row;
        return {
            ...scheduleData,
            appointments: Array.isArray(appointments) ? appointments : []
        };
    }

    async findSchedulesByUser(id_user: number, day: string): Promise<Schedule[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                sc.id,
                sc.id_user,
                sc.id_branch,
                sc.day,
                sc.start_time,
                sc.end_time,
                sc.is_available,
                sc.created_at,
                sc.updated_at,
                sc.deleted_at
            FROM ${this.tableName} AS sc
            WHERE sc.id_user = ? AND sc.day = ? AND sc.deleted_at IS NULL
            `,
            [id_user, day]
        )

        return rows;
    }

    async findSchedulesByUserWithAppointments(id_user: number, day: string): Promise<ScheduleWithAppointments[]> {
        const [rows] = await pool.execute<any[]>(
            `${this.buildScheduleWithAppointmentsSelect()} AND sc.id_user = ? AND sc.day = ?`,
            [id_user, day]
        );
        return rows.map((row) => this.parseScheduleWithAppointments(row));
    }

    async findSchedulesByAreaWithAppointments(id_area: number, day: string): Promise<ScheduleWithAppointments[]> {
        const [rows] = await pool.execute<any[]>(
            `${this.buildScheduleWithAppointmentsSelect()} AND us.id_area = ? AND us.deleted_at IS NULL AND sc.day = ?`,
            [id_area, day]
        );
        return rows.map((row) => this.parseScheduleWithAppointments(row));
    }


    async create(schedule: ScheduleCreate): Promise<Schedule> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
            (id_user, id_branch, day, start_time, end_time, is_available, created_at)
            VALUES
            (?,?,?,?,?,?,NOW())
            `,
            [schedule.id_user ?? null, schedule.id_branch ?? null, schedule.day, schedule.start_time, schedule.end_time, schedule.is_available]
        )

        const { insertId } = result;
        const newSchedule = await this.findById(insertId);
        if (!newSchedule) {
            throw new Error('Error al crear el horario');
        }
        return newSchedule;
    }

    async update(id:number, schedule: ScheduleUpdate): Promise<Schedule | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (schedule.id_user !== undefined) {
            updates.push('id_user = ?');
            values.push(schedule.id_user);
        }
        if (schedule.id_branch !== undefined) {
            updates.push('id_branch = ?');
            values.push(schedule.id_branch);
        }
        if (schedule.day !== undefined) {
            updates.push('day = ?');
            values.push(schedule.day);
        }
        if (schedule.start_time !== undefined) {
            updates.push('start_time = ?');
            values.push(schedule.start_time);
        }
        if (schedule.end_time !== undefined) {
            updates.push('end_time = ?');
            values.push(schedule.end_time);
        }
        if (schedule.is_available !== undefined) {
            updates.push('is_available = ?');
            values.push(schedule.is_available);
        }

        updates.push('updated_at = NOW()');
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

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `UPDATE ${this.tableName} 
             SET deleted_at = NOW() 
             WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    } 
}