import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Role, RoleCreate, RoleUpdate } from '../models/Roles';

export class RolesRepository {
    private readonly tableName = 'roles';

    async findAll(): Promise<Role[]> {
        const [rows] = await pool.execute<any[]>(
            `SELECT r.id, r.name, r.id_state, gs.name AS state_name
             FROM ${this.tableName} r
             JOIN general_status gs ON r.id_state = gs.id
             WHERE r.deleted_at IS NULL`
        );
        return rows;
    }

    async findById(id: number): Promise<Role | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT r.id, r.name, r.id_state, gs.name AS state_name
             FROM ${this.tableName} r
             JOIN general_status gs ON r.id_state = gs.id
             WHERE r.id = ? AND r.deleted_at IS NULL`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findByName(name: string): Promise<Role | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT name
             FROM ${this.tableName}
             WHERE name = ? AND deleted_at IS NULL`,
            [name]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async create(role: RoleCreate): Promise<Role> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `INSERT INTO ${this.tableName} (name, id_state, created_at) VALUES (?, ?, NOW())`,
            [role.name, role.id_state]
        );
        const insertId = result.insertId;
        const newRole = await this.findById(insertId);
        if (!newRole) {
            throw new Error('Error al crear el rol');
        }
        return newRole;
    }

    async update(id: number, role: RoleUpdate): Promise<Role | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (role.name !== undefined) {
            updates.push('name = ?');
            values.push(role.name);
        }
        if (role.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(role.id_state);
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