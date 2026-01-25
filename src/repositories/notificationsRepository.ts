import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Notification, NotificationCreate } from '../models/Notifications';

export class NotificationsRepository {
    private readonly tableName = 'notifications';

    async findAllByUser(id_user: number): Promise<Notification[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                nt.id,
                nt.id_user,
                nt.title,
                nt.message,
                nt.is_read
            FROM ${this.tableName} AS nt
            WHERE nt.id_user = ?
            ORDER BY nt.created_at DESC
            `,
            [id_user]
        )

        return rows;
    }

    async findById(id: number): Promise<Notification | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                nt.id,
                nt.id_user,
                nt.title,
                nt.message,
                nt.is_read
            FROM ${this.tableName} AS nt
            WHERE nt.id = ?
            `,
            [id]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async create(notification: NotificationCreate): Promise<Notification> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
                (id_user, title, message, is_read, created_at)
            VALUES
                (?,?,?,false,NOW())
            `,
            [
                notification.id_user, notification.title, notification.message
            ]
        )

        const { insertId } = result;
        const newNotification = await this.findById(insertId);
        if(!newNotification) {
            throw new Error('Error al guardar la notificación')
        }

        return newNotification;
    }

    async update(id: number): Promise<Notification> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            UPDATE ${this.tableName}
            SET
                is_read = true,
                updated_at = NOW()
            WHERE id = ?
            `,
            [id]
        );
    
        if (result.affectedRows === 0) {
            throw new Error('Notificación no encontrada');
        }
    
        const notificationUpdated = await this.findById(id);
        if (!notificationUpdated) {
            throw new Error('Error al obtener la notificación actualizada');
        }
    
        return notificationUpdated;
    }    
}