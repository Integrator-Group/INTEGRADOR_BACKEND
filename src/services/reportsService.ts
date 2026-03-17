import {
  ReportsRepository,
  OrdersByBranchRow,
  OrdersByStatusRow,
  RevenueByBranchRow,
  PointsByBranchRow,
  CompletedOrdersByWorkerRow,
} from "../repositories/reportsRepository";

export class ReportsService {
  private readonly repo: ReportsRepository;

  constructor() {
    this.repo = new ReportsRepository();
  }

  async getOrdersByBranch(startDate: string, endDate: string): Promise<OrdersByBranchRow[]> {
    return this.repo.getOrdersByBranch(startDate, endDate);
  }

  async getOrdersByStatus(startDate: string, endDate: string): Promise<OrdersByStatusRow[]> {
    return this.repo.getOrdersByStatus(startDate, endDate);
  }

  async getRevenueByBranch(startDate: string, endDate: string): Promise<RevenueByBranchRow[]> {
    return this.repo.getRevenueByBranch(startDate, endDate);
  }

  async getPointsByBranch(startDate: string, endDate: string): Promise<PointsByBranchRow[]> {
    return this.repo.getPointsByBranch(startDate, endDate);
  }

  async getCompletedOrdersByWorker(startDate: string, endDate: string): Promise<CompletedOrdersByWorkerRow[]> {
    return this.repo.getCompletedOrdersByWorker(startDate, endDate);
  }

  async getOrdersByBranchForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<OrdersByBranchRow[]> {
    return this.repo.getOrdersByBranchForBranch(id_branch, startDate, endDate);
  }

  async getOrdersByStatusForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<OrdersByStatusRow[]> {
    return this.repo.getOrdersByStatusForBranch(id_branch, startDate, endDate);
  }

  async getRevenueByBranchForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<RevenueByBranchRow[]> {
    return this.repo.getRevenueByBranchForBranch(id_branch, startDate, endDate);
  }

  async getPointsByBranchForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<PointsByBranchRow[]> {
    return this.repo.getPointsByBranchForBranch(id_branch, startDate, endDate);
  }

  async getCompletedOrdersByWorkerForBranch(
    id_branch: number,
    startDate: string,
    endDate: string
  ): Promise<CompletedOrdersByWorkerRow[]> {
    return this.repo.getCompletedOrdersByWorkerForBranch(id_branch, startDate, endDate);
  }
}

