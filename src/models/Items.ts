export interface Item {
    id: number;
    name: string;
    description: string;
    id_state: number;
    name_state?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    price: number;
    points_price: number;
}

export interface ItemCreate {
    name: string;
    description: string;
    id_state: number;
    price: number;
    points_price: number;
}

export interface ItemUpdate {
    name?: string;
    description?: string;
    id_state?: number;
    price?: number;
    points_price?: number;
}