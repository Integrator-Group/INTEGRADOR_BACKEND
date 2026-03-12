import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Service, ServiceCreate, ServiceUpdate } from '../models/Services';

export class ServicesRepository {
    private readonly tableName = 'services';

    async findAll(limit: number, offset: number): Promise<Service[]> {
        const safeLimit = Number.isInteger(limit) ? limit : Math.floor(limit);
        const safeOffset = Number.isInteger(offset) ? offset : Math.floor(offset);
        if (!Number.isFinite(safeLimit) || safeLimit <= 0) throw new Error("Limit inválido");
        if (!Number.isFinite(safeOffset) || safeOffset < 0) throw new Error("Offset inválido");

        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                se.id,
                se.id_branch,
                br.name AS name_branch,
                se.id_area,
                ar.name AS name_area,
                se.name,
                se.description,
                se.duration_min,
                se.price,
                se.id_state,
                gs.name AS name_state
            FROM ${this.tableName} AS se
            JOIN branches br ON se.id_branch = br.id
            JOIN areas ar ON se.id_area = ar.id
            JOIN general_status gs ON se.id_state = gs.id
            WHERE se.deleted_at IS NULL
            ORDER BY se.id DESC
            LIMIT ${safeLimit} OFFSET ${safeOffset}
            `
        );
        return rows;
    }

    async findServicesByBranch(id_branch: number): Promise<Service[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                se.id,
                se.id_branch,
                br.name AS name_branch,
                se.id_area,
                ar.name AS name_area,
                se.name,
                se.description,
                se.duration_min,
                se.price,
                se.id_state,
                gs.name AS name_state
            FROM ${this.tableName} AS se
            JOIN branches br ON se.id_branch = br.id
            JOIN areas ar ON se.id_area = ar.id
            JOIN general_status gs ON se.id_state = gs.id
            WHERE se.id_branch = ? AND se.deleted_at IS NULL
            `,
            [id_branch]
        )

        return rows;
    }

    async findServiceById(id: number): Promise<Service | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                se.id,
                se.id_branch,
                br.name AS name_branch,
                se.id_area,
                ar.name AS name_area,
                se.name,
                se.description,
                se.duration_min,
                se.price,
                se.id_state,
                gs.name AS name_state
            FROM ${this.tableName} AS se
            JOIN branches br ON se.id_branch = br.id
            JOIN areas ar ON se.id_area = ar.id
            JOIN general_status gs ON se.id_state = gs.id
            WHERE se.id = ? AND se.deleted_at IS NULL
            `,
            [id]
        )
        return rows.length > 0 ? rows[0] : null;
    }

    async findServicesByArea(id_area: number): Promise<Service[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                se.id,
                se.id_branch,
                br.name AS name_branch,
                se.id_area,
                ar.name AS name_area,
                se.name,
                se.description,
                se.duration_min,
                se.price,
                se.id_state,
                gs.name AS name_state
            FROM ${this.tableName} AS se
            JOIN branches br ON se.id_branch = br.id
            JOIN areas ar ON se.id_area = ar.id
            JOIN general_status gs ON se.id_state = gs.id
            WHERE se.id_area = ? AND se.deleted_at IS NULL
            `,
            [id_area]
        )
        return rows;
    }

    async findServiceByName(id_branch: number, id_area: number, name: string): Promise<Service | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                se.id,
                se.id_branch,
                se.id_area,
                se.name
            FROM ${this.tableName} AS se
            WHERE se.id_branch = ?
              AND se.id_area = ?
              AND se.name = ?
              AND se.id_state = 1
              AND se.deleted_at IS NULL
            `,
            [id_branch, id_area, name]
        )
        return rows.length > 0 ? rows[0] : null;
    }

    async create(Service: ServiceCreate): Promise<Service> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
            (id_branch, id_area, name, description, duration_min, price, id_state, created_at)
            VALUES
            (?,?,?,?,?,?,?,NOW())
            `,
            [
                Service.id_branch,
                Service.id_area,
                Service.name,
                Service.description,
                Service.duration_min,
                Service.price,
                Service.id_state
            ]
        )

        const { insertId} = result;
        const newService = await this.findServiceById(insertId);

        if (!newService) {
            throw new Error('Error al crear el servicio');
        }

        return newService;
    }

    async update(id: number, Service: ServiceUpdate): Promise<Service | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (Service.id_branch !== undefined) {
            updates.push('id_branch = ?');
            values.push(Service.id_branch);
        }

        if (Service.id_area !== undefined) {
            updates.push('id_area = ?');
            values.push(Service.id_area);
        }

        if (Service.name !== undefined) {
            updates.push('name = ?');
            values.push(Service.name);
        }

        if (Service.description !== undefined) {
            updates.push('description = ?');
            values.push(Service.description);
        }

        if (Service.duration_min !== undefined) {
            updates.push('duration_min = ?');
            values.push(Service.duration_min);
        }

        if (Service.price !== undefined) {
            updates.push('price = ?');
            values.push(Service.price);
        }

        if (Service.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(Service.id_state);
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
        return this.findServiceById(id);
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