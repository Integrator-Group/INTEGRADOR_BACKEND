export interface PaymentStatus {
    id?: number;
    name: string;
    id_state: number;
    state_name?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface PaymentStatusCreate {
    name: string;
    id_state: number;
}

export interface PaymentStatusUpdate {
    name?: string;
    id_state?: number;
}

