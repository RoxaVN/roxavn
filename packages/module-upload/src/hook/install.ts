import { BaseService } from '@roxavn/core/server';
import { CreateRolesHook, SetAdminRoleHook } from '@roxavn/module-user/hook';

import { roles } from '../base';

export class InstallHook extends BaseService {
  async handle() {
    await this.create(CreateRolesHook).handle(roles);
    await this.create(SetAdminRoleHook).handle(roles.Admin);
  }
}
