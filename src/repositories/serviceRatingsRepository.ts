import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { ServiceRatings, ServiceRatingsCreate } from '../models/Service_Ratings';

export class ServiceRatingsRepository {
    private readonly tableName = 'service_ratings';

    async findById(id: number): Promise<ServiceRatings | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                sr.id,
                sr.id_appointment,
                sr.id_user,
                sr.rating,
                sr.comment
            FROM ${this.tableName} sr
            WHERE sr.id = ?
            `,
            [id]
        )

        return rows.length > 0 ? rows[0] : null;
    }

    async create(Ratings: ServiceRatingsCreate): Promise<ServiceRatings> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `
            INSERT INTO ${this.tableName}
                (id_appointment, id_user, rating, comment, created_at)
            VALUES
                (?,?,?,?,NOW())
            `,
            [
                Ratings.id_appointment, Ratings.id_user, Ratings.rating, Ratings.comment
            ]
        )

        const { insertId } = result;
        const newRating = await this.findById(insertId);
        if(!newRating) {
            throw new Error('Error al crear el feedback de la cita')
        }

        return newRating;
    }
}