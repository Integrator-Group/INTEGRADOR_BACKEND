import { NotificationPreferenceRepository } from "../repositories/notificationPreferencesRepository";
import { NotificationPreference, NotificationPreferenceCreate, NotificationPreferenceUpdate } from '../models/Notification_Preferences';

export class NotifcationPreferencesService {
    private notificationPreferenceRepository: NotificationPreferenceRepository;

    constructor() {
        this.notificationPreferenceRepository = new NotificationPreferenceRepository();
    }

    async getPreferencesByUser(id_user: number): Promise<NotificationPreference> {
        const preferences = await this.notificationPreferenceRepository.findPreferenceByUser(id_user);
        if (!preferences) {
            throw new Error('No se encontraron preferencias')
        }
        return preferences;
    }

    async savePreferences(id_user: number, create: NotificationPreferenceCreate, update: NotificationPreferenceUpdate): Promise<NotificationPreference> {
        try {
            return await this.notificationPreferenceRepository.savePreferences(id_user, create, update);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
              }
              throw new Error("Error al guardar la preferencia: " + (error instanceof Error ? error.message : "Error desconocido"));
        }
    }
}