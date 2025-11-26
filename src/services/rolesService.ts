import { RolesRepository } from '../repositories/rolesRepository';
import { Role, RoleCreate, RoleUpdate } from '../models/Roles';

export class RolesService {
  private readonly rolesRepository: RolesRepository;

  constructor() {
    this.rolesRepository = new RolesRepository();
  }

  async getAllRoles(): Promise<Role[]> {
    return this.rolesRepository.findAll();
  }

  async getRoleById(id: number): Promise<Role> {
    const role = await this.rolesRepository.findById(id);
    if (!role) {
      throw new Error('Rol no encontrado');
    }
    return role;
  }

  async createRole(roleData: RoleCreate): Promise<Role> {
    try {
      const existingRole = await this.rolesRepository.findByName(roleData.name);
      if (existingRole) {
        throw new Error('El nombre del rol ya existe');
      }
      return await this.rolesRepository.create(roleData);
    } catch (error) {
      if (error instanceof Error && error.message === 'El nombre del rol ya existe') {
        throw error;
      }
      throw new Error('Error al crear el rol: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }

  async updateRole(id: number, roleData: RoleUpdate): Promise<Role> {
    try {
      const role = await this.rolesRepository.findById(id);
      if (!role) {
        throw new Error('Rol no encontrado');
      }

      if (roleData.name && roleData.name !== role.name) {
        const repeatedRole = await this.rolesRepository.findByName(roleData.name);
        if (repeatedRole) {
          throw new Error('El nombre del rol ya existe');
        }
      }

      const updatedRole = await this.rolesRepository.update(id, roleData);
      if (!updatedRole) {
        throw new Error('Error al actualizar el rol');
      }
      return updatedRole;
    } catch (error) {
      if (error instanceof Error && (error.message === 'Rol no encontrado' || error.message === 'El nombre del rol ya existe')) {
        throw error;
      }
      throw new Error('Error al actualizar el rol: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.rolesRepository.findById(id);
    if (!role) {
      throw new Error('Rol no encontrado');
    }
    await this.rolesRepository.delete(id);
  }
}

