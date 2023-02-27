import { BaseService } from '@roxavn/core/server';
import { roles } from '../base';
import { CreateRolesHook, CreateAdminUserHook } from './database';

export class InstallHook extends BaseService {
  async handle() {
    await this.create(CreateRolesHook).handle(roles);
    await this.create(CreateAdminUserHook).handle(null);
  }
}
