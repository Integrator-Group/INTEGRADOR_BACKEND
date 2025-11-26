export interface Role {
    id?: number;
    name: string;
    id_state: number;
    state_name?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface RoleCreate {
    name: string;
    id_state: number;
}

export interface RoleUpdate {
    name?: string;
    id_state?: number;
}