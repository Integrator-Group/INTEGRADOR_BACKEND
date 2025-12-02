export interface Credential {
    id: number;
    id_user: number;
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
    };
}