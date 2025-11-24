export interface AppointmentState {
    id?: number;
    name: string;
    id_state: number;
    state_name?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface AppointmentStateCreate {
    name: string;
    id_state: number;
}

export interface AppointmentStateUpdate {
    name?: string;
    id_state?: number;
}