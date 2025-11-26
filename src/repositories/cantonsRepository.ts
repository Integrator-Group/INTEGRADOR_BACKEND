import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Canton, CantonCreate, CantonUpdate } from '../models/Cantons';

export class CantonsRepository {
    private readonly tableName = 'cantons';

    async findAll(): Promise<Canton[]> {
        const [rows] = await pool.execute<any[]>(
            `SELECT c.id, c.name, c.id_province, c.id_state, gs.name AS state_name
             FROM ${this.tableName} c
             JOIN general_status gs ON c.id_state = gs.id
             WHERE c.deleted_at IS NULL`
        );
        return rows;
    }

    async findById(id: number): Promise<Canton | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT c.id, c.name, c.id_province, c.id_state, gs.name AS state_name
             FROM ${this.tableName} c
             JOIN general_status gs ON c.id_state = gs.id
             WHERE c.id = ? AND c.deleted_at IS NULL`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findByName(name: string): Promise<Canton | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT name
             FROM ${this.tableName}
             WHERE name = ? AND deleted_at IS NULL`,
            [name]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findByProvince(id_province: number): Promise<Canton[]> {
        const [rows] = await pool.execute<any[]>(
            `SELECT c.id, c.name, c.id_province, c.id_state, gs.name AS state_name
             FROM ${this.tableName} c
             JOIN general_status gs ON c.id_state = gs.id
             WHERE c.id_province = ? AND c.deleted_at IS NULL`,
            [id_province]
        );
        return rows;
    }

    async create(canton: CantonCreate): Promise<Canton> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `INSERT INTO ${this.tableName} (name, id_province, id_state, created_at) VALUES (?, ?, ?, NOW())`,
            [canton.name, canton.id_province, canton.id_state]
        );
        const insertId = result.insertId;
        const newCanton = await this.findById(insertId);
        if (!newCanton) {
            throw new Error('Error al crear el cantón');
        }
        return newCanton;
    }

    async update(id: number, canton: CantonUpdate): Promise<Canton | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (canton.name !== undefined) {
            updates.push('name = ?');
            values.push(canton.name);
        }
        if (canton.id_province !== undefined) {
            updates.push('id_province = ?');
            values.push(canton.id_province);
        }
        if (canton.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(canton.id_state);
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

