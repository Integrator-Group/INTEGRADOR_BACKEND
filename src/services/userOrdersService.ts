import { UserOrdersRepository } from "../repositories/userOrdersRepository";
import { UserOrderPaymentView } from "../models/UserOrders";

export class UserOrdersService {
  private readonly repo: UserOrdersRepository;

  constructor() {
    this.repo = new UserOrdersRepository();
  }

  async getOrdersAndPaymentsByUser(
    id_user: number,
    limit: number,
    offset: number
  ): Promise<UserOrderPaymentView[]> {
    return this.repo.findOrdersAndPaymentsByUser(id_user, limit, offset);
  }
}

