import { NotificationsRepository } from "../repositories/notificationsRepository";
import { Notification, NotificationCreate } from "../models/Notifications";

export class NotificationsServices {
    private notificationsRepository: NotificationsRepository;

    constructor() {
        this.notificationsRepository = new NotificationsRepository();
    }

    async getAllNotificationsByUser(id_user: number): Promise<Notification[]> {
        const user = await this.notificationsRepository.findAllByUser(id_user);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        return user;
    }

    async createNotification(notification: NotificationCreate): Promise<Notification> {
        try {
            return await this.notificationsRepository.create(notification);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
              }
              throw new Error("Error al crear la notificación: " + (error instanceof Error ? error.message : "Error desconocido"));
        }
    }

    async updateNotification(id: number): Promise<Notification> {
        try {
            return await this.notificationsRepository.update(id);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Error desconocido";
            throw new Error("Error al actualizar la notificación: " + msg);
        }
    }      
}