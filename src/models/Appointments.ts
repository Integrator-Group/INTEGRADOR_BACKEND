export interface Appointment {
    id: number;
    id_user: number;
    user_names: string;
    user_last_names: string;
    id_professional: number;
    pro_names: string;
    pro_last_names: string;
    id_branch: number;
    branch_name: string;
    id_service: number;
    service_name: string;
    id_schedule: number;
    start_time: Date;
    end_time: Date;
    id_state_appointment: number;
    state_name: string;
    feedback: string;
    grade: number;
}