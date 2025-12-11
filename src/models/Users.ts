export interface User {
    id: number;
    names: string;
    last_names: string;
    identification: string;
    email: string;
    phone: string;
    profile_photo: string;
    id_branch?: number;
    name_branch?: string;
    id_role: number;
    name_role?: string;
    id_province: number;
    name_province?: string;
    id_canton: number;
    name_canton?: string;
    id_area?: number;
    name_area?: string;
    id_speciality?: number;
    name_speciality?: string;
    id_state: number;
    name_state?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface UserCreate {
    names: string;
    last_names?: string;
    identification?: string;
    email?: string;
    phone?: string;
    profile_photo?: string;
    id_branch?: number;
    id_role: number;
    id_province?: number;
    id_canton?: number;
    id_area?: number;
    id_speciality?: number;
    id_state: number;
}

export interface UserUpdate {
    names?: string;
    last_names?: string;
    identification?: string;
    email?: string;
    phone?: string;
    profile_photo?: string;
    id_branch?: number;
    id_role?: number;
    id_province?: number;
    id_canton?: number;
    id_area?: number;
    id_speciality?: number;
    id_state?: number;
}