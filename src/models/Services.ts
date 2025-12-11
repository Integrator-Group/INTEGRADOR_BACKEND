export interface Service {
    id: number;
    id_branch: number;
    name_branch?: string;
    id_area: number;
    name_area?: string;
    name: string;
    description: string;
    duration_min: number;
    price: number;
    id_state: number;
    name_state?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface ServiceCreate {
    id_branch: number;
    id_area: number;
    name: string;
    description: string;
    duration_min: number;
    price: number;
    id_state: number;
}

export interface ServiceUpdate {
    id_branch?: number;
    id_area?: number;
    name?: string;
    description?: string;
    duration_min?: number;
    price?: number;
    id_state?: number;
}