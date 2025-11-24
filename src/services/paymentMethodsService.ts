import { PaymentMethodsRepository } from '../repositories/paymentMethodsRepository';
import { PaymentMethod, PaymentMethodCreate, PaymentMethodUpdate } from '../models/Payment_Methods';

export class PaymentMethodsService {
    private paymentMethodsRepository: PaymentMethodsRepository;

    constructor() {
        this.paymentMethodsRepository = new PaymentMethodsRepository();
    }

    async getAllPaymentMethods(): Promise<PaymentMethod[]> {
        return await this.paymentMethodsRepository.findAll();
    }
    
    async getPaymentMethodById(id: number): Promise<PaymentMethod> {
        const paymentMethod = await this.paymentMethodsRepository.findById(id);
        if (!paymentMethod) {
            throw new Error('Método de pago no encontrado');
        }
        return paymentMethod;
    }

    async createPaymentMethod(paymentMethod: PaymentMethodCreate): Promise<PaymentMethod> {
        try {
            const paymentMethodExistente = await this.paymentMethodsRepository.findByName(paymentMethod.name);
            if (paymentMethodExistente) {
                throw new Error('El nombre del método de pago ya existe');
            }
            return await this.paymentMethodsRepository.create(paymentMethod);
        } catch (error) {
            if (error instanceof Error && error.message === 'El nombre del método de pago ya existe') {
                throw error;
            }
            throw new Error('Error al crear el método de pago: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    async updatePaymentMethod(id: number, paymentMethod: PaymentMethodUpdate): Promise<PaymentMethod> {
        try {
            const paymentMethodExistente = await this.paymentMethodsRepository.findById(id);
            if (!paymentMethodExistente) {
                throw new Error('Método de pago no encontrado');
            }
            const paymentMethodActualizado = await this.paymentMethodsRepository.update(id, paymentMethod);
            if (!paymentMethodActualizado) {
                throw new Error('Error al actualizar el método de pago');
            }
            return paymentMethodActualizado;
        } catch (error) {
            if (error instanceof Error && (error.message === 'Método de pago no encontrado' || error.message === 'El nombre del método de pago ya existe')) {
                throw error;
            }
            throw new Error('Error al actualizar el método de pago: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }
    
    async deletePaymentMethod(id: number): Promise<void> {
        const paymentMethodExistente = await this.paymentMethodsRepository.findById(id);
        if (!paymentMethodExistente) {
            throw new Error('Método de pago no encontrado');
        }
        await this.paymentMethodsRepository.delete(id);
    }
}