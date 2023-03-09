import { BaseService, hookManager } from '@roxavn/core/server';
import { roles } from '../base';
import { CreateAdminUserHook } from './database';

export class InstallHook extends BaseService {
  async handle() {
    await this.create(hookManager.createRoleService).handle(roles);
    await this.create(CreateAdminUserHook).handle(null);
  }
}
