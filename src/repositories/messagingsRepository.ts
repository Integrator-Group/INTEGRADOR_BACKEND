import mysql2 from 'mysql2/promise'
import pool from '../config/database'
import { Messaging, MessagingCreate, MessagingUpdate } from '../models/Messagings'

export class MessagingsRepository {
    private readonly tableName = 'messaging';

    async findAllBySender(sender_id: number): Promise<Messaging[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ms.id,
                ms.sender_id,
                ms.receiver_id,
                ms.subject,
                ms.body,
                ms.attachment_path,
                ms.image_path,
                ms.sent_date
            FROM ${this.tableName} AS ms
            WHERE ms.sender_id = ? AND ms.deleted_by_sender = FALSE
            ORDER BY ms.sent_date DESC
            `,
            [sender_id]
        )

        return rows;
    }

    async findAllBySenderDeleted(sender_id: number): Promise<Messaging[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ms.id,
                ms.sender_id,
                ms.receiver_id,
                ms.subject,
                ms.body,
                ms.attachment_path,
                ms.image_path,
                ms.sent_date
            FROM ${this.tableName} AS ms
            WHERE ms.sender_id = ? AND ms.deleted_by_sender = TRUE
            ORDER BY ms.sent_date DESC
            `,
            [sender_id]
        )

        return rows;
    }

    async findAllByReceiver(receiver_id: number): Promise<Messaging[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ms.id,
                ms.sender_id,
                ms.receiver_id,
                ms.subject,
                ms.body,
                ms.attachment_path,
                ms.image_path,
                ms.sent_date
            FROM ${this.tableName} AS ms
            WHERE ms.receiver_id = ? AND ms.deleted_by_receiver = FALSE
            ORDER BY ms.sent_date DESC
            `,
            [receiver_id]
        )

        return rows;
    }

    async findAllByReceiverDeleted(receiver_id: number): Promise<Messaging[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ms.id,
                ms.sender_id,
                ms.receiver_id,
                ms.subject,
                ms.body,
                ms.attachment_path,
                ms.image_path,
                ms.sent_date
            FROM ${this.tableName} AS ms
            WHERE ms.receiver_id = ? AND ms.deleted_by_receiver = TRUE
            ORDER BY ms.sent_date DESC
            `,
            [receiver_id]
        )

        return rows;
    }

    async findById(id: number): Promise<Messaging | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ms.id,
                ms.sender_id,
                ms.receiver_id,
                ms.subject,
                ms.body,
                ms.attachment_path,
                ms.image_path,
                ms.sent_date
            FROM ${this.tableName} AS ms
            WHERE ms.id = ?
            `,
            [id]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async create(messaging: MessagingCreate): Promise<Messaging> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
                (sender_id, receiver_id, subject, body, attachment_path, image_path, sent_date, created_at, deleted_by_sender, deleted_by_receiver)
            VALUES
                (?, ?, ?, ?, ?, ?, NOW(), NOW(), FALSE, FALSE)
            `,
            [
                messaging.sender_id, messaging.receiver_id, messaging.subject, messaging.body, messaging.attachment_path ?? null,
                messaging.image_path ?? null
            ]
        )

        const { insertId } = result;
        const newMessaging = await this.findById(insertId);
        if(!newMessaging) {
            throw new Error('Error al enviar el mensaje')
        }

        return newMessaging;
    }

    async update(id: number, messaging: MessagingUpdate): Promise<Messaging | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if(messaging.deleted_by_sender !== undefined) {
            updates.push('deleted_by_sender = ?');
            values.push(messaging.deleted_by_sender)
        }

        if(messaging.deleted_by_receiver !== undefined) {
            updates.push('deleted_by_receiver = ?');
            values.push(messaging.deleted_by_receiver)
        }

        if(updates.length === 0) {
            return this.findById(id);
        }

        updates.push('updated_at =  NOW()');
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
}