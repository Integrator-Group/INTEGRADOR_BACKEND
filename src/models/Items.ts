export interface Item {
    id: number;
    name: string;
    description: string;
    id_state: number;
    name_state?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface ItemCreate {
    name: string;
    description: string;
    id_state: number;
}

export interface ItemUpdate {
    name?: string;
    description?: string;
    id_state?: number;
}