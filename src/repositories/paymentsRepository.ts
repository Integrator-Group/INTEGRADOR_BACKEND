import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Payment, PaymentCreate, PaymentUpdate } from '../models/Payments';

export class PaymentsRepository {
    private readonly tableName = 'payments';

    async findById(id: number): Promise<Payment | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                py.id,
                py.id_appointment,
                py.amount,
                py.id_method,
                py.id_status_payment,
                py.paid_at
            FROM ${this.tableName} py
            WHERE py.id = ?
            `,
            [id]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async findByAppointmentId(id_appointment: number): Promise<Payment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                py.id,
                py.id_appointment,
                py.amount,
                py.id_method,
                py.id_status_payment,
                py.paid_at
            FROM ${this.tableName} py
            WHERE py.id_appointment = ?
            `,
            [id_appointment]
        );
        return rows;
    }

    async create(payment: PaymentCreate): Promise<Payment> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
                (id_appointment, amount, id_method, id_status_payment, paid_at, created_at)
            VALUES
                (?,?,?,?,?,NOW())
            `,
            [
                payment.id_appointment, payment.amount, payment.id_method, payment.id_status_payment, payment.paid_at ?? null
            ]
        )

        const { insertId } = result;
        const newPayment = await this.findById(insertId);
        if (!newPayment) {
            throw new Error('Error al crear el pago')
        }

        return newPayment;
    }

    async update(id: number, payment: PaymentUpdate): Promise<Payment | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if(payment.id_status_payment !== undefined) {
            updates.push('id_status_payment = ?');
            values.push(payment.id_status_payment)
        }

        if(payment.paid_at !== undefined) {
            updates.push('paid_at = ?');
            values.push(payment.paid_at)
        }

        if (updates.length === 0) {
            return this.findById(id);
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
        )

        return this.findById(id);
    }
}