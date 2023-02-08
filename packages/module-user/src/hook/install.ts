import { BaseService } from '@roxavn/core/server';
import { Roles } from '../base';
import { CreateRolesHook, CreateAdminUserHook } from './database';

export class InstallHook extends BaseService {
  async handle() {
    await this.create(CreateRolesHook).handle(Roles);
    await this.create(CreateAdminUserHook).handle(null);
  }
}
