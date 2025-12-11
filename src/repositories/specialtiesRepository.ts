import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Specialtie, SpecialtieCreate, SpecialtieUpdate } from '../models/Specialties';

export class SpecialtieRepository {
    private readonly tableName = 'specialties';

    async findAll(): Promise<Specialtie[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                sp.id,
                sp.id_branch,
                br.name AS name_branch,
                sp.id_area,
                ar.name AS name_area,
                sp.name,
                sp.id_state,
                gs.name AS name_state
            FROM ${this.tableName} AS sp
            JOIN branches br ON sp.id_branch = br.id
            JOIN areas ar ON sp.id_area = ar.id
            JOIN general_status gs ON sp.id_state = gs.id
            WHERE sp.deleted_at IS NULL
            `
        )

        return rows;
    }

    async findById(id: number): Promise<Specialtie | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                sp.id,
                sp.id_branch,
                br.name AS name_branch,
                sp.id_area,
                ar.name AS name_area,
                sp.name,
                sp.id_state,
                gs.name AS name_state
            FROM ${this.tableName} AS sp
            JOIN branches br ON sp.id_branch = br.id
            JOIN areas ar ON sp.id_area = ar.id
            JOIN general_status gs ON sp.id_state = gs.id
            WHERE sp.id = ? AND sp.deleted_at IS NULL
            `,
            [id]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async findByBranchAndArea(id_branch: number, id_area?: number): Promise<Specialtie[]> {
        if (id_area === undefined || id_area === null) {
            const [rows] = await pool.execute<any[]>(
              `
                SELECT
                    sp.id,
                    sp.id_branch,
                    br.name AS name_branch,
                    sp.id_area,
                    ar.name AS name_area,
                    sp.name,
                    sp.id_state,
                    gs.name AS name_state
                FROM ${this.tableName} AS sp
                JOIN branches br ON sp.id_branch = br.id
                JOIN areas ar ON sp.id_area = ar.id
                JOIN general_status gs ON sp.id_state = gs.id
                WHERE sp.deleted_at IS NULL
                    AND sp.id_branch = ?
                `,
                [id_branch]
            );
            return rows;
        } else {
            const [rows] = await pool.execute<any[]>(
                `
                SELECT
                    sp.id,
                    sp.id_branch,
                    br.name AS name_branch,
                    sp.id_area,
                    ar.name AS name_area,
                    sp.name,
                    sp.id_state,
                    gs.name AS name_state
                FROM ${this.tableName} AS sp
                JOIN branches br ON sp.id_branch = br.id
                JOIN areas ar ON sp.id_area   = ar.id
                JOIN general_status gs ON sp.id_state = gs.id
                WHERE sp.deleted_at IS NULL
                    AND sp.id_branch = ?
                    AND sp.id_area = ?
                `,
                [id_branch, id_area]
            );
            return rows;
        }
    }      

    async findByBranchAndAreaAndName(id_branch: number, id_area: number, name: string): Promise<Specialtie | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                sp.id_branch,
                sp.id_area,
                sp.name
            FROM ${this.tableName} AS sp
            WHERE sp.id_branch = ? AND sp.id_area = ? AND sp.name = ? AND sp.id_state = 1 AND sp.deleted_at IS NULL
            `,
            [id_branch, id_area, name]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async create(Specialtie: SpecialtieCreate): Promise<Specialtie> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
            (id_branch, id_area, name, id_state, created_at)
            VALUES
            (?,?,?,?,NOW())
            `,
            [Specialtie.id_branch, Specialtie.id_area, Specialtie.name, Specialtie.id_state]
        )

        const { insertId } = result;
        const newSpecialtie = await this.findById(insertId);
        if (!newSpecialtie) {
            throw new Error('Error al crear la especialidad');
        }
        return newSpecialtie;
    }

    async update(id: number, Specialtie: SpecialtieUpdate): Promise<Specialtie | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (Specialtie.id_branch !== undefined) {
            updates.push('id_branch = ?');
            values.push(Specialtie.id_branch);
        }

        if (Specialtie.id_area !== undefined) {
            updates.push('id_area = ?');
            values.push(Specialtie.id_area);
        }

        if (Specialtie.name !== undefined) {
            updates.push('name = ?');
            values.push(Specialtie.name);
        }

        if (Specialtie.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(Specialtie.id_state);
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