import pool from "../config/database";
import { UserOrderPaymentView } from "../models/UserOrders";

type UserOrderPaymentRow = {
  appointment_id: number;
  order_number: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  status: string;
  service_name: string;
  service_description: string;
  service_duration_min: number;
  service_price: number;
  branch_name: string;
  professional_id: number;
  professional_names: string;
  professional_last_names: string;
  professional_profile_photo: string | null;
  payment_amount: number | null;
  payment_method: string | null;
  payment_status: string | null;
  paid_at: string | null;
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
        py.paid_at AS paid_at
      FROM appointments ap
      JOIN appointment_status aps ON ap.id_state_appointment = aps.id
      JOIN services se ON ap.id_service = se.id
      JOIN branches br ON ap.id_branch = br.id
      JOIN users pr ON ap.id_professional = pr.id
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
      WHERE ap.id_user = ?
      ORDER BY ap.schedule_date DESC, ap.created_at DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}
      `,
      [id_user]
    );

    return (rows as UserOrderPaymentRow[]).map((r) => ({
      appointment_id: r.appointment_id,
      order_number: r.order_number,
      schedule_date: r.schedule_date,
      start_time: r.start_time,
      end_time: r.end_time,
      status: r.status,
      service: {
        name: r.service_name,
        description: r.service_description,
        duration_min: r.service_duration_min,
        price: r.service_price,
      },
      professional: {
        id: r.professional_id,
        names: r.professional_names,
        last_names: r.professional_last_names,
        profile_photo: r.professional_profile_photo,
      },
      branch: { name: r.branch_name },
      payment:
        r.payment_amount === null || !r.payment_method || !r.payment_status
          ? null
          : {
              amount: r.payment_amount,
              method: r.payment_method,
              status: r.payment_status,
              paid_at: r.paid_at,
            },
    }));
  }
}

