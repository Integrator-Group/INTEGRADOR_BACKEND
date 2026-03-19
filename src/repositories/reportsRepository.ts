import pool from "../config/database";

export type OrdersByBranchRow = {
  id_branch: number;
  branch_name: string;
  total_orders: number;
};

export type OrdersByStatusRow = {
  status_id: number;
  status_name: string;
  total_orders: number;
};

export type RevenueByBranchRow = {
  id_branch: number;
  branch_name: string;
  total_revenue: number;
};

export type PointsByBranchRow = {
  id_branch: number;
  branch_name: string;
  total_points: number;
};

export type CompletedOrdersByWorkerRow = {
  id_professional: number;
  professional_names: string;
  professional_last_names: string | null;
  total_completed_orders: number;
};

export type TopServiceByBranchRow = {
  id_service: number;
  service_name: string;
  total_appointments: number;
};

export type PeakTrafficByBranchRow = {
  day: string;
  hour: number;
  total_appointments: number;
};

export type TopWorkerByAreaRow = {
  id_area: number;
  area_name: string;
  id_professional: number;
  professional_names: string;
  professional_last_names: string | null;
  total_appointments: number;
};

export class ReportsRepository {
  private readonly REVERSED_PAYMENT_STATUS_ID = 4;
  private readonly COMPLETED_APPOINTMENT_STATUS_ID = 2;
  private readonly CANCELED_APPOINTMENT_STATUS_ID = 3;
  private readonly POINTS_PAYMENT_METHOD_ID = 4;
  async getOrdersByBranch(startDate: string, endDate: string): Promise<OrdersByBranchRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        ap.id_branch AS id_branch,
        br.name AS branch_name,
        COUNT(*) AS total_orders
      FROM appointments ap
      JOIN branches br ON ap.id_branch = br.id
      WHERE ap.schedule_date >= ? AND ap.schedule_date <= ?
      GROUP BY ap.id_branch, br.name
      ORDER BY br.name ASC
      `,
      [startDate, endDate]
    );

    return rows.map((r) => ({
      id_branch: Number(r.id_branch),
      branch_name: String(r.branch_name),
      total_orders: Number(r.total_orders),
    }));
  }

  async getOrdersByStatus(startDate: string, endDate: string): Promise<OrdersByStatusRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        aps.id AS status_id,
        aps.name AS status_name,
        COUNT(*) AS total_orders
      FROM appointments ap
      JOIN appointment_status aps ON ap.id_state_appointment = aps.id
      WHERE ap.schedule_date >= ? AND ap.schedule_date <= ?
      GROUP BY aps.id, aps.name
      ORDER BY aps.name ASC
      `,
      [startDate, endDate]
    );

    return rows.map((r) => ({
      status_id: Number(r.status_id),
      status_name: String(r.status_name),
      total_orders: Number(r.total_orders),
    }));
  }

  async getRevenueByBranch(startDate: string, endDate: string): Promise<RevenueByBranchRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        ap.id_branch AS id_branch,
        br.name AS branch_name,
        COALESCE(SUM(py.amount), 0) AS total_revenue
      FROM appointments ap
      JOIN branches br ON ap.id_branch = br.id
      JOIN payments py ON py.id_appointment = ap.id
      WHERE
        py.id_status_payment <> ?
        AND py.id_method <> ?
        AND DATE(ap.schedule_date) >= ?
        AND DATE(ap.schedule_date) <= ?
      GROUP BY ap.id_branch, br.name
      ORDER BY br.name ASC
      `,
      [this.REVERSED_PAYMENT_STATUS_ID, this.POINTS_PAYMENT_METHOD_ID, startDate, endDate]
    );

    return rows.map((r) => ({
      id_branch: Number(r.id_branch),
      branch_name: String(r.branch_name),
      total_revenue: Number(r.total_revenue),
    }));
  }

  async getPointsByBranch(startDate: string, endDate: string): Promise<PointsByBranchRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        ap.id_branch AS id_branch,
        br.name AS branch_name,
        COALESCE(SUM(ROUND(py.amount * 2)), 0) AS total_points
      FROM appointments ap
      JOIN branches br ON ap.id_branch = br.id
      JOIN payments py ON py.id_appointment = ap.id
      WHERE
        py.id_method <> ?
        AND py.id_status_payment <> ?
        AND ap.id_state_appointment <> ?
        AND DATE(ap.schedule_date) >= ?
        AND DATE(ap.schedule_date) <= ?
      GROUP BY ap.id_branch, br.name
      ORDER BY br.name ASC
      `,
      [
        this.POINTS_PAYMENT_METHOD_ID,
        this.REVERSED_PAYMENT_STATUS_ID,
        this.CANCELED_APPOINTMENT_STATUS_ID,
        startDate,
        endDate,
      ]
    );

    return rows.map((r) => ({
      id_branch: Number(r.id_branch),
      branch_name: String(r.branch_name),
      total_points: Number(r.total_points),
    }));
  }

  async getCompletedOrdersByWorker(startDate: string, endDate: string): Promise<CompletedOrdersByWorkerRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        pr.id AS id_professional,
        pr.names AS professional_names,
        pr.last_names AS professional_last_names,
        COUNT(*) AS total_completed_orders
      FROM appointments ap
      JOIN users pr ON ap.id_professional = pr.id
      WHERE
        ap.id_state_appointment = ?
        AND ap.schedule_date >= ?
        AND ap.schedule_date <= ?
      GROUP BY pr.id, pr.names, pr.last_names
      ORDER BY pr.names ASC, pr.last_names ASC
      `,
      [this.COMPLETED_APPOINTMENT_STATUS_ID, startDate, endDate]
    );

    return rows.map((r) => ({
      id_professional: Number(r.id_professional),
      professional_names: String(r.professional_names),
      professional_last_names: r.professional_last_names === null ? null : String(r.professional_last_names),
      total_completed_orders: Number(r.total_completed_orders),
    }));
  }

  async getOrdersByBranchForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<OrdersByBranchRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        ap.id_branch AS id_branch,
        br.name AS branch_name,
        COUNT(*) AS total_orders
      FROM appointments ap
      JOIN branches br ON ap.id_branch = br.id
      WHERE ap.id_branch = ? AND ap.schedule_date >= ? AND ap.schedule_date <= ?
      GROUP BY ap.id_branch, br.name
      ORDER BY br.name ASC
      `,
      [id_branch, startDate, endDate]
    );

    return rows.map((r) => ({
      id_branch: Number(r.id_branch),
      branch_name: String(r.branch_name),
      total_orders: Number(r.total_orders),
    }));
  }

  async getOrdersByStatusForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<OrdersByStatusRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        aps.id AS status_id,
        aps.name AS status_name,
        COUNT(*) AS total_orders
      FROM appointments ap
      JOIN appointment_status aps ON ap.id_state_appointment = aps.id
      WHERE ap.id_branch = ? AND ap.schedule_date >= ? AND ap.schedule_date <= ?
      GROUP BY aps.id, aps.name
      ORDER BY aps.name ASC
      `,
      [id_branch, startDate, endDate]
    );

    return rows.map((r) => ({
      status_id: Number(r.status_id),
      status_name: String(r.status_name),
      total_orders: Number(r.total_orders),
    }));
  }

  async getRevenueByBranchForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<RevenueByBranchRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        ap.id_branch AS id_branch,
        br.name AS branch_name,
        COALESCE(SUM(py.amount), 0) AS total_revenue
      FROM appointments ap
      JOIN branches br ON ap.id_branch = br.id
      JOIN payments py ON py.id_appointment = ap.id
      WHERE
        ap.id_branch = ?
        AND py.id_status_payment <> ?
        AND py.id_method <> ?
        AND DATE(ap.schedule_date) >= ?
        AND DATE(ap.schedule_date) <= ?
      GROUP BY ap.id_branch, br.name
      ORDER BY br.name ASC
      `,
      [id_branch, this.REVERSED_PAYMENT_STATUS_ID, this.POINTS_PAYMENT_METHOD_ID, startDate, endDate]
    );

    return rows.map((r) => ({
      id_branch: Number(r.id_branch),
      branch_name: String(r.branch_name),
      total_revenue: Number(r.total_revenue),
    }));
  }

  async getPointsByBranchForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<PointsByBranchRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        ap.id_branch AS id_branch,
        br.name AS branch_name,
        COALESCE(SUM(ROUND(py.amount * 2)), 0) AS total_points
      FROM appointments ap
      JOIN branches br ON ap.id_branch = br.id
      JOIN payments py ON py.id_appointment = ap.id
      WHERE
        ap.id_branch = ?
        AND py.id_method <> ?
        AND py.id_status_payment <> ?
        AND ap.id_state_appointment <> ?
        AND ap.schedule_date >= ?
        AND ap.schedule_date <= ?
      GROUP BY ap.id_branch, br.name
      ORDER BY br.name ASC
      `,
      [
        id_branch,
        this.POINTS_PAYMENT_METHOD_ID,
        this.REVERSED_PAYMENT_STATUS_ID,
        this.CANCELED_APPOINTMENT_STATUS_ID,
        startDate,
        endDate,
      ]
    );

    return rows.map((r) => ({
      id_branch: Number(r.id_branch),
      branch_name: String(r.branch_name),
      total_points: Number(r.total_points),
    }));
  }

  async getCompletedOrdersByWorkerForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<CompletedOrdersByWorkerRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        pr.id AS id_professional,
        pr.names AS professional_names,
        pr.last_names AS professional_last_names,
        COUNT(*) AS total_completed_orders
      FROM appointments ap
      JOIN users pr ON ap.id_professional = pr.id
      WHERE
        ap.id_branch = ?
        AND ap.id_state_appointment = ?
        AND ap.schedule_date >= ?
        AND ap.schedule_date <= ?
      GROUP BY pr.id, pr.names, pr.last_names
      ORDER BY pr.names ASC, pr.last_names ASC
      `,
      [id_branch, this.COMPLETED_APPOINTMENT_STATUS_ID, startDate, endDate]
    );

    return rows.map((r) => ({
      id_professional: Number(r.id_professional),
      professional_names: String(r.professional_names),
      professional_last_names: r.professional_last_names === null ? null : String(r.professional_last_names),
      total_completed_orders: Number(r.total_completed_orders),
    }));
  }

  async getTopServicesByBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<TopServiceByBranchRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        se.id AS id_service,
        se.name AS service_name,
        COUNT(*) AS total_appointments
      FROM appointments ap
      JOIN services se ON ap.id_service = se.id
      WHERE
        ap.id_branch = ?
        AND ap.schedule_date >= ?
        AND ap.schedule_date <= ?
      GROUP BY se.id, se.name
      ORDER BY total_appointments DESC, se.name ASC
      `,
      [id_branch, startDate, endDate]
    );

    return rows.map((r) => ({
      id_service: Number(r.id_service),
      service_name: String(r.service_name),
      total_appointments: Number(r.total_appointments),
    }));
  }

  async getPeakTrafficByBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<PeakTrafficByBranchRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        DATE_FORMAT(ap.schedule_date, '%Y-%m-%d') AS day,
        HOUR(ap.start_time) AS hour,
        COUNT(*) AS total_appointments
      FROM appointments ap
      WHERE
        ap.id_branch = ?
        AND ap.schedule_date >= ?
        AND ap.schedule_date <= ?
      GROUP BY DATE_FORMAT(ap.schedule_date, '%Y-%m-%d'), HOUR(ap.start_time)
      ORDER BY total_appointments DESC, day ASC, hour ASC
      `,
      [id_branch, startDate, endDate]
    );

    return rows.map((r) => ({
      day: String(r.day),
      hour: Number(r.hour),
      total_appointments: Number(r.total_appointments),
    }));
  }

  async getTopWorkersByAreaForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<TopWorkerByAreaRow[]> {
    const [rows] = await pool.execute<any[]>(
      `
      SELECT
        ar.id AS id_area,
        ar.name AS area_name,
        pr.id AS id_professional,
        pr.names AS professional_names,
        pr.last_names AS professional_last_names,
        COUNT(*) AS total_appointments
      FROM appointments ap
      JOIN services se ON ap.id_service = se.id
      JOIN areas ar ON se.id_area = ar.id
      JOIN users pr ON ap.id_professional = pr.id
      WHERE
        ap.id_branch = ?
        AND ap.schedule_date >= ?
        AND ap.schedule_date <= ?
      GROUP BY
        ar.id,
        ar.name,
        pr.id,
        pr.names,
        pr.last_names
      ORDER BY
        ar.name ASC,
        total_appointments DESC,
        pr.names ASC,
        pr.last_names ASC
      `,
      [id_branch, startDate, endDate]
    );

    return rows.map((r) => ({
      id_area: Number(r.id_area),
      area_name: String(r.area_name),
      id_professional: Number(r.id_professional),
      professional_names: String(r.professional_names),
      professional_last_names: r.professional_last_names === null ? null : String(r.professional_last_names),
      total_appointments: Number(r.total_appointments),
    }));
  }
}

