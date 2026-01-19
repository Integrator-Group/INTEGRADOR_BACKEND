import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { PaymentStatus, PaymentStatusCreate, PaymentStatusUpdate } from '../models/Payment_Status';

export class PaymentStatusRepository {
    private readonly tableName = 'payment_status';

    async findAll(): Promise<PaymentStatus[]> {
        const [rows] = await pool.execute<any[]>(
            `SELECT ps.id, ps.name, ps.id_state, gs.name AS state_name
             FROM ${this.tableName} ps
             JOIN general_status gs ON ps.id_state = gs.id
             WHERE ps.deleted_at IS NULL`
        );
        return rows;
    }

    async findById(id: number): Promise<PaymentStatus | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT ps.id, ps.name, ps.id_state, gs.name AS state_name
             FROM ${this.tableName} ps
             JOIN general_status gs ON ps.id_state = gs.id
             WHERE ps.id = ? AND ps.deleted_at IS NULL`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findByName(name: string): Promise<PaymentStatus | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT name
             FROM ${this.tableName}
             WHERE name = ? AND deleted_at IS NULL`,
            [name]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async create(paymentStatus: PaymentStatusCreate): Promise<PaymentStatus> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `INSERT INTO ${this.tableName} (name, id_state, created_at) VALUES (?, ?, NOW())`,
            [paymentStatus.name, paymentStatus.id_state]
        );
        const insertId = result.insertId;
        const newPaymentStatus = await this.findById(insertId);
        if (!newPaymentStatus) {
            throw new Error('Error al crear el estado de pago');
        }
        return newPaymentStatus;
    }

    async update(id: number, paymentStatus: PaymentStatusUpdate): Promise<PaymentStatus | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (paymentStatus.name !== undefined) {
            updates.push('name = ?');
            values.push(paymentStatus.name);
        }
        if (paymentStatus.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(paymentStatus.id_state);
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

