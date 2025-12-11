export interface Specialtie {
    id: number;
    id_branch: number;
    name_branch?: string;
    id_area: number;
    name_area?: string;
    name: string;
    id_state: number;
    name_state?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface SpecialtieCreate {
    id_branch: number;
    id_area: number;
    name: string;
    id_state: number;
}

export interface SpecialtieUpdate {
    id_branch?: number;
    id_area?: number;
    name?: string;
    id_state?: number;
}