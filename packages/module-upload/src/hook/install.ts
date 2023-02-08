import { BaseService } from '@roxavn/core/server';
import { CreateRolesHook, SetAdminRoleHook } from '@roxavn/module-user/hook';

import { Roles } from '../base';

export class InstallHook extends BaseService {
  async handle() {
    await this.create(CreateRolesHook).handle(Roles);
    await this.create(SetAdminRoleHook).handle(Roles.Admin);
  }
}
