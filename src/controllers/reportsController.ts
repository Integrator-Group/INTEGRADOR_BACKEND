import { Request, Response } from "express";
import { ReportsService } from "../services/reportsService";

function resolveDateRange(startDateParam?: string, endDateParam?: string): { startDate: string; endDate: string } {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  let startDate = startDateParam;
  let endDate = endDateParam;

  if (!startDate && !endDate) {
    startDate = todayStr;
    endDate = todayStr;
  } else if (startDate && !endDate) {
    endDate = startDate;
  } else if (!startDate && endDate) {
    startDate = endDate;
  }

  return {
    startDate: startDate as string,
    endDate: endDate as string,
  };
}

export class ReportsController {
  private readonly service: ReportsService;

  constructor() {
    this.service = new ReportsService();
  }

  getOrdersByBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );

      const data = await this.service.getOrdersByBranch(startDate, endDate);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de órdenes por sucursal",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getOrdersByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );

      const data = await this.service.getOrdersByStatus(startDate, endDate);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de órdenes por estado",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getRevenueByBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );

      const data = await this.service.getRevenueByBranch(startDate, endDate);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de dinero ganado por sucursal",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getPointsByBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );

      const data = await this.service.getPointsByBranch(startDate, endDate);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de puntos por sucursal",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getCompletedOrdersByWorker = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );

      const data = await this.service.getCompletedOrdersByWorker(startDate, endDate);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de órdenes completadas por trabajador",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getOrdersByBranchForBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_branch = parseInt(req.params.id_branch, 10);
      if (isNaN(id_branch)) {
        res.status(400).json({ success: false, message: "ID de sucursal inválido" });
        return;
      }
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );
      const data = await this.service.getOrdersByBranchForBranch(id_branch, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de órdenes por sucursal",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getOrdersByStatusForBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_branch = parseInt(req.params.id_branch, 10);
      if (isNaN(id_branch)) {
        res.status(400).json({ success: false, message: "ID de sucursal inválido" });
        return;
      }
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );
      const data = await this.service.getOrdersByStatusForBranch(id_branch, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de órdenes por estado",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getRevenueByBranchForBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_branch = parseInt(req.params.id_branch, 10);
      if (isNaN(id_branch)) {
        res.status(400).json({ success: false, message: "ID de sucursal inválido" });
        return;
      }
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );
      const data = await this.service.getRevenueByBranchForBranch(id_branch, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de dinero ganado por sucursal",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getPointsByBranchForBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_branch = parseInt(req.params.id_branch, 10);
      if (isNaN(id_branch)) {
        res.status(400).json({ success: false, message: "ID de sucursal inválido" });
        return;
      }
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );
      const data = await this.service.getPointsByBranchForBranch(id_branch, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de puntos por sucursal",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getCompletedOrdersByWorkerForBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_branch = parseInt(req.params.id_branch, 10);
      if (isNaN(id_branch)) {
        res.status(400).json({ success: false, message: "ID de sucursal inválido" });
        return;
      }
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );
      const data = await this.service.getCompletedOrdersByWorkerForBranch(id_branch, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de órdenes completadas por trabajador",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getTopServicesByBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_branch = parseInt(req.params.id_branch, 10);
      if (isNaN(id_branch)) {
        res.status(400).json({ success: false, message: "ID de sucursal inválido" });
        return;
      }
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );
      const data = await this.service.getTopServicesByBranch(id_branch, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de servicios más agendados",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getPeakTrafficByBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_branch = parseInt(req.params.id_branch, 10);
      if (isNaN(id_branch)) {
        res.status(400).json({ success: false, message: "ID de sucursal inválido" });
        return;
      }
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );
      const data = await this.service.getPeakTrafficByBranch(id_branch, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de mayor frecuencia de clientes",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  getTopWorkersByAreaForBranch = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_branch = parseInt(req.params.id_branch, 10);
      if (isNaN(id_branch)) {
        res.status(400).json({ success: false, message: "ID de sucursal inválido" });
        return;
      }
      const { startDate, endDate } = resolveDateRange(
        req.query.startDate as string | undefined,
        req.query.endDate as string | undefined
      );
      const data = await this.service.getTopWorkersByAreaForBranch(id_branch, startDate, endDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte de trabajadores más solicitados por área",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };
}

