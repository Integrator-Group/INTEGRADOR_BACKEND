export interface Inventory {
    id: number;
    id_item: number;
    item_name?: string;
    id_branch: number;
    branch_name?: string;
    quantity: number;
    min_stock: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface InventoryCreate {
    id_item: number;
    id_branch: number;
    quantity: number;
    min_stock: number;
}

export interface InventoryUpdate {
    quantity?: number;
    min_stock?: number;
}
