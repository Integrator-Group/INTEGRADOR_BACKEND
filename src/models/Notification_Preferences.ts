export interface NotificationPreference {
    id: number;
    id_user: number;
    email_enable: boolean;
    whatsapp_enable: boolean;
    id_state: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface NotificationPreferenceCreate {
    email_enable: boolean;
    whatsapp_enable: boolean;
    id_state: number;
}

export interface NotificationPreferenceUpdate {
    email_enable?: boolean;
    whatsapp_enable?: boolean;
}