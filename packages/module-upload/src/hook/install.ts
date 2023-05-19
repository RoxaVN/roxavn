import { BaseService, hookManager } from '@roxavn/core/server';

import { roles } from '../base/index.js';

export class InstallHook extends BaseService {
  async handle() {
    await this.create(hookManager.createRoleService).handle(roles);
    await this.create(hookManager.setAdminRoleService).handle(roles.Admin);
  }
}
