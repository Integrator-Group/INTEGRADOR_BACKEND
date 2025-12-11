import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Branch, BranchCreate, BranchUpdate } from '../models/Branches';

export class BranchesRepository {
    private readonly tableName = 'branches'

    async findAll(): Promise<Branch[]> {
        const [rows] = await pool.execute<any[]>(
            `SELECT 
              br.id,
              br.id_company,
              cm.name       AS company_name,
              br.name,
              br.phone,
              br.address,
              br.email,
              br.id_manager,
              us.names      AS manager_names,
              us.last_names AS manager_last_names,
              br.id_province,
              pr.name       AS province_name,
              br.id_canton,
              cn.name       AS canton_name,
              br.id_state,
              gs.name       AS state_name,
              br.created_at,
              br.updated_at,
              br.deleted_at
            FROM ${this.tableName} br
            JOIN companies cm   ON br.id_company  = cm.id
            LEFT JOIN users us  ON br.id_manager  = us.id
            LEFT JOIN provinces pr ON br.id_province = pr.id
            LEFT JOIN cantons cn   ON br.id_canton   = cn.id
            JOIN general_status gs ON br.id_state   = gs.id
            WHERE br.deleted_at IS NULL`
        );

        return rows;
    }

    async findById(id: number): Promise<Branch | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT 
                br.id,
                br.id_company,
                cm.name AS company_name,
                br.name,
                br.phone,
                br.address,
                br.email,
                br.id_manager,
                us.names AS manager_names,
                us.last_names AS manager_last_names,
                br.id_province,
                pr.name AS province_name,
                br.id_canton,
                cn.name AS canton_name,
                br.id_state,
                gs.name AS state_name
             FROM ${this.tableName} br
             JOIN companies cm   ON br.id_company = cm.id
             LEFT JOIN users us  ON br.id_manager = us.id
             LEFT JOIN provinces pr ON br.id_province = pr.id
             LEFT JOIN cantons cn ON br.id_canton = cn.id
             JOIN general_status gs ON br.id_state = gs.id
             WHERE br.id = ? AND br.deleted_at IS NULL`,
             [id]
        );
    
        return rows.length > 0 ? rows[0] : null;
    }

    async findByName(name: string): Promise<Branch | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT name 
             FROM ${this.tableName}
             WHERE name = ? AND deleted_at IS NULL`,
            [name]
        )
        return rows.length > 0 ? rows[0] : null;
    }

    async findByPhone(phone: string): Promise<Branch | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT phone 
             FROM ${this.tableName}
             WHERE phone = ? AND deleted_at IS NULL`,
            [phone]
        )
        return rows.length > 0 ? rows[0] : null;
    }
    
    async findByEmail(email: string): Promise<Branch | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT email 
             FROM ${this.tableName}
             WHERE email = ? AND deleted_at IS NULL`,
            [email]
        )
        return rows.length > 0 ? rows[0] : null;
    }

    async findByManager(id_manager: number): Promise<Branch | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT id_manager 
             FROM ${this.tableName}
             WHERE id_manager = ? AND deleted_at IS NULL`,
            [id_manager]
        )
        return rows.length > 0 ? rows[0] : null;
    }

    async findByProvinceCanton(id_province: number, id_canton?: number): Promise<Branch[]> {
        const [rows] = await pool.execute<any[]>(
            `SELECT 
                br.id,
                br.id_company,
                cm.name AS company_name,
                br.name,
                br.phone,
                br.address,
                br.email,
                br.id_manager,
                us.names AS manager_names,
                us.last_names AS manager_last_names,
                br.id_province,
                pr.name AS province_name,
                br.id_canton,
                cn.name AS canton_name,
                br.id_state,
                gs.name AS state_name,
                br.created_at,
                br.updated_at,
                br.deleted_at
             FROM ${this.tableName} br
             JOIN companies cm   ON br.id_company = cm.id
             LEFT JOIN users us  ON br.id_manager = us.id
             LEFT JOIN provinces pr ON br.id_province = pr.id
             LEFT JOIN cantons cn   ON br.id_canton = cn.id
             JOIN general_status gs ON br.id_state = gs.id
             WHERE br.deleted_at IS NULL
               AND (
                    br.id_province = ?
                    OR (br.id_province = ? AND br.id_canton = ?)
               )`,
            [id_province, id_province, id_canton]
        );
    
        return rows;
    }
    
    async create(Branch: BranchCreate): Promise<Branch> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
            (id_company, name, phone, address, email, id_province, id_canton, id_state, created_at)
            VALUES
            (?,?,?,?,?,?,?,?,NOW())
            `,
            [
                Branch.id_company, Branch.name, Branch.phone, Branch.address, Branch.email,
                Branch.id_province, Branch.id_canton, Branch.id_state
            ]
        );

        const { insertId } = result;
        const newBranch = await this.findById(insertId);
        if (!newBranch) {
            throw new Error('Error al crear la sucursal');
        }
        return newBranch;
    }

    async update(id: number, Branch: BranchUpdate): Promise<Branch | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (Branch.id_manager !== undefined) {
            updates.push('id_manager = ?');
            values.push(Branch.id_manager);
        }
        if (Branch.name !== undefined) {
            updates.push('name = ?');
            values.push(Branch.name);
        }
        if (Branch.phone !== undefined) {
            updates.push('phone = ?');
            values.push(Branch.phone);
        }
        if (Branch.address !== undefined) {
            updates.push('address = ?');
            values.push(Branch.address);
        }
        if (Branch.email !== undefined) {
            updates.push('email = ?');
            values.push(Branch.email);
        }
        if (Branch.id_province !== undefined) {
            updates.push('id_province = ?');
            values.push(Branch.id_province);
        }
        if (Branch.id_canton !== undefined) {
            updates.push('id_canton = ?');
            values.push(Branch.id_canton);
        }
        if (Branch.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(Branch.id_state);
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