export interface Province {
    id?: number;
    name: string;
    id_state: number;
    state_name?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface ProvinceCreate {
    name: string;
    id_state: number;
}

export interface ProvinceUpdate {
    name?: string;
    id_state?: number;
}

