import { CustomerLoyaltyRepository } from "../repositories/customerLoyaltyRepository";
import { CustomerLoyalty, LoyaltyEarnRequest } from "../models/CustomerLoyalty";

export class CustomerLoyaltyService {
  private readonly repo: CustomerLoyaltyRepository;

  constructor() {
    this.repo = new CustomerLoyaltyRepository();
  }

  async getByUser(id_user: number): Promise<CustomerLoyalty> {
    await this.repo.ensureRow(id_user);
    const row = await this.repo.findByUserId(id_user);
    if (!row) throw new Error("No se pudo obtener la lealtad del usuario");
    return row;
  }

  private calcPointsFromAmount(amount: number): number {
    // Regla: por cada $1 => 2 puntos.
    // Redondeo: si decimal < 0.5 baja; si decimal >= 0.5 sube.
    const raw = amount * 2;
    return Math.floor(raw + 0.5 + Number.EPSILON);
  }

  async earn(req: LoyaltyEarnRequest): Promise<CustomerLoyalty> {
    if (!Number.isFinite(req.amount) || req.amount <= 0) {
      throw new Error("El monto debe ser mayor a 0");
    }
    const delta = this.calcPointsFromAmount(req.amount);
    const updated = await this.repo.addPoints(req.id_user, delta);
    await this.repo.addTransaction(req.id_user, delta, req.reason ?? "Compra");
    return updated;
  }

  async setPoints(id_user: number, points: number): Promise<CustomerLoyalty> {
    if (!Number.isFinite(points) || points < 0) {
      throw new Error("Los puntos deben ser un número mayor o igual a 0");
    }
    return this.repo.setPoints(id_user, Math.floor(points));
  }
}

