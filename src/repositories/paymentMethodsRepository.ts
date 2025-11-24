import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { PaymentMethod, PaymentMethodCreate, PaymentMethodUpdate } from '../models/Payment_Methods';

export class PaymentMethodsRepository {
    private readonly tableName = 'payment_methods';

    async findAll(): Promise<PaymentMethod[]> {
        const [rows] = await pool.execute<any[]>(
            `SELECT pm.id, pm.name, pm.id_state, gs.name AS state_name
             FROM ${this.tableName} pm
             JOIN general_status gs ON pm.id_state = gs.id
             WHERE pm.deleted_at IS NULL`
        );
        return rows;
    }
    
    async findById(id: number): Promise<PaymentMethod | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT pm.id, pm.name, pm.id_state, gs.name AS state_name
             FROM ${this.tableName} pm
             JOIN general_status gs ON pm.id_state = gs.id
             WHERE pm.id = ? AND pm.deleted_at IS NULL`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }
    
    async findByName(name: string): Promise<PaymentMethod | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT name 
             FROM ${this.tableName}
             WHERE name = ? AND deleted_at IS NULL`,
            [name]
        );
        return rows.length > 0 ? rows[0] : null;
    }
    
    async create(paymentMethod: PaymentMethodCreate): Promise<PaymentMethod> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `INSERT INTO ${this.tableName} (name, id_state, created_at) VALUES (?, ?, NOW())`,
            [paymentMethod.name, paymentMethod.id_state]
        );
        const insertId = result.insertId;
        const newPaymentMethod = await this.findById(insertId);
        if (!newPaymentMethod) {
            throw new Error('Error al crear el método de pago');
        }
        return newPaymentMethod;
    }
    
    async update(id: number, paymentMethod: PaymentMethodUpdate): Promise<PaymentMethod | null> {
        const updates: string[] = [];
        const values: any[] = [];
        if (paymentMethod.name !== undefined) {
            updates.push('name = ?');
            values.push(paymentMethod.name);
        }
        if (paymentMethod.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(paymentMethod.id_state);
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