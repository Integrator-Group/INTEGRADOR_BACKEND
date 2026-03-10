import mysql2 from 'mysql2/promise';
import pool from '../config/database';
import { User, UserCreate, UserUpdate } from '../models/Users';

export class UsersRepository {
    private readonly tableName = 'users';

    private buildSelectQuery(): string {
        return `
            SELECT
                us.id,
                us.names,
                us.last_names,
                us.identification,
                us.email,
                us.phone,
                us.profile_photo,
                us.id_branch,
                br.name AS name_branch,
                us.id_role,
                rl.name AS name_role,
                us.id_province,
                pr.name AS name_province,
                us.id_canton,
                cn.name AS name_canton,
                us.id_area,
                ar.name AS name_area,
                us.id_specialty,
                sp.name AS name_speciality,
                us.id_state,
                gs.name AS name_state,
                us.created_at,
                us.updated_at,
                us.deleted_at
            FROM ${this.tableName} AS us
            LEFT JOIN branches br ON us.id_branch = br.id
            JOIN roles rl ON us.id_role = rl.id
            LEFT JOIN provinces pr ON us.id_province = pr.id
            LEFT JOIN cantons cn ON us.id_canton = cn.id
            LEFT JOIN areas ar ON us.id_area = ar.id
            LEFT JOIN specialties sp ON us.id_specialty = sp.id
            JOIN general_status gs ON us.id_state = gs.id
            WHERE us.deleted_at IS NULL
        `;
    }

    async findById(id: number): Promise<User | null> {
        const [rows] = await pool.execute<any[]>(
            `${this.buildSelectQuery()} AND us.id = ?`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findByIdentification(identification: string, excludeId?: number): Promise<User | null> {
        const baseQuery = this.buildSelectQuery();
        let query = `${baseQuery} AND us.identification = ?`;
        const params: any[] = [identification];
        
        if (excludeId !== undefined) {
            query += ' AND us.id != ?';
            params.push(excludeId);
        }
        
        const [rows] = await pool.execute<any[]>(query, params);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByEmail(email: string, excludeId?: number): Promise<User | null> {
        const baseQuery = this.buildSelectQuery();
        let query = `${baseQuery} AND us.email = ?`;
        const params: any[] = [email];
        
        if (excludeId !== undefined) {
            query += ' AND us.id != ?';
            params.push(excludeId);
        }
        
        const [rows] = await pool.execute<any[]>(query, params);
        return rows.length > 0 ? rows[0] : null;
    }

    async findByPhone(phone: string, excludeId?: number): Promise<User | null> {
        const baseQuery = this.buildSelectQuery();
        let query = `${baseQuery} AND us.phone = ?`;
        const params: any[] = [phone];
        
        if (excludeId !== undefined) {
            query += ' AND us.id != ?';
            params.push(excludeId);
        }
        
        const [rows] = await pool.execute<any[]>(query, params);
        return rows.length > 0 ? rows[0] : null;
    }

    async findUserByRol(id_role: number): Promise<User[]> {
        const [rows] = await pool.execute<any[]>(
            `${this.buildSelectQuery()} AND us.id_role = ?`,
            [id_role]
        );
        return rows;
    }

    async findUsersByArea(id_area: number): Promise<User[]> {
        const [rows] = await pool.execute<any[]>(
            `${this.buildSelectQuery()} AND us.id_area = ?`,
            [id_area]
        );
        return rows;
    }

    private hasValue(value: any): boolean {
        return value !== undefined && value !== null && value !== '';
    }

    async create(user: UserCreate): Promise<User> {
        const fields: string[] = [];
        const values: any[] = [];

        fields.push('names');
        values.push(user.names);
        
        if (this.hasValue(user.last_names)) {
            fields.push('last_names');
            values.push(user.last_names);
        }
        if (this.hasValue(user.identification)) {
            fields.push('identification');
            values.push(user.identification);
        }
        if (this.hasValue(user.email)) {
            fields.push('email');
            values.push(user.email);
        }
        if (this.hasValue(user.phone)) {
            fields.push('phone');
            values.push(user.phone);
        }
        if (this.hasValue(user.profile_photo)) {
            fields.push('profile_photo');
            values.push(user.profile_photo);
        }
        if (this.hasValue(user.id_branch)) {
            fields.push('id_branch');
            values.push(user.id_branch);
        }
        
        fields.push('id_role');
        values.push(user.id_role);
        
        if (this.hasValue(user.id_province)) {
            fields.push('id_province');
            values.push(user.id_province);
        }
        
        if (this.hasValue(user.id_canton)) {
            fields.push('id_canton');
            values.push(user.id_canton);
        }
        
        if (this.hasValue(user.id_area)) {
            fields.push('id_area');
            values.push(user.id_area);
        }
        if (this.hasValue(user.id_speciality)) {
            fields.push('id_specialty');
            values.push(user.id_speciality);
        }
        
        fields.push('id_state');
        values.push(user.id_state);

        const placeholders = fields.map(() => '?');

        const [result] = await pool.execute<mysql2.ResultSetHeader>(
            `INSERT INTO ${this.tableName} (${fields.join(', ')}, created_at) VALUES (${placeholders.join(', ')}, NOW())`,
            values
        );

        const insertId = result.insertId;
        const newUser = await this.findById(insertId);
        if (!newUser) {
            throw new Error('Error al crear el usuario');
        }
        return newUser;
    }

    async update(id: number, user: UserUpdate): Promise<User | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (user.names !== undefined) {
            updates.push('names = ?');
            values.push(user.names);
        }
        if (user.last_names !== undefined) {
            updates.push('last_names = ?');
            values.push(user.last_names);
        }
        if (user.identification !== undefined) {
            updates.push('identification = ?');
            values.push(user.identification);
        }
        if (user.email !== undefined) {
            updates.push('email = ?');
            values.push(user.email);
        }
        if (user.phone !== undefined) {
            updates.push('phone = ?');
            values.push(user.phone);
        }
        if (user.profile_photo !== undefined) {
            updates.push('profile_photo = ?');
            values.push(user.profile_photo);
        }
        if (user.id_branch !== undefined) {
            updates.push('id_branch = ?');
            values.push(user.id_branch);
        }
        if (user.id_role !== undefined) {
            updates.push('id_role = ?');
            values.push(user.id_role);
        }
        if (user.id_province !== undefined) {
            updates.push('id_province = ?');
            values.push(user.id_province);
        }
        if (user.id_canton !== undefined) {
            updates.push('id_canton = ?');
            values.push(user.id_canton);
        }
        if (user.id_area !== undefined) {
            updates.push('id_area = ?');
            values.push(user.id_area);
        }
        if (user.id_speciality !== undefined) {
            updates.push('id_specialty = ?');
            values.push(user.id_speciality);
        }
        if (user.id_state !== undefined) {
            updates.push('id_state = ?');
            values.push(user.id_state);
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
}