export interface Area {
    id: number;
    id_branch: number;
    branch_name?: string;
    name: string;
    id_state: number;
    state_name?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export interface AreaCreate {
    id_branch: number;
    name: string;
    id_state: number;
}

export interface AreaUpdate {
    id_branch?: number;
    name?: string;
    id_state?: number;
}