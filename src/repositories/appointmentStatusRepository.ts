import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { AppointmentState, AppointmentStateCreate, AppointmentStateUpdate } from '../models/Appointment_Status';

export class AppointmentStatusRepository {
    private readonly tableName = 'appointment_status';

    async findAll(): Promise<AppointmentState[]> {
        const [rows] = await pool.execute<any[]>(
            `SELECT ap.id, ap.name, ap.id_state, gs.name AS state_name
             FROM ${this.tableName} ap
             JOIN general_status gs ON ap.id_state = gs.id
             WHERE ap.deleted_at IS NULL`
        );
        return rows;
    }

    async findById(id: number): Promise<AppointmentState | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT ap.id, ap.name, ap.id_state, gs.name AS state_name
             FROM ${this.tableName} ap
             JOIN general_status gs ON ap.id_state = gs.id
             WHERE ap.id = ? AND ap.deleted_at IS NULL`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findByName(name: string): Promise<AppointmentState | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT name 
             FROM ${this.tableName}
             WHERE name = ? AND deleted_at IS NULL`,
            [name]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async create(appointmentStatus: AppointmentStateCreate): Promise<AppointmentState> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `INSERT INTO ${this.tableName} (name, id_state, created_at) VALUES (?, ?, NOW())`,
            [appointmentStatus.name, appointmentStatus.id_state]
        );
        const insertId = result.insertId;
        const newAppointmentStatus = await this.findById(insertId);
        if (!newAppointmentStatus) {
            throw new Error('Error al crear el estado de la cita');
        }
        return newAppointmentStatus;
    }

    async update(id: number, appointmentStatus: AppointmentStateUpdate): Promise<AppointmentState | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (appointmentStatus.name !== undefined) {
            updates.push('name = ?');
            values.push(appointmentStatus.name);
        }
        if (appointmentStatus.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(appointmentStatus.id_state);
        }
        if (updates.length === 0) {
            return this.findById(id);
        }
        updates.push('updated_at = NOW()');
        values.push(id);
        await pool.execute(
            `UPDATE ${this.tableName} 
             SET ${updates.join(', ')} 
             WHERE id = ?`,
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