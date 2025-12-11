import { ItemsRepository } from "../repositories/itemsRepository";
import { Item, ItemCreate, ItemUpdate } from "../models/Items";

export class ItemsServices {
    private itemsRepository: ItemsRepository;

    constructor() {
        this.itemsRepository = new ItemsRepository();
    }

    async getAllItems(): Promise<Item[]> {
        return await this.itemsRepository.findAll();
    }

    async createItem(item: ItemCreate): Promise<Item> {
        try {
            const nameExists = await this.itemsRepository.findByName(item.name);
            if (nameExists) {
                throw new Error('El item ya se encuentra registrado');
            }

            return await this.itemsRepository.create(item);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
              }
              throw new Error("Error al crear el item: " + (error instanceof Error ? error.message : "Error desconocido"));
        }
    }

    async updateItem(id: number, item: ItemUpdate): Promise<Item> {
        try {
            const itemExists = await this.itemsRepository.findItemById(id);
            if(!itemExists) {
                throw new Error('Item no encontrado');
            }

            if(item.name) {
                const nameExists = await this.itemsRepository.findByName(item.name);
                if (nameExists && nameExists.id !== id) {
                    throw new Error('El item ya existe');
                }
            }

            const itemUpdated = await this.itemsRepository.update(id, item);
            if (!itemUpdated) {
                throw new Error('Error al actualizar el item');
            }

            return itemUpdated;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error("Error desconocido al actualizar");
        }
    }

    async deleteItem(id: number): Promise<void> {
        const itemExists = await this.itemsRepository.findItemById(id);
        if (!itemExists) {
            throw new Error('Item no encontrado')
        }

        await this.itemsRepository.delete(id);
    }
}