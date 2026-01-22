import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Schedule, ScheduleCreate, ScheduleUpdate } from '../models/Schedules';

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