import { CredentialsRepository } from '../repositories/credentialsRepository';
import { Credential, CredentialCreate, CredentialUpdate, LoginRequest, LoginResponse } from '../models/Credentials';
import { User } from '../models/Users';
import { UsersRepository } from '../repositories/usersRepository';

export class CredentialsService {
    private credentialsRepository: CredentialsRepository;
    private usersRepository: UsersRepository;

    constructor() {
        this.credentialsRepository = new CredentialsRepository();
        this.usersRepository = new UsersRepository();
    }

    generatePassword(names: string, last_names: string | undefined, identification: string | undefined): string {
        const firstNames = names.trim().split(/\s+/);
        const firstName = firstNames[0] || '';
        
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        
        let firstLastName = '';
        if (last_names && last_names.trim()) {
            const lastNamesArray = last_names.trim().split(/\s+/);
            firstLastName = lastNamesArray[0].toLowerCase();
        }
        
        let lastThreeDigits = '';
        if (identification && identification.trim()) {
            const cleanId = identification.trim().replace(/\D/g, '');
            lastThreeDigits = cleanId.slice(-3);
        }
        
        return `${capitalizedFirstName}${firstLastName}.${lastThreeDigits}`;
    }

    generateUsername(identification: string | undefined): string {
        if (!identification || !identification.trim()) {
            throw new Error('La identificación es requerida para generar el username');
        }
        return identification.trim();
    }

    async createCredentialsForUser(user: User): Promise<{ credential: Credential; password: string }> {
        try {
            const existingCredentials = await this.credentialsRepository.findByIdUser(user.id);
            if (existingCredentials) {
                throw new Error('El usuario ya tiene credenciales');
            }

            const username = this.generateUsername(user.identification);
            
            // Verificar que el username no esté en uso
            const existingByUsername = await this.credentialsRepository.findByUsername(username);
            if (existingByUsername) {
                throw new Error('El username ya está en uso');
            }

            const password = this.generatePassword(user.names, user.last_names, user.identification);

            // Crear credenciales
            const credentialData: CredentialCreate = {
                id_user: user.id,
                username: username,
                password: password,
                id_state: user.id_state || 1, // Usar el mismo estado que el usuario
            };

            const credential = await this.credentialsRepository.create(credentialData);
            
            return { credential, password };
        } catch (error) {
            if (error instanceof Error && (
                error.message === 'El usuario ya tiene credenciales' ||
                error.message === 'El username ya está en uso' ||
                error.message === 'La identificación es requerida para generar el username'
            )) {
                throw error;
            }
            throw new Error('Error al crear las credenciales: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    async login(loginRequest: LoginRequest): Promise<LoginResponse> {
        try {
            const credential = await this.credentialsRepository.login(
                loginRequest.username,
                loginRequest.password
            );

            if (!credential) {
                return {
                    success: false,
                    message: 'Usuario o contraseña incorrectos',
                };
            }

            const user = await this.usersRepository.findById(credential.id_user);
            if (!user) {
                return {
                    success: false,
                    message: 'Usuario no encontrado',
                };
            }

            if (credential.id_state !== 1) {
                return {
                    success: false,
                    message: 'Las credenciales están desactivadas',
                };
            }

            return {
                success: true,
                message: 'Inicio de sesión exitoso',
                user: {
                    id: credential.id,
                    username: credential.username,
                    id_user: credential.id_user,
                    names: credential.user_names,
                    last_names: credential.user_last_names,
                    full_name: `${credential.user_names} ${credential.user_last_names ?? ''}`.trim(),
                    id_role: credential.id_role,
                    email: user.email,
                    phone: user.phone,
                },
            };
        } catch (error) {
            throw new Error('Error al iniciar sesión: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    async updateCredentials(id: number, credential: CredentialUpdate): Promise<Credential> {
        try {
            const existingCredential = await this.credentialsRepository.findById(id);
            if (!existingCredential) {
                throw new Error('Credenciales no encontradas');
            }

            if (credential.username !== undefined && credential.username !== existingCredential.username) {
                const existingByUsername = await this.credentialsRepository.findByUsername(credential.username);
                if (existingByUsername && existingByUsername.id !== id) {
                    throw new Error('El username ya está en uso');
                }
            }

            const updatedCredential = await this.credentialsRepository.update(id, credential);
            if (!updatedCredential) {
                throw new Error('Error al actualizar las credenciales');
            }
            return updatedCredential;
        } catch (error) {
            if (error instanceof Error && (
                error.message === 'Credenciales no encontradas' ||
                error.message === 'El username ya está en uso'
            )) {
                throw error;
            }
            throw new Error('Error al actualizar las credenciales: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    async deleteCredentials(id: number): Promise<void> {
        const existingCredential = await this.credentialsRepository.findById(id);
        if (!existingCredential) {
            throw new Error('Credenciales no encontradas');
        }
        const deleted = await this.credentialsRepository.delete(id);
        if (!deleted) {
            throw new Error('Error al eliminar las credenciales');
        }
    }

    async deleteCredentialsByUserId(id_user: number): Promise<void> {
        await this.credentialsRepository.deleteByIdUser(id_user);
    }
}

