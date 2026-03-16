import { InventoryRepository } from '../repositories/inventoryRepository';
import { Inventory, InventoryCreate, InventoryUpdate } from '../models/Inventory';

export class InventoryService {
    private readonly inventoryRepository: InventoryRepository;

    constructor() {
        this.inventoryRepository = new InventoryRepository();
    }

    async getAllInventory(): Promise<Inventory[]> {
        return await this.inventoryRepository.findAll();
    }

    async getInventoryById(id: number): Promise<Inventory> {
        const inventory = await this.inventoryRepository.findById(id);
        if (!inventory) {
            throw new Error('Inventario no encontrado');
        }
        return inventory;
    }

    async getInventoryByBranch(id_branch: number): Promise<Inventory[]> {
        return await this.inventoryRepository.findByBranch(id_branch);
    }

    async getInventoryByBranchAndName(id_branch: number, name: string): Promise<Inventory[]> {
        return await this.inventoryRepository.findByBranchAndName(id_branch, name);
    }

    async createInventory(data: InventoryCreate): Promise<Inventory> {
        try {
            const exists = await this.inventoryRepository.findByItemAndBranch(data.id_item, data.id_branch);
            if (exists) {
                throw new Error('Ya existe un registro de inventario para este item en esta sucursal');
            }
            return await this.inventoryRepository.create(data);
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error('Error al crear el inventario');
        }
    }

    async updateInventory(id: number, data: InventoryUpdate): Promise<Inventory> {
        try {
            const inventory = await this.inventoryRepository.findById(id);
            if (!inventory) {
                throw new Error('Inventario no encontrado');
            }

            const updated = await this.inventoryRepository.update(id, data);
            if (!updated) {
                throw new Error('Error al actualizar el inventario');
            }
            return updated;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error('Error desconocido al actualizar');
        }
    }

    async deleteInventory(id: number): Promise<void> {
        const inventory = await this.inventoryRepository.findById(id);
        if (!inventory) {
            throw new Error('Inventario no encontrado');
        }
        await this.inventoryRepository.delete(id);
    }
}
