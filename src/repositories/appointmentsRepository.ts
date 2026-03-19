import mysq12 from 'mysql2/promise';
import pool from '../config/database';
import { Appointment, AppointmentCreate, AppointmentUpdate, Product } from '../models/Appointments';

export type AppointmentOrderItem = {
    product_id: number;
    product_name: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
};

export type AppointmentWithOrderItems = {
    id: number;
    seq_val: string;
    id_user: number;
    user_names: string;
    user_last_names: string;
    id_professional: number | null;
    pro_names: string | null;
    pro_last_names: string | null;
    id_branch: number;
    branch_name: string;
    id_service: number | null;
    service_name: string | null;
    start_time: string;
    end_time: string;
    id_state_appointment: number;
    state_name: string;
    schedule_date: any;
    order_type: any;
    order_items: AppointmentOrderItem[];
};

export class AppointmentsRepository {
    private readonly tableName = 'appointments';
    private readonly canceledStateId = 3;
    private readonly reversedPaymentStatusId = 4;

    private isProductOrder(appointmentCreate: AppointmentCreate): boolean {
        const orderType = (appointmentCreate.order_type ?? 'service') as unknown;
        return String(orderType).toLowerCase() === 'product';
    }

    private isPointsPaidProductOrder(appointmentCreate: AppointmentCreate): boolean {
        const anyBody = appointmentCreate as any;

        // Bandera explícita (si el front la envía)
        if (anyBody.paid_with_points === true) return true;
        if (anyBody.payment_with_points === true) return true;
        if (anyBody.is_points_payment === true) return true;

        // Heurística: si todos los product_price son 0 o inválidos y existe product_points_price > 0,
        // asumimos que se está pagando con puntos.
        const products = appointmentCreate.products ?? [];
        if (!Array.isArray(products) || products.length === 0) return false;

        const moneyZeroAll = products.every(
            (p) => !Number.isFinite(Number((p as any).product_price)) || Number((p as any).product_price) <= 0
        );
        const pointsExistsAny = products.some(
            (p) => Number.isFinite(Number((p as any).product_points_price)) && Number((p as any).product_points_price) > 0
        );

        return moneyZeroAll && pointsExistsAny;
    }

    private async insertOrderItems(
        conn: mysq12.PoolConnection,
        orderId: number,
        appointmentCreate: AppointmentCreate
    ): Promise<void> {
        if (!this.isProductOrder(appointmentCreate)) return;

        const products = appointmentCreate.products ?? [];
        if (!Array.isArray(products) || products.length === 0) return;

        const isPointsOrder = this.isPointsPaidProductOrder(appointmentCreate);
        if (isPointsOrder) {
            // Regla de negocio: productos NO se pagan con puntos.
            throw new Error("No se permite pagar productos con puntos");
        }

        const id_branch = appointmentCreate.id_branch;
        type PendingItem = {
            productId: number;
            quantity: number;
            unitPriceRounded: number;
            subtotal: number;
            invId: number;
            currentQty: number;
            newQty: number;
        };

        // 1) Validar stock para TODOS los productos (sin actualizar inventario).
        const pending: PendingItem[] = [];
        for (const product of products as Product[]) {
            const productId = Number(product.product_item);
            const quantity = Math.floor(Number(product.quantity));
            const cashUnitPrice = Number(product.product_price);

            if (!Number.isFinite(productId) || productId <= 0) {
                throw new Error("product_item inválido en products");
            }
            if (!Number.isFinite(quantity) || quantity <= 0) {
                throw new Error("quantity inválida en products");
            }
            if (!Number.isFinite(cashUnitPrice)) {
                throw new Error("product_price inválido en products");
            }

            const unitPriceRounded = Number(cashUnitPrice.toFixed(2));
            const subtotal = Number((quantity * cashUnitPrice).toFixed(2));

            const [invRows] = await conn.execute<any[]>(
                `
                SELECT id, quantity
                FROM inventory
                WHERE id_item = ? AND id_branch = ?
                FOR UPDATE
                `,
                [productId, id_branch]
            );

            if (!invRows.length) {
                throw new Error(
                    `Inventario no encontrado para item ${productId} en sucursal ${id_branch}`
                );
            }

            const invId = Number(invRows[0].id);
            const currentQty = Number(invRows[0].quantity);
            const newQty = currentQty - quantity;

            if (!Number.isFinite(currentQty) || newQty < 0) {
                throw new Error(`Stock insuficiente para item ${productId} en sucursal ${id_branch}`);
            }

            pending.push({
                productId,
                quantity,
                unitPriceRounded,
                subtotal,
                invId,
                currentQty,
                newQty,
            });
        }

        // 2) Ya validado todo, insertamos order_items y descontamos inventario.
        for (const item of pending) {
            await conn.execute(
                `
                INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
                VALUES (?, ?, ?, ?, ?)
                `,
                [orderId, item.productId, item.quantity, item.unitPriceRounded, item.subtotal]
            );

            await conn.execute(
                `
                UPDATE inventory
                SET quantity = ?, updated_at = NOW()
                WHERE id = ?
                `,
                [item.newQty, item.invId]
            );

            await conn.execute(
                `
                INSERT INTO inventory_movements (id_inventory, id_user, movement_type, quantity, note)
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    item.invId,
                    appointmentCreate.id_user ?? null,
                    "SALE",
                    item.quantity,
                    `Venta de productos (order ${orderId})`,
                ]
            );
        }
    }

    async findAll(): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            `
        );

        return rows;
    }

    async findById(id: number): Promise<Appointment | null> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                us.email AS user_email,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name,
                ap.schedule_date,
                ap.order_type
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            LEFT JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            LEFT JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id = ?
            `,
            [id]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    async findAllByUser(id_user: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_user = ?
            `,
            [id_user]
        );

        return rows;
    }

    async findScheduledByUser(id_user: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_user = ? AND ap.id_state_appointment = 1
            `,
            [id_user]
        );

        return rows;
    }

    async findFilledByUser(id_user: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_user = ? AND ap.id_state_appointment = 2
            `,
            [id_user]
        );

        return rows;
    }

    async findCanceledByUser(id_user: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_user = ? AND ap.id_state_appointment = 3
            `,
            [id_user]
        );

        return rows;
    }

    async findAllByProfessionalDate(id_professional: number, startDate: string, endDate: string): Promise<Appointment[]> {
        const startDateFormatted = new Date(startDate).toISOString().split('T')[0];
        const endDateFormatted = new Date(endDate).toISOString().split('T')[0];
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name,
                ap.schedule_date,
                py.amount AS payment_amount
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            LEFT JOIN payments py ON py.id_appointment = ap.id
            WHERE ap.id_professional = ?
              AND ap.schedule_date >= ?
              AND ap.schedule_date <= ?
            ORDER BY ap.schedule_date ASC, ap.start_time ASC
            `,
            [id_professional, startDateFormatted, endDateFormatted]
        );

        return rows;
    }

    async findAllByProfessional(id_professional: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name,
                ap.schedule_date,
                py.amount AS payment_amount
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            LEFT JOIN payments py ON py.id_appointment = ap.id
            WHERE ap.id_professional = ?
            `,
            [id_professional]
        );
        return rows;
    }

    async findScheduledByProfessional(id_professional: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_professional = ? AND ap.id_state_appointment = 1
            `,
            [id_professional]
        );

        return rows;
    }

    async findFilledByProfessional(id_professional: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_professional = ? AND ap.id_state_appointment = 2
            `,
            [id_professional]
        );

        return rows;
    }

    async findCanceledByProfessional(id_professional: number): Promise<Appointment[]> {
        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_professional = ? AND ap.id_state_appointment = 3
            `,
            [id_professional]
        );

        return rows;
    }

    async findAllByBranch(id_branch: number, startDate: string, endDate: string): Promise<Appointment[]> {
        const startDateFormatted = new Date(startDate).toISOString().split('T')[0];
        const endDateFormatted = new Date(endDate).toISOString().split('T')[0];

        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id,
                ap.seq_val,
                ap.id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch,
                br.name AS branch_name,
                ap.id_service,
                se.name AS service_name,
                ap.start_time,
                ap.end_time,
                ap.id_state_appointment,
                aps.name AS state_name,
                ap.schedule_date
            FROM ${this.tableName} AS ap
            JOIN users us ON ap.id_user = us.id
            JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            WHERE ap.id_branch = ?
              AND ap.schedule_date >= ?
              AND ap.schedule_date <= ?
            ORDER BY ap.schedule_date ASC, ap.start_time ASC
            `,
            [id_branch, startDateFormatted, endDateFormatted]
        );

        return rows;
    }

    async findAllOrdersByBranchWithItems(
        id_branch: number,
        startDate: string,
        endDate: string
    ): Promise<AppointmentWithOrderItems[]> {
        const startDateFormatted = new Date(startDate).toISOString().split('T')[0];
        const endDateFormatted = new Date(endDate).toISOString().split('T')[0];

        const [rows] = await pool.execute<any[]>(
            `
            SELECT
                ap.id AS id,
                ap.seq_val AS seq_val,
                ap.id_user AS id_user,
                us.names AS user_names,
                us.last_names AS user_last_names,
                ap.id_professional AS id_professional,
                pr.names AS pro_names,
                pr.last_names AS pro_last_names,
                ap.id_branch AS id_branch,
                br.name AS branch_name,
                ap.id_service AS id_service,
                se.name AS service_name,
                ap.start_time AS start_time,
                ap.end_time AS end_time,
                ap.id_state_appointment AS id_state_appointment,
                aps.name AS state_name,
                ap.schedule_date AS schedule_date,
                ap.order_type AS order_type,

                oi.product_id AS product_id,
                it.name AS product_name,
                oi.quantity AS quantity,
                oi.unit_price AS unit_price,
                oi.subtotal AS subtotal
            FROM appointments ap
            JOIN users us ON ap.id_user = us.id
            LEFT JOIN users pr ON ap.id_professional = pr.id
            JOIN branches br ON ap.id_branch = br.id
            LEFT JOIN services se ON ap.id_service = se.id
            JOIN appointment_status aps ON ap.id_state_appointment = aps.id
            LEFT JOIN order_items oi ON oi.order_id = ap.id
            LEFT JOIN items it ON oi.product_id = it.id
            WHERE ap.id_branch = ?
              AND ap.schedule_date >= ?
              AND ap.schedule_date <= ?
            ORDER BY ap.schedule_date ASC, ap.start_time ASC
            `,
            [id_branch, startDateFormatted, endDateFormatted]
        );

        const map = new Map<number, AppointmentWithOrderItems>();

        for (const r of rows) {
            const appointmentId = Number(r.id);

            let ap = map.get(appointmentId);
            if (!ap) {
                ap = {
                    id: appointmentId,
                    seq_val: String(r.seq_val),
                    id_user: Number(r.id_user),
                    user_names: String(r.user_names ?? ''),
                    user_last_names: String(r.user_last_names ?? ''),
                    id_professional: r.id_professional === null ? null : Number(r.id_professional),
                    pro_names: r.pro_names === null ? null : String(r.pro_names),
                    pro_last_names: r.pro_last_names === null ? null : String(r.pro_last_names),
                    id_branch: Number(r.id_branch),
                    branch_name: String(r.branch_name),
                    id_service: r.id_service === null ? null : Number(r.id_service),
                    service_name: r.service_name === null ? null : String(r.service_name),
                    start_time: String(r.start_time),
                    end_time: String(r.end_time),
                    id_state_appointment: Number(r.id_state_appointment),
                    state_name: String(r.state_name),
                    schedule_date: r.schedule_date,
                    order_type: r.order_type,
                    order_items: [],
                };
                map.set(appointmentId, ap);
            }

            // Si es un order_type de PRODUCT, existirán order_items; si es SERVICE, normalmente vendrá null.
            if (r.product_id !== null && r.product_id !== undefined) {
                ap!.order_items.push({
                    product_id: Number(r.product_id),
                    product_name: r.product_name === null ? null : String(r.product_name),
                    quantity: Number(r.quantity),
                    unit_price: Number(r.unit_price),
                    subtotal: Number(r.subtotal),
                });
            }
        }

        return Array.from(map.values());
    }

    async create(appointmentCreate: AppointmentCreate): Promise<Appointment> {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.execute<mysq12.ResultSetHeader>(
                `
                INSERT INTO ${this.tableName}
                    (seq_val, id_user, id_professional, id_branch, id_service, id_schedule, 
                    start_time, end_time, id_state_appointment, schedule_date, order_type, created_at)
                VALUES
                    (?,?,?,?,?,?,?,?,?,?,?,NOW())
                `,
                [
                    appointmentCreate.seq_val,
                    appointmentCreate.id_user,
                    appointmentCreate.id_professional ?? null,
                    appointmentCreate.id_branch,
                    appointmentCreate.id_service ?? null,
                    appointmentCreate.id_schedule ?? null,
                    appointmentCreate.start_time,
                    appointmentCreate.end_time,
                    appointmentCreate.id_state_appointment ?? 1,
                    appointmentCreate.schedule_date,
                    appointmentCreate.order_type ?? 'service',
                ]
            );

            const insertId = result.insertId;

            await this.insertOrderItems(conn, insertId, appointmentCreate);

            await conn.commit();

            const newAppointment = await this.findById(insertId);
            if (!newAppointment) {
                throw new Error('Error al registrar la cita');
            }

            return newAppointment;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    async createWithLoyalty(
        appointmentCreate: AppointmentCreate,
        pointsDelta: number,
        reason: string | null
    ): Promise<Appointment> {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.execute<mysq12.ResultSetHeader>(
                `
                INSERT INTO ${this.tableName}
                    (seq_val, id_user, id_professional, id_branch, id_service, id_schedule, 
                    start_time, end_time, id_state_appointment, schedule_date, order_type, created_at)
                VALUES
                    (?,?,?,?,?,?,?,?,?,?,?,NOW())
                `,
                [
                    appointmentCreate.seq_val,
                    appointmentCreate.id_user,
                    appointmentCreate.id_professional ?? null,
                    appointmentCreate.id_branch,
                    appointmentCreate.id_service ?? null,
                    appointmentCreate.id_schedule ?? null,
                    appointmentCreate.start_time,
                    appointmentCreate.end_time,
                    appointmentCreate.id_state_appointment ?? 1,
                    appointmentCreate.schedule_date,
                    appointmentCreate.order_type ?? 'service'
                ]
            );

            const insertId = result.insertId;

            if (Number.isFinite(pointsDelta) && pointsDelta !== 0) {
                await conn.execute(
                    `
                    INSERT INTO customer_loyalty (id_user, points)
                    VALUES (?, 0)
                    ON DUPLICATE KEY UPDATE id_user = VALUES(id_user)
                    `,
                    [appointmentCreate.id_user]
                );

                await conn.execute(
                    `
                    UPDATE customer_loyalty
                    SET points = points + ?
                    WHERE id_user = ?
                    `,
                    [pointsDelta, appointmentCreate.id_user]
                );

                await conn.execute(
                    `
                    INSERT INTO loyalty_transactions (id_user, points_delta, reason, created_at)
                    VALUES (?, ?, ?, NOW())
                    `,
                    [appointmentCreate.id_user, pointsDelta, reason]
                );
            }

            await this.insertOrderItems(conn, insertId, appointmentCreate);

            await conn.commit();
            const created = await this.findById(insertId);
            if (!created) throw new Error('Error al registrar la cita');
            return created;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    async update(id: number, appointment: AppointmentUpdate): Promise<Appointment | null> {
        const updates: string[] = [];
        const values: any[] = [];

        if (appointment.id_branch !== undefined) {
            updates.push('id_branch = ?');
            values.push(appointment.id_branch)
        }

        if (appointment.id_schedule !== undefined) {
            updates.push('id_schedule = ?');
            values.push(appointment.id_schedule)
        }

        if (appointment.start_time !== undefined) {
            updates.push('start_time = ?');
            values.push(appointment.start_time)
        }

        if (appointment.end_time !== undefined) {
            updates.push('end_time = ?');
            values.push(appointment.end_time)
        }

        if (appointment.id_state_appointment !== undefined) {
            updates.push('id_state_appointment = ?');
            values.push(appointment.id_state_appointment)
        }

        if (appointment.schedule_date !== undefined) {
            updates.push('schedule_date = ?');
            values.push(appointment.schedule_date)
        }

        if (updates.length === 0) {
            return this.findById(id);
        }

        updates.push('updated_at = NOW()')
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

    async cancelAndReversePayment(id_appointment: number): Promise<Appointment> {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [apptResult] = await conn.execute<mysq12.ResultSetHeader>(
                `
                UPDATE ${this.tableName}
                SET id_state_appointment = ?, updated_at = NOW()
                WHERE id = ?
                `,
                [this.canceledStateId, id_appointment]
            );

            if (apptResult.affectedRows === 0) {
                throw new Error('Cita no encontrada');
            }

            await conn.execute(
                `
                UPDATE payments
                SET id_status_payment = ?, updated_at = NOW()
                WHERE id_appointment = ?
                `,
                [this.reversedPaymentStatusId, id_appointment]
            );

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }

        const updated = await this.findById(id_appointment);
        if (!updated) throw new Error('Cita no encontrada');
        return updated;
    }
}