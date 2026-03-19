import pool from "../config/database";
import {
  UserOrderPaymentView,
  UserOrderProductInfo,
  UserOrderRatingInfo,
} from "../models/UserOrders";

type UserOrderPaymentRow = {
  appointment_id: number;
  order_type: string;
  order_number: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  status: string;
  service_name: string | null;
  service_description: string | null;
  service_duration_min: number | null;
  service_price: number | null;
  branch_name: string;
  professional_id: number | null;
  professional_names: string | null;
  professional_last_names: string | null;
  professional_profile_photo: string | null;
  payment_amount: number | null;
  payment_method: string | null;
  payment_status: string | null;
  paid_at: string | null;
  rating_value: number | null;
  rating_comment: string | null;
  rating_created_at: string | null;
};

export class UserOrdersRepository {
  async findOrdersAndPaymentsByUser(
    id_user: number,
    limit: number,
    offset: number
  ): Promise<UserOrderPaymentView[]> {
    const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 200);
    const safeOffset = Math.max(Math.floor(offset), 0);

    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        ap.id AS appointment_id,
        ap.order_type AS order_type,
        ap.seq_val AS order_number,
        DATE_FORMAT(ap.schedule_date, '%Y-%m-%d') AS schedule_date,
        ap.start_time AS start_time,
        ap.end_time AS end_time,
        aps.name AS status,
        se.name AS service_name,
        se.description AS service_description,
        se.duration_min AS service_duration_min,
        se.price AS service_price,
        br.name AS branch_name,
        pr.id AS professional_id,
        pr.names AS professional_names,
        pr.last_names AS professional_last_names,
        pr.profile_photo AS professional_profile_photo,
        py.amount AS payment_amount,
        pm.name AS payment_method,
        ps.name AS payment_status,
        py.paid_at AS paid_at,
        sr.rating AS rating_value,
        sr.comment AS rating_comment,
        sr.created_at AS rating_created_at
      FROM appointments ap
      JOIN appointment_status aps ON ap.id_state_appointment = aps.id
      LEFT JOIN services se ON ap.id_service = se.id
      JOIN branches br ON ap.id_branch = br.id
      LEFT JOIN users pr ON ap.id_professional = pr.id
      LEFT JOIN (
        SELECT p.*
        FROM payments p
        JOIN (
          SELECT id_appointment, MAX(created_at) AS max_created_at
          FROM payments
          GROUP BY id_appointment
        ) pmx
          ON p.id_appointment = pmx.id_appointment
         AND p.created_at = pmx.max_created_at
      ) py ON py.id_appointment = ap.id
      LEFT JOIN payment_methods pm ON py.id_method = pm.id
      LEFT JOIN payment_status ps ON py.id_status_payment = ps.id
      LEFT JOIN service_ratings sr ON sr.id_appointment = ap.id AND sr.id_user = ?
      WHERE ap.id_user = ?
      ORDER BY ap.schedule_date DESC, ap.created_at DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}
      `,
      [id_user, id_user]
    );

    const base = (rows as UserOrderPaymentRow[]).map((r) => {
      const rating: UserOrderRatingInfo | null =
        r.rating_value != null
          ? {
              rating: Number(r.rating_value),
              comment: r.rating_comment ?? "",
              created_at: r.rating_created_at ?? null,
            }
          : null;

      const service =
        r.order_type === "service" && r.service_name
          ? {
              name: String(r.service_name),
              description: String(r.service_description ?? ""),
              duration_min: Number(r.service_duration_min ?? 0),
              price: Number(r.service_price ?? 0),
            }
          : null;

      const professional =
        r.professional_id != null && r.professional_names
          ? {
              id: Number(r.professional_id),
              names: String(r.professional_names),
              last_names: String(r.professional_last_names ?? ""),
              profile_photo: r.professional_profile_photo,
            }
          : null;

      return {
        appointment_id: r.appointment_id,
        order_type: r.order_type,
        order_number: r.order_number,
        schedule_date: r.schedule_date,
        start_time: r.start_time,
        end_time: r.end_time,
        status: r.status,
        service,
        professional,
        branch: { name: r.branch_name },
        products: null as UserOrderProductInfo[] | null,
        payment:
          r.payment_amount === null || !r.payment_method || !r.payment_status
            ? null
            : {
                amount: r.payment_amount,
                method: r.payment_method,
                status: r.payment_status,
                paid_at: r.paid_at,
              },
        rating,
      } satisfies UserOrderPaymentView;
    });

    const productAppointmentIds = base
      .filter((o) => o.order_type === "product")
      .map((o) => o.appointment_id);

    if (productAppointmentIds.length === 0) return base;

    const placeholders = productAppointmentIds.map(() => "?").join(",");
    const [productRows] = await pool.execute<any[]>(
      `
      SELECT
        oi.order_id AS appointment_id,
        oi.product_id AS product_id,
        it.name AS product_name,
        oi.quantity AS quantity,
        oi.unit_price AS unit_price,
        oi.subtotal AS subtotal
      FROM order_items oi
      LEFT JOIN items it ON oi.product_id = it.id
      WHERE oi.order_id IN (${placeholders})
      `,
      productAppointmentIds
    );

    const byAppointmentId = new Map<number, UserOrderProductInfo[]>();
    for (const pr of productRows as any[]) {
      const appointmentId = Number(pr.appointment_id);
      const arr = byAppointmentId.get(appointmentId) ?? [];
      arr.push({
        product_id: Number(pr.product_id),
        product_name: pr.product_name === null ? null : String(pr.product_name),
        quantity: Number(pr.quantity),
        unit_price: Number(pr.unit_price),
        subtotal: Number(pr.subtotal),
      });
      byAppointmentId.set(appointmentId, arr);
    }

    return base.map((o) => {
      if (o.order_type !== "product") return o;
      return {
        ...o,
        products: byAppointmentId.get(o.appointment_id) ?? [],
      };
    });
  }
}

