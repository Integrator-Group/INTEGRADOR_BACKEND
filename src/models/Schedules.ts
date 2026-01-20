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