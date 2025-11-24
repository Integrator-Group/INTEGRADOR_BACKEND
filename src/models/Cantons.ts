export interface Canton {
    id?: number;
    name: string;
    id_province: number;
    id_state: number;
    state_name?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface CantonCreate {
    name: string;
    id_province: number;
    id_state: number;
}

export interface CantonUpdate {
    name?: string;
    id_province?: number;
    id_state?: number;
}

