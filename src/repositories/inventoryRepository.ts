import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Inventory, InventoryCreate, InventoryUpdate } from '../models/Inventory';

export class InventoryRepository {
    private readonly tableName = 'inventory';

    async findAll(): Promise<Inventory[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                inv.id,
                inv.id_item,
                it.name AS item_name,
                inv.id_branch,
                br.name AS branch_name,
                inv.quantity,
                inv.min_stock,
                it.description AS item_description,
                inv.created_at,
                inv.updated_at
            FROM ${this.tableName} AS inv
            JOIN items it ON inv.id_item = it.id
            JOIN branches br ON inv.id_branch = br.id
            `
        );
        return rows;
    }

    async findById(id: number): Promise<Inventory | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                inv.id,
                inv.id_item,
                it.name AS item_name,
                inv.id_branch,
                br.name AS branch_name,
                inv.quantity,
                inv.min_stock,
                inv.created_at,
                inv.updated_at
            FROM ${this.tableName} AS inv
            JOIN items it ON inv.id_item = it.id
            JOIN branches br ON inv.id_branch = br.id
            WHERE inv.id = ?
            `,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findByBranch(id_branch: number): Promise<Inventory[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                inv.id,
                inv.id_item,
                it.name AS item_name,
                inv.id_branch,
                br.name AS branch_name,
                inv.quantity,
                inv.min_stock,
                it.description AS item_description,
                inv.created_at,
                inv.updated_at
            FROM ${this.tableName} AS inv
            JOIN items it ON inv.id_item = it.id
            JOIN branches br ON inv.id_branch = br.id
            WHERE inv.id_branch = ?
            `,
            [id_branch]
        );
        return rows;
    }

    async findByBranchAndName(id_branch: number, name: string): Promise<Inventory[]> {
        const likePattern = `%${name}%`;
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                inv.id,
                inv.id_item,
                it.name AS item_name,
                inv.id_branch,
                br.name AS branch_name,
                inv.quantity,
                inv.min_stock,
                it.description AS item_description,
                inv.created_at,
                inv.updated_at
            FROM ${this.tableName} AS inv
            JOIN items it ON inv.id_item = it.id
            JOIN branches br ON inv.id_branch = br.id
            WHERE inv.id_branch = ? AND it.name LIKE ?
            ORDER BY it.name ASC
            `,
            [id_branch, likePattern]
        );
        return rows;
    }

    async findByItemAndBranch(id_item: number, id_branch: number): Promise<Inventory | null> {
        const [rows] = await pool.execute<any[]>(
            `SELECT id FROM ${this.tableName} WHERE id_item = ? AND id_branch = ?`,
            [id_item, id_branch]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async create(inventory: InventoryCreate): Promise<Inventory> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
            (id_item, id_branch, quantity, min_stock, created_at)
            VALUES (?, ?, ?, ?, NOW())
            `,
            [inventory.id_item, inventory.id_branch, inventory.quantity, inventory.min_stock]
        );

        const { insertId } = result;
        const newInventory = await this.findById(insertId);
        if (!newInventory) {
            throw new Error('Error al crear el registro de inventario');
        }
        return newInventory;
    }

    async update(id: number, inventory: InventoryUpdate): Promise<Inventory | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (inventory.quantity !== undefined) {
            updates.push('quantity = ?');
            values.push(inventory.quantity);
        }

        if (inventory.min_stock !== undefined) {
            updates.push('min_stock = ?');
            values.push(inventory.min_stock);
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
            `DELETE FROM ${this.tableName} WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}
