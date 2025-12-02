import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { Credential, CredentialCreate, CredentialUpdate } from '../models/Credentials';
const bcrypt = require('bcrypt');

export class CredentialsRepository {
    private readonly tableName = 'credentials';

    private buildSelectQuery(): string {
        return `
            SELECT
                cr.id,
                cr.id_user,
                cr.username,
                cr.password,
                cr.id_state,
                gs.name AS name_state,
                cr.created_at,
                cr.updated_at,
                cr.deleted_at
            FROM ${this.tableName} AS cr
            JOIN general_status gs ON cr.id_state = gs.id
            WHERE cr.deleted_at IS NULL
        `;
    }

    async findByUsername(username: string): Promise<Credential | null> {
        const [rows] = await pool.execute<any[]>(
            `${this.buildSelectQuery()} AND cr.username = ?`,
            [username]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findByIdUser(id_user: number): Promise<Credential | null> {
        const [rows] = await pool.execute<any[]>(
            `${this.buildSelectQuery()} AND cr.id_user = ?`,
            [id_user]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findById(id: number): Promise<Credential | null> {
        const [rows] = await pool.execute<any[]>(
            `${this.buildSelectQuery()} AND cr.id = ?`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async login(username: string, password: string): Promise<Credential | null> {
        const credential = await this.findByUsername(username);
        
        if (!credential) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, credential.password);
        
        if (!isPasswordValid) {
            return null;
        }

        return credential;
    }

    async create(credential: CredentialCreate): Promise<Credential> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(credential.password, saltRounds);

        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `INSERT INTO ${this.tableName} (id_user, username, password, id_state, created_at) 
             VALUES (?, ?, ?, ?, NOW())`,
            [credential.id_user, credential.username, hashedPassword, credential.id_state]
        );

        const insertId = result.insertId;
        const newCredential = await this.findById(insertId);
        if (!newCredential) {
            throw new Error('Error al crear las credenciales');
        }
        return newCredential;
    }

    async update(id: number, credential: CredentialUpdate): Promise<Credential | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (credential.username !== undefined) {
            updates.push('username = ?');
            values.push(credential.username);
        }
        
        if (credential.password !== undefined) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(credential.password, saltRounds);
            updates.push('password = ?');
            values.push(hashedPassword);
        }
        
        if (credential.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(credential.id_state);
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        updates.push('updated_at = NOW()');
        values.push(id);

        await pool.execute(
            `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
            values
        );

        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`,
            [id]
        );
        return result.affectedRows > 0;
    }

    async deleteByIdUser(id_user: number): Promise<boolean> {
        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id_user = ? AND deleted_at IS NULL`,
            [id_user]
        );
        return result.affectedRows > 0;
    }
}

