import mysql2 from "mysql2/promise";
import pool from "../config/database";
import { CustomerLoyalty } from "../models/CustomerLoyalty";

export class CustomerLoyaltyRepository {
  private readonly tableName = "customer_loyalty";

  async findByUserId(id_user: number): Promise<CustomerLoyalty | null> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT id, id_user, points, updated_at
      FROM ${this.tableName}
      WHERE id_user = ?
      `,
      [id_user]
    );
    return rows.length ? rows[0] : null;
  }

  async ensureRow(id_user: number): Promise<void> {
    await pool.execute(
      `
      INSERT INTO ${this.tableName} (id_user, points)
      VALUES (?, 0)
      ON DUPLICATE KEY UPDATE id_user = VALUES(id_user)
      `,
      [id_user]
    );
  }

  async addPoints(
    id_user: number,
    pointsDelta: number
  ): Promise<CustomerLoyalty> {
    await this.ensureRow(id_user);

    await pool.execute(
      `
      UPDATE ${this.tableName}
      SET points = points + ?
      WHERE id_user = ?
      `,
      [pointsDelta, id_user]
    );

    const updated = await this.findByUserId(id_user);
    if (!updated) throw new Error("No se pudo obtener la lealtad del usuario");
    return updated;
  }

  async setPoints(id_user: number, points: number): Promise<CustomerLoyalty> {
    await this.ensureRow(id_user);

    await pool.execute(
      `
      UPDATE ${this.tableName}
      SET points = ?
      WHERE id_user = ?
      `,
      [points, id_user]
    );

    const updated = await this.findByUserId(id_user);
    if (!updated) throw new Error("No se pudo obtener la lealtad del usuario");
    return updated;
  }

  async addTransaction(
    id_user: number,
    pointsDelta: number,
    reason: string | null
  ): Promise<void> {
    await pool.execute<mysql2.ResultSetHeader>(
      `
      INSERT INTO loyalty_transactions (id_user, points_delta, reason, created_at)
      VALUES (?, ?, ?, NOW())
      `,
      [id_user, pointsDelta, reason]
    );
  }
}

