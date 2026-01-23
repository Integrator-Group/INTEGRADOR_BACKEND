import { PaymentsRepository } from "../repositories/paymentsRepository";
import { Payment, PaymentCreate, PaymentUpdate } from "../models/Payments";

export class PaymentsServices {
    private paymentsRepository: PaymentsRepository;

    constructor() {
        this.paymentsRepository = new PaymentsRepository();
    }

    async createPayment(payment: PaymentCreate): Promise<Payment> {
        try {
            return await this.paymentsRepository.create(payment);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }

            throw new Error('Error al crear el pago: ' + (error instanceof Error ? error.message : 'Error desconocido'))
        }
    }

    async updatePayment(id: number, payment: PaymentUpdate): Promise<Payment> {
        try {
            const paymentExists = await this.paymentsRepository.findById(id);
            if (!paymentExists) {
                throw new Error('Pago no encontrado');
            }

            const paymentUpdated = await this.paymentsRepository.update(id, payment);
            if (!paymentUpdated) {
                throw new Error('Error al actualizar el pago');
            }

            return paymentUpdated;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error("Error desconocido al actualizar");
        }
    }
}