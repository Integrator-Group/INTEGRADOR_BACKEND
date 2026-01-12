import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Area, AreaCreate, AreaUpdate } from '../models/Areas';

export class AreasRepository {
    private readonly tableName = 'areas'

    async findAll(): Promise<Area[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ar.id,
                ar.id_branch,
                br.name AS branch_name,
                ar.name,
                ar.id_state,
                gs.name AS state_name
            FROM ${this.tableName} as ar
            JOIN branches br ON ar.id_branch = br.id
            JOIN general_status gs ON ar.id_state = gs.id
            WHERE ar.deleted_at IS NULL
            `
        )

        return rows;
    }

    async findById(id: number): Promise<Area | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ar.id,
                ar.id_branch,
                br.name AS branch_name,
                ar.name,
                ar.id_state,
                gs.name AS state_name
            FROM ${this.tableName} AS ar
            JOIN branches br ON ar.id_branch = br.id
            JOIN general_status gs ON ar.id_state = gs.id
            WHERE ar.id = ? AND ar.deleted_at IS NULL
            `,
            [id]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async findByBranchAndName(id_branche: number, name: string): Promise<Area | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ar.id_branch,
                ar.name
            FROM ${this.tableName} as ar
            WHERE ar.id_branch = ? AND ar.name = ? AND ar.id_state = 1 AND ar.deleted_at IS NULL
            `,
            [id_branche, name]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async findByBranche(id_branch: number): Promise<Area[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ar.id,
                ar.id_branch,
                br.name AS branch_name,
                ar.name,
                ar.id_state,
                gs.name AS state_name
            FROM ${this.tableName} as ar
            JOIN branches br ON ar.id_branch = br.id
            JOIN general_status gs ON ar.id_state = gs.id
            WHERE ar.id_branch = ? AND ar.deleted_at IS NULL
            `,
            [id_branch]
        )

        return rows;
    }

    async findByArea(name: string): Promise<Area | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ar.id_branch,
                br.name AS branch_name
            FROM ${this.tableName} as ar
            JOIN branches br ON ar.id_branch = br.id
            WHERE ar.name = ? AND ar.id_state = 1 AND ar.deleted_at IS NULL
            `,
            [name]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async create(Area: AreaCreate): Promise<Area> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
            (id_branch, name, id_state, created_at)
            VALUES
            (?,?,?,NOW())
            `,
            [Area.id_branch, Area.name, Area.id_state]
        );

        const { insertId } = result;
        const newArea = await this.findById(insertId);
        if (!newArea) {
            throw new Error('Error al crear el area');
        }
        return newArea;
    }

    async update(id: number, Area: AreaUpdate): Promise<Area | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (Area.id_branch !== undefined) {
            updates.push('id_branch = ?');
            values.push(Area.id_branch);
        }

        if (Area.name !== undefined) {
            updates.push('name = ?');
            values.push(Area.name);
        }

        if (Area.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(Area.id_state);
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