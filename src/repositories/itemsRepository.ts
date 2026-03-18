import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Item, ItemCreate, ItemUpdate } from '../models/Items';

export class ItemsRepository {
    private readonly tableName = 'items';

    async findAll(): Promise<Item[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                it.id,
                it.name,
                it.description,
                it.price,
                it.points_price,
                it.id_state,
                gs.name AS state_name
            FROM ${this.tableName} AS it
            JOIN general_status gs ON it.id_state = gs.id
            WHERE it.deleted_at IS NULL
            `
        )

        return rows;
    }

    async findItemById(id: number): Promise<Item | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                it.id,
                it.name,
                it.description,
                it.price,
                it.points_price,
                it.id_state,
                gs.name AS state_name
            FROM ${this.tableName} AS it
            JOIN general_status gs ON it.id_state = gs.id
            WHERE it.id = ? AND it.deleted_at IS NULL
            `,
            [id]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async findByName(name: string): Promise<Item | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT 
                name 
            FROM ${this.tableName}
            WHERE name = ? AND deleted_at IS NULL`,
            [name]
        )
        return rows.length > 0 ? rows[0] : null;
    }

    async create(Item: ItemCreate): Promise<Item> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
            (name, description, id_state, price, points_price, created_at)
            VALUES
            (?,?,?,?,?,NOW())
            `,
            [ Item.name, Item.description, Item.id_state, Item.price, Item.points_price ]
        )

        const { insertId } = result;
        const newItem = await this.findItemById(insertId);
        if(!newItem) {
            throw new Error('Error al crear el item');
        }

        return newItem;
    }

    async update(id: number, Item: ItemUpdate): Promise<Item | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (Item.name !== undefined) {
            updates.push('name = ?');
            values.push(Item.name);
        }

        if (Item.description !== undefined) {
            updates.push('description = ?');
            values.push(Item.description);
        }

        if (Item.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(Item.id_state);
        }

        if (Item.price !== undefined) {
            updates.push('price = ?');
            values.push(Item.price);
        }

        if (Item.points_price !== undefined) {
            updates.push('points_price = ?');
            values.push(Item.points_price);
        }

        if (updates.length === 0) {
            return this.findItemById(id);
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

        return this.findItemById(id);
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            UPDATE ${this.tableName} 
            SET deleted_at = NOW() 
            WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}