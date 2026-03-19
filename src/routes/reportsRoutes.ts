import { Router } from "express";
import { ReportsController } from "../controllers/reportsController";

const router = Router();
const controller = new ReportsController();

// 1. Reporte de órdenes por sucursal
router.get("/orders-by-branch", controller.getOrdersByBranch);

// 2. Reporte de órdenes por estado de orden
router.get("/orders-by-status", controller.getOrdersByStatus);

// 3. Reporte de dinero ganado por sucursal
router.get("/revenue-by-branch", controller.getRevenueByBranch);

// 4. Reporte de puntos otorgados por sucursal
router.get("/points-by-branch", controller.getPointsByBranch);

// 5. Reporte de cantidad de órdenes completadas por trabajador
router.get("/completed-orders-by-worker", controller.getCompletedOrdersByWorker);

// Reportes filtrados por sucursal (id_branch en la URL)
router.get("/branch/:id_branch/orders-by-branch", controller.getOrdersByBranchForBranch);
router.get("/branch/:id_branch/orders-by-status", controller.getOrdersByStatusForBranch);
router.get("/branch/:id_branch/revenue-by-branch", controller.getRevenueByBranchForBranch);
router.get("/branch/:id_branch/points-by-branch", controller.getPointsByBranchForBranch);
router.get("/branch/:id_branch/completed-orders-by-worker", controller.getCompletedOrdersByWorkerForBranch);

// Nuevos reportes analíticos por sucursal
router.get("/branch/:id_branch/top-services", controller.getTopServicesByBranch);
router.get("/branch/:id_branch/peak-traffic", controller.getPeakTrafficByBranch);
router.get("/branch/:id_branch/top-workers-by-area", controller.getTopWorkersByAreaForBranch);

export default router;

