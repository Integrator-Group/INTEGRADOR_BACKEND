import { AppointmentsRepository } from "../repositories/appointmentsRepository";
import { PaymentsRepository } from "../repositories/paymentsRepository";
import { PaymentMethodsRepository } from "../repositories/paymentMethodsRepository";
import { Appointment, AppointmentCreate, AppointmentUpdate } from "../models/Appointments";
import { CustomerLoyaltyService } from "./customerLoyaltyService";

const REVERSED_PAYMENT_STATUS_ID = 4;
const COMPLETED_APPOINTMENT_STATUS_ID = 2;
const PAYMENT_METHOD_POINTS_NAMES = ["puntos", "punto"];
const PAYMENT_METHOD_CASH_NAMES = ["efectivo", "cash"];

function isPointsPayment(methodName: string): boolean {
    const name = (methodName || "").toLowerCase().trim();
    return PAYMENT_METHOD_POINTS_NAMES.some(
        (keyword) => name === keyword || name.includes(keyword)
    );
}

function isCashPayment(methodName: string): boolean {
    const name = (methodName || "").toLowerCase().trim();
    return PAYMENT_METHOD_CASH_NAMES.some(
        (keyword) => name === keyword || name.includes(keyword)
    );
}

export class AppointmentsServices {
    private readonly appointmentsRepository: AppointmentsRepository;
    private readonly customerLoyaltyService: CustomerLoyaltyService;
    private readonly paymentsRepository: PaymentsRepository;
    private readonly paymentMethodsRepository: PaymentMethodsRepository;

    constructor() {
        this.appointmentsRepository = new AppointmentsRepository();
        this.customerLoyaltyService = new CustomerLoyaltyService();
        this.paymentsRepository = new PaymentsRepository();
        this.paymentMethodsRepository = new PaymentMethodsRepository();
    }

    async getAllAppointments(): Promise<Appointment[]> {
        return this.appointmentsRepository.findAll();
    }

    async getAllAppointmentsByUser(id_user: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findAllByUser(id_user);
    }

    async getScheduledByUser(id_user: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findScheduledByUser(id_user);
    }

    async getFilledByUser(id_user: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findFilledByUser(id_user);
    }

    async getCanceledByUser(id_user: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findCanceledByUser(id_user);
    }

    async getAllAppointmentsByProfessionalDate(id_professional: number, startDate: string, endDate: string): Promise<Appointment[]> {
        return this.appointmentsRepository.findAllByProfessionalDate(id_professional, startDate, endDate);
    }

    async getAllAppointmentsByProfessional(id_professional: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findAllByProfessional(id_professional);
    }

    async getScheduledByProfessional(id_professional: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findScheduledByProfessional(id_professional);
    }

    async getFilledByProfessional(id_professional: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findFilledByProfessional(id_professional);
    }

    async getCanceledByProfessional(id_professional: number): Promise<Appointment[]> {
        return this.appointmentsRepository.findCanceledByProfessional(id_professional)
    }

    async getAllAppointmentsByBranch(id_branch: number, startDate: string, endDate: string): Promise<Appointment[]> {
        return this.appointmentsRepository.findAllByBranch(id_branch, startDate, endDate);
    }

    async getAllOrdersByBranchWithItems(
        id_branch: number,
        startDate: string,
        endDate: string
    ): Promise<any> {
        return this.appointmentsRepository.findAllOrdersByBranchWithItems(id_branch, startDate, endDate);
    }

    async createAppointment(appointment: AppointmentCreate): Promise<Appointment> {
        try {
            return await this.appointmentsRepository.create(appointment);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }

            throw new Error('Error al agendar la cita: ' + (error instanceof Error ? error.message : 'Error desconocido'))
        }
    }

    async updateAppointment(id: number, appointment: AppointmentUpdate): Promise<Appointment> {
        try {
            const appointmentExists = await this.appointmentsRepository.findById(id);
            console.log("appointmentExists", appointmentExists);
            if (!appointmentExists) {
                throw new Error('Cita no encontrada');
            }

            const appointmentUpdated = await this.appointmentsRepository.update(id, appointment);
            console.log("appointmentUpdated", appointmentUpdated);
            if (!appointmentUpdated) {
                throw new Error('Error al actualizar la cita')
            }
            console.log("appointment", appointment);

            if ( Number(appointment.id_state_appointment) === COMPLETED_APPOINTMENT_STATUS_ID ) {
                console.log("appointment.id_state_appointment", appointment.id_state_appointment);
                const payments = await this.paymentsRepository.findByAppointmentId(id);
                console.log("payments", payments);
                for (const payment of payments) {
                    if (payment.id_status_payment === REVERSED_PAYMENT_STATUS_ID) continue;
                    const method = await this.paymentMethodsRepository.findById(payment.id_method);
                    if (method && isCashPayment(method.name)) {
                        console.log("isCashPayment", isCashPayment(method.name));
                        const amount = Number(payment.amount);
                        if (Number.isFinite(amount) && amount > 0) {
                            await this.customerLoyaltyService.earn({
                                id_user: appointmentExists.id_user,
                                amount,
                                reason: "Pago en efectivo - Cita completada",
                            });
                        }
                    }
                }
            }

            return appointmentUpdated;

        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error('Error desconocido al actualizar')
        }
    }

    async cancelAppointment(id: number): Promise<Appointment> {
        try {
            const appointment = await this.appointmentsRepository.findById(id);
            if (!appointment) {
                throw new Error("Cita no encontrada");
            }

            const payments = await this.paymentsRepository.findByAppointmentId(id);
            for (const payment of payments) {
                if (payment.id_status_payment === REVERSED_PAYMENT_STATUS_ID) continue;
                const method = await this.paymentMethodsRepository.findById(payment.id_method);
                if (!method) continue;
                if (isPointsPayment(method.name)) {
                    const pointsToRefund = Number(payment.amount);
                    if (Number.isFinite(pointsToRefund) && pointsToRefund > 0) {
                        await this.customerLoyaltyService.refundPoints(
                            appointment.id_user,
                            pointsToRefund,
                            "Reversión por cancelación"
                        );
                    }
                } else if (!isCashPayment(method.name)) {
                    const amount = Number(payment.amount);
                    if (Number.isFinite(amount) && amount > 0) {
                        await this.customerLoyaltyService.reverseEarn(
                            appointment.id_user,
                            amount,
                            "Reversión por cancelación"
                        );
                    }
                } else if (appointment.id_state_appointment === COMPLETED_APPOINTMENT_STATUS_ID) {
                    const amount = Number(payment.amount);
                    if (Number.isFinite(amount) && amount > 0) {
                        await this.customerLoyaltyService.reverseEarn(
                            appointment.id_user,
                            amount,
                            "Reversión por cancelación"
                        );
                    }
                }
            }

            return await this.appointmentsRepository.cancelAndReversePayment(id);
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error('Error desconocido al cancelar la cita');
        }
    }
}