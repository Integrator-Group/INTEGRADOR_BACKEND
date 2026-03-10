export interface Schedule {
    id: number;
    id_user: number;
    id_branch: number;
    day: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface ScheduleCreate {
    id_user?: number;
    id_branch?: number;
    day: string;
    start_time: string;
    end_time: string;
    is_available?: boolean;
}

export interface ScheduleUpdate {
    id_user?: number;
    id_branch?: number;
    day?: string;
    start_time?: string;
    end_time?: string;
    is_available?: boolean;
}

export interface ScheduleAppointment {
    id: number;
    seq_val: string;
    start_time: string;
    end_time: string;
    state_name: string;
    id_state_appointment: number;
}

export interface ScheduleWithAppointments extends Schedule {
    user_names?: string;
    user_last_names?: string;
    name_branch?: string;
    name_area?: string;
    appointments: ScheduleAppointment[];
}