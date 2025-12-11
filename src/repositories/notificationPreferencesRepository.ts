import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { NotificationPreference, NotificationPreferenceCreate, NotificationPreferenceUpdate } from '../models/Notification_Preferences';

export class NotificationPreferenceRepository {
    private readonly tableName = 'notification_preferences';

    async findPreferenceByUser(id_user: number): Promise<NotificationPreference | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                np.id,
                np.id_user,
                np.email_enable,
                np.whatsapp_enable
            FROM ${this.tableName} AS np
            WHERE np.id_user = ? AND np.id_state = 1
            `,
            [id_user]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async findPreferenceById(id: number): Promise<NotificationPreference | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                np.id,
                np.id_user,
                np.email_enable,
                np.whatsapp_enable
            FROM ${this.tableName} AS np
            WHERE np.id = ? AND np.id_state = 1
            `,
            [id]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async savePreferences(id_user: number, create: NotificationPreferenceCreate, update: NotificationPreferenceUpdate): Promise<NotificationPreference> {
        const existingPreference = await this.findPreferenceByUser(id_user);

        if (!existingPreference) {
            const [result] = await pool.execute<mysql2.ResultSetHeader>(
                `
                INSERT INTO ${this.tableName}
                (id_user, email_enable, whatsapp_enable, id_state, created_at)
                VALUES
                (?,?,?,?,NOW())
                `,
                [id_user, create.email_enable, create.whatsapp_enable, create.id_state]
            );

            const { insertId } = result;
            const newPreference = await this.findPreferenceById(insertId);
            if(!newPreference) {
                throw new Error('Error al crear las preferencias');
            }

            return newPreference;

        } else {
            const updates: string[] = [];
            const values: any[] = [];

            if (update.email_enable !== undefined) {
                updates.push('email_enable = ?');
                values.push(update.email_enable);
            }

            if (update.whatsapp_enable !== undefined) {
                updates.push('whatsapp_enable = ?');
                values.push(update.whatsapp_enable);
            }

            if (updates.length === 0) {
                return existingPreference;
            }
            updates.push('updated_at = NOW()');
            values.push(id_user);
            await pool.execute(
                `
                UPDATE ${this.tableName}
                SET ${updates.join(', ')}
                WHERE id_user = ?
                `,
                values
            )

            const updatedPreference = await this.findPreferenceByUser(id_user);

            if (!updatedPreference) {
                throw new Error('Error al obtener las preferencias actualizadas')
            }

            return updatedPreference;
        }
    }
}