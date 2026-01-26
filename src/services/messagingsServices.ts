import { MessagingsRepository } from "../repositories/messagingsRepository";
import { Messaging, MessagingCreate, MessagingUpdate } from "../models/Messagings";

export class MessagingsServices {
    private messagingsRepository: MessagingsRepository;

    constructor() {
        this.messagingsRepository = new MessagingsRepository();
    }

    async findAllBySender(sender_id: number): Promise<Messaging[]> {
        const messaging = await this.messagingsRepository.findAllBySender(sender_id);
        if(!messaging) {
            throw new Error('Mensajes enviados no encontrados')
        }

        return messaging;
    }

    async findAllBySenderDeleted(sender_id: number): Promise<Messaging[]> {
        const messaging = await this.messagingsRepository.findAllBySenderDeleted(sender_id);
        if(!messaging) {
            throw new Error('Mensajes eliminados no encontrados')
        }

        return messaging;
    }

    async findAllByReceiver(receiver_id: number): Promise<Messaging[]> {
        const messaging = await this.messagingsRepository.findAllByReceiver(receiver_id);
        if(!messaging) {
            throw new Error('Mensajes recibidos no encontrados')
        }

        return messaging;
    }

    async findAllByReceiverDeleted(receiver_id: number): Promise<Messaging[]> {
        const messaging = await this.messagingsRepository.findAllByReceiverDeleted(receiver_id);
        if(!messaging) {
            throw new Error('Mensajes eliminados no encontrados')
        }

        return messaging;
    }

    async create(messaging: MessagingCreate): Promise<Messaging> {
        try {
            return await this.messagingsRepository.create(messaging);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
              }
              throw new Error("Error al enviar el mensaje: " + (error instanceof Error ? error.message : "Error desconocido"));
        }
    }

    async update(id: number, messaging: MessagingUpdate): Promise<Messaging> {
        try {
            const messagingUpdate = await this.messagingsRepository.update(id, messaging);
            if(!messagingUpdate) {
                throw new Error('Error al actualizar el mensaje');
            }

            return messagingUpdate;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error("Error desconocido al actualizar");
        }
    }
}