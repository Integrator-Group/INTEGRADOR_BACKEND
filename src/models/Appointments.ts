export interface Appointment {
    id: number;
    seq_val: string;
    id_user: number;
    user_names: string;
    user_last_names: string;
    user_email: string;
    id_professional: number;
    pro_names: string;
    pro_last_names: string;
    id_branch: number;
    branch_name: string;
    id_service: number;
    service_name: string;
    id_schedule: number;
    start_time: string;
    end_time: string;
    id_state_appointment: number;
    state_name: string;
    schedule_date: Date;
}

export interface AppointmentCreate {
    seq_val: string;
    id_user: number;
    id_professional: number;
    id_branch: number;
    id_service: number;
    id_schedule: number;
    id_state_appointment?: number;
    start_time: string;
    end_time: string;
    schedule_date: Date;
}

export interface AppointmentUpdate {
    id_branch?: number;
    id_schedule?: number;
    start_time?: string;
    end_time?: string;
    id_state_appointment?: number;
    schedule_date?: Date;
}