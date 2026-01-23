export interface Payment {
    id: number;
    id_appointment: number;
    amount: number;
    id_method: number;
    id_status_payment: number;
    paid_at: Date;
}

export interface PaymentCreate {
    id_appointment: number;
    amount: number;
    id_method: number;
    id_status_payment: number;
    paid_at?: Date;
}

export interface PaymentUpdate {
    id_status_payment?: number;
    paid_at?: Date;
}