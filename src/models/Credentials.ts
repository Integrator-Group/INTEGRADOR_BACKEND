export interface Credential {
    id: number;
    id_user: number;
    user_names: string;
    user_last_names: string;
    id_role: number;
    username: string;
    password: string;
    id_state: number;
    name_state?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface CredentialCreate {
    id_user: number;
    username: string;
    password: string;
    id_state: number;
}

export interface CredentialUpdate {
    username?: string;
    password?: string;
    id_state?: number;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user?: {
        id: number;
        username: string;
        id_user: number;
        names: string;
        last_names: string;
        full_name: string;
        id_role: number;
        email?: string;
        phone?: string;
        loyalty?: {
            points: number;
        };
    };
}