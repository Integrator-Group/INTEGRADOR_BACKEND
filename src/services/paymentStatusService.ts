import { PaymentStatusRepository } from '../repositories/paymentStatusRepository';
import { PaymentStatus, PaymentStatusCreate, PaymentStatusUpdate } from '../models/Payment_Status';

export class PaymentStatusService {
    private paymentStatusRepository: PaymentStatusRepository;

    constructor() {
        this.paymentStatusRepository = new PaymentStatusRepository();
    }

    async getAllPaymentStatuses(): Promise<PaymentStatus[]> {
        return await this.paymentStatusRepository.findAll();
    }

    async getPaymentStatusById(id: number): Promise<PaymentStatus> {
        const paymentStatus = await this.paymentStatusRepository.findById(id);
        if (!paymentStatus) {
            throw new Error('Estado de pago no encontrado');
        }
        return paymentStatus;
    }

    async createPaymentStatus(paymentStatus: PaymentStatusCreate): Promise<PaymentStatus> {
        try {
            const existente = await this.paymentStatusRepository.findByName(paymentStatus.name);
            if (existente) {
                throw new Error('El nombre del estado de pago ya existe');
            }
            return await this.paymentStatusRepository.create(paymentStatus);
        } catch (error) {
            if (error instanceof Error && error.message === 'El nombre del estado de pago ya existe') {
                throw error;
            }
            throw new Error('Error al crear el estado de pago: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    async updatePaymentStatus(id: number, paymentStatus: PaymentStatusUpdate): Promise<PaymentStatus> {
        try {
            const existente = await this.paymentStatusRepository.findById(id);
            if (!existente) {
                throw new Error('Estado de pago no encontrado');
            }

            // Si cambian el nombre, validar duplicado
            if (paymentStatus.name !== undefined) {
                const existenteNombre = await this.paymentStatusRepository.findByName(paymentStatus.name);
                if (existenteNombre) {
                    throw new Error('El nombre del estado de pago ya existe');
                }
            }

            const actualizado = await this.paymentStatusRepository.update(id, paymentStatus);
            if (!actualizado) {
                throw new Error('Error al actualizar el estado de pago');
            }
            return actualizado;
        } catch (error) {
            if (error instanceof Error && (error.message === 'Estado de pago no encontrado' || error.message === 'El nombre del estado de pago ya existe')) {
                throw error;
            }
            throw new Error('Error al actualizar el estado de pago: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    async deletePaymentStatus(id: number): Promise<void> {
        const existente = await this.paymentStatusRepository.findById(id);
        if (!existente) {
            throw new Error('Estado de pago no encontrado');
        }
        await this.paymentStatusRepository.delete(id);
    }
}

