export interface Branch {
    id: number;
    id_company: number;
    company_name?: string;
    name: string;
    phone: string;
    address: string;
    email: string;
    id_manager?: number;
    manager_names?: string;
    manager_last_names?: string;
    id_province: number;
    province_name?: string;
    id_canton: number;
    canton_name?: string;
    id_state: number;
    state_name?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
}

export interface BranchCreate {
    id_company: number;
    name: string;
    phone: string;
    address: string;
    email: string;
    id_province: number;
    id_canton: number;
    id_state: number;
}

export interface BranchUpdate {
    id_manager?: number;
    name?: string;
    phone?: string;
    address?: string;
    email?: string;
    id_province?: number;
    id_canton?: number;
    id_state?: number;
}