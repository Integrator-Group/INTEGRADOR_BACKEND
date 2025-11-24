export interface PaymentMethod {
    id?: number;
    name: string;
    id_state: number;
    state_name?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface PaymentMethodCreate {
    name: string;
    id_state: number;
}

export interface PaymentMethodUpdate {
    name?: string;
    id_state?: number;
}