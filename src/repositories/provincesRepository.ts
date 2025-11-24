import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Province, ProvinceCreate, ProvinceUpdate } from '../models/Provinces';

export class ProvincesRepository {
    private readonly tableName = 'provinces';

    async findAll(): Promise<Province[]> {
        const [rows] = await pool.execute<any[]>(
            `SELECT p.id, p.name, p.id_state, gs.name AS state_name
             FROM ${this.tableName} p
             JOIN general_status gs ON p.id_state = gs.id
             WHERE p.deleted_at IS NULL`
        );
        return rows;
    }

    async findById(id: number): Promise<Province | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT p.id, p.name, p.id_state, gs.name AS state_name
             FROM ${this.tableName} p
             JOIN general_status gs ON p.id_state = gs.id
             WHERE p.id = ? AND p.deleted_at IS NULL`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findByName(name: string): Promise<Province | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT name
             FROM ${this.tableName}
             WHERE name = ? AND deleted_at IS NULL`,
            [name]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async create(province: ProvinceCreate): Promise<Province> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `INSERT INTO ${this.tableName} (name, id_state, created_at) VALUES (?, ?, NOW())`,
            [province.name, province.id_state]
        );
        const insertId = result.insertId;
        const newProvince = await this.findById(insertId);
        if (!newProvince) {
            throw new Error('Error al crear la provincia');
        }
        return newProvince;
    }

    async update(id: number, province: ProvinceUpdate): Promise<Province | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (province.name !== undefined) {
            updates.push('name = ?');
            values.push(province.name);
        }
        if (province.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(province.id_state);
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

