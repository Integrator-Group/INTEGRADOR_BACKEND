import { UsersRepository } from '../repositories/usersRepository';
import { User, UserCreate, UserUpdate } from '../models/Users';
import { CredentialsService } from './credentialsService';

export class UsersService {
    private usersRepository: UsersRepository;
    private credentialsService: CredentialsService;

    constructor() {
        this.usersRepository = new UsersRepository();
        this.credentialsService = new CredentialsService();
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    }

    async createUser(user: UserCreate): Promise<User> {
        try {
            if (user.identification) {
                const existingByIdentification = await this.usersRepository.findByIdentification(user.identification);
                if (existingByIdentification) {
                    throw new Error('La identificación ya está registrada');
                }
            }

            if (user.email) {
                const existingByEmail = await this.usersRepository.findByEmail(user.email);
                if (existingByEmail) {
                    throw new Error('El email ya está registrado');
                }
            }

            if (user.phone) {
                const existingByPhone = await this.usersRepository.findByPhone(user.phone);
                if (existingByPhone) {
                    throw new Error('El teléfono ya está registrado');
                }
            }

            if (!user.identification) {
                throw new Error('La identificación es requerida para crear las credenciales');
            }

            const newUser = await this.usersRepository.create(user);

            try {
                await this.credentialsService.createCredentialsForUser(newUser);
            } catch (credentialError) {
                await this.usersRepository.delete(newUser.id);
                throw new Error('Error al crear las credenciales: ' + (credentialError instanceof Error ? credentialError.message : 'Error desconocido'));
            }

            return newUser;
        } catch (error) {
            if (error instanceof Error && (
                error.message === 'La identificación ya está registrada' ||
                error.message === 'El email ya está registrado' ||
                error.message === 'El teléfono ya está registrado'
            )) {
                throw error;
            }
            throw new Error('Error al crear el usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    async updateUser(id: number, user: UserUpdate): Promise<User> {
        try {
            const existingUser = await this.usersRepository.findById(id);
            if (!existingUser) {
                throw new Error('Usuario no encontrado');
            }

            if (user.identification !== undefined) {
                const existingByIdentification = await this.usersRepository.findByIdentification(user.identification, id);
                if (existingByIdentification) {
                    throw new Error('La identificación ya está registrada');
                }
            }

            if (user.email !== undefined) {
                const existingByEmail = await this.usersRepository.findByEmail(user.email, id);
                if (existingByEmail) {
                    throw new Error('El email ya está registrado');
                }
            }

            if (user.phone !== undefined) {
                const existingByPhone = await this.usersRepository.findByPhone(user.phone, id);
                if (existingByPhone) {
                    throw new Error('El teléfono ya está registrado');
                }
            }

            const updatedUser = await this.usersRepository.update(id, user);
            if (!updatedUser) {
                throw new Error('Error al actualizar el usuario');
            }
            return updatedUser;
        } catch (error) {
            if (error instanceof Error && (
                error.message === 'Usuario no encontrado' ||
                error.message === 'La identificación ya está registrada' ||
                error.message === 'El email ya está registrado' ||
                error.message === 'El teléfono ya está registrado'
            )) {
                throw error;
            }
            throw new Error('Error al actualizar el usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }

    async deleteUser(id: number): Promise<void> {
        const existingUser = await this.usersRepository.findById(id);
        if (!existingUser) {
            throw new Error('Usuario no encontrado');
        }
        
        try {
            await this.credentialsService.deleteCredentialsByUserId(id);
        } catch (error) {
        }
        
        const deleted = await this.usersRepository.delete(id);
        if (!deleted) {
            throw new Error('Error al eliminar el usuario');
        }
    }

    async getUsersByRole(id_role: number): Promise<User[]> {
        return await this.usersRepository.findUserByRol(id_role);
    }
}