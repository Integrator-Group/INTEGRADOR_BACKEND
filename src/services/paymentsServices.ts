import { PaymentsRepository } from "../repositories/paymentsRepository";
import { PaymentMethodsRepository } from "../repositories/paymentMethodsRepository";
import { AppointmentsRepository } from "../repositories/appointmentsRepository";
import { Payment, PaymentCreate, PaymentUpdate } from "../models/Payments";
import { CustomerLoyaltyService } from "./customerLoyaltyService";
import emailService from "../utils/emailService";
import { buildAppointmentInvoicePdf } from "../utils/invoicePdfBuilder";

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

export class PaymentsServices {
    private paymentsRepository: PaymentsRepository;
    private paymentMethodsRepository: PaymentMethodsRepository;
    private appointmentsRepository: AppointmentsRepository;
    private customerLoyaltyService: CustomerLoyaltyService;

    constructor() {
        this.paymentsRepository = new PaymentsRepository();
        this.paymentMethodsRepository = new PaymentMethodsRepository();
        this.appointmentsRepository = new AppointmentsRepository();
        this.customerLoyaltyService = new CustomerLoyaltyService();
    }

    async createPayment(payment: PaymentCreate): Promise<Payment> {
        const appointment = await this.appointmentsRepository.findById(payment.id_appointment);
        if (!appointment) {
            throw new Error("Cita no encontrada");
        }

        let loyaltyModified = false;
        let loyaltyRedeemed = false;
        let pointsToReverse = 0;

        try {
            const paymentMethod = await this.paymentMethodsRepository.findById(payment.id_method);

            if (paymentMethod && isPointsPayment(paymentMethod.name)) {
                // Regla de negocio: los productos NO se pagan con puntos.
                const orderType = (appointment.order_type ?? "service") as unknown;
                if (String(orderType).toLowerCase() === "product") {
                    throw new Error("No se permite pagar productos con puntos");
                }

                const pointsToRedeem = Number(payment.amount);
                if (!Number.isFinite(pointsToRedeem) || pointsToRedeem <= 0) {
                    throw new Error("El monto de puntos debe ser mayor a 0");
                }
                await this.customerLoyaltyService.redeem(
                    appointment.id_user,
                    pointsToRedeem,
                    "Pago con puntos"
                );
                loyaltyModified = true;
                loyaltyRedeemed = true;
                pointsToReverse = pointsToRedeem;
            } else if (!(paymentMethod && isCashPayment(paymentMethod.name))) {
                const amount = Number(payment.amount);
                if (Number.isFinite(amount) && amount > 0) {
                    const pointsDelta = this.customerLoyaltyService.calculatePoints(amount);
                    await this.customerLoyaltyService.earn({
                        id_user: appointment.id_user,
                        amount,
                        reason: "Pago de cita",
                    });
                    loyaltyModified = true;
                    loyaltyRedeemed = false;
                    pointsToReverse = pointsDelta;
                }
            }

            const savedPayment = await this.paymentsRepository.create(payment);

            try {
                const customerFullName = `${appointment.user_names} ${appointment.user_last_names || ""}`.trim();
                const professionalFullName = `${appointment.pro_names} ${appointment.pro_last_names || ""}`.trim();
                const scheduleDate = appointment.schedule_date;

                const invoicePdf = await buildAppointmentInvoicePdf({
                    seq_val: appointment.seq_val,
                    customerFullName,
                    professionalFullName,
                    serviceName: appointment.service_name,
                    branchName: appointment.branch_name,
                    scheduleDate,
                    startTime: appointment.start_time,
                    endTime: appointment.end_time,
                    paymentAmount: payment.amount,
                    paymentMethodName: paymentMethod ? paymentMethod.name : undefined,
                });

                if (appointment.user_names && appointment.user_last_names && (appointment as any).user_email) {
                    const to = (appointment as any).user_email as string;
                    await emailService.sendAppointmentConfirmationEmail(
                        {
                            to,
                            customerFullName,
                            professionalFullName,
                            serviceName: appointment.service_name,
                            scheduleDate,
                            startTime: appointment.start_time,
                            endTime: appointment.end_time,
                            paymentAmount: payment.amount,
                            paymentMethodName: paymentMethod ? paymentMethod.name : undefined,
                            appointmentCode: appointment.seq_val,
                            clientPortalUrl: undefined,
                        },
                        invoicePdf
                    );
                }
            } catch (emailError) {
                console.error("Error al enviar correo de confirmación de cita:", emailError);
            }

            return savedPayment;
        } catch (error) {
            if (loyaltyModified) {
                try {
                    if (loyaltyRedeemed) {
                        await this.customerLoyaltyService.refundPoints(
                            appointment.id_user,
                            pointsToReverse,
                            "Rollback por fallo en pago"
                        );
                    } else {
                        await this.customerLoyaltyService.redeem(
                            appointment.id_user,
                            pointsToReverse,
                            "Rollback por fallo en pago"
                        );
                    }
                } catch (rollbackError) {
                    console.error("Error al revertir puntos por fallo en pago:", rollbackError);
                }
            }

            try {
                await this.appointmentsRepository.cancelAndReversePayment(payment.id_appointment);
            } catch (cancelError) {
                console.error("Error al cancelar cita por fallo en pago:", cancelError);
            }

            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error al crear el pago: ' + (error instanceof Error ? error.message : 'Error desconocido'));
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