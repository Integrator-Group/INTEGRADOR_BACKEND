import { Request, Response } from "express";
import { CustomerLoyaltyService } from "../services/customerLoyaltyService";

export class CustomerLoyaltyController {
  private readonly service: CustomerLoyaltyService;

  constructor() {
    this.service = new CustomerLoyaltyService();
  }

  getByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_user = parseInt(req.params.id_user, 10);
      if (isNaN(id_user)) {
        res.status(400).json({ success: false, message: "ID de usuario inválido" });
        return;
      }

      const data = await this.service.getByUser(id_user);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener puntos del usuario",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  earn = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id_user, amount, reason } = req.body ?? {};
      const parsedUser = Number(id_user);
      const parsedAmount = Number(amount);

      if (!Number.isInteger(parsedUser) || parsedUser <= 0) {
        res.status(400).json({ success: false, message: "id_user inválido" });
        return;
      }
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        res.status(400).json({ success: false, message: "amount inválido" });
        return;
      }

      const data = await this.service.earn({
        id_user: parsedUser,
        amount: parsedAmount,
        reason: typeof reason === "string" ? reason : undefined,
      });

      res.status(200).json({
        success: true,
        message: "Puntos acumulados correctamente",
        data,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      res.status(400).json({ success: false, message });
    }
  };

  setPoints = async (req: Request, res: Response): Promise<void> => {
    try {
      const id_user = parseInt(req.params.id_user, 10);
      if (isNaN(id_user)) {
        res.status(400).json({ success: false, message: "ID de usuario inválido" });
        return;
      }
      const points = Number(req.body?.points);
      const data = await this.service.setPoints(id_user, points);
      res.status(200).json({ success: true, message: "Puntos actualizados", data });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      res.status(400).json({ success: false, message });
    }
  };
}

