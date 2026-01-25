export interface Notification {
    id: number;
    id_user: number;
    title: string;
    message: string;
    is_read: boolean;
}

export interface NotificationCreate {
    id_user: number;
    title: string;
    message: string;
}