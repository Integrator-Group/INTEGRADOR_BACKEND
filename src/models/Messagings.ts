export interface Messaging {
    id: number;
    sender_id: number;
    receiver_id: number;
    subject: string;
    body: string;
    attachment_path?: string | null;
    image_path?: string | null;
    sent_date: Date;
    deleted_by_sender?: boolean;
    deleted_by_receiver?: boolean;
}

export interface MessagingCreate {
    sender_id: number;
    receiver_id: number;
    subject: string;
    body: string;
    attachment_path?: string;
    image_path?: string;
}

export interface MessagingUpdate {
    deleted_by_sender?: boolean;
    deleted_by_receiver?: boolean;
}