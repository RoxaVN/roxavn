import {
  BaseService,
  CreateRoleService,
  SetAdminRoleService,
  inject,
} from '@roxavn/core/server';

import { CreateSettingService, serverModule } from '../server/index.js';

@serverModule.injectable()
export abstract class UtilsInstallHook extends BaseService {
  constructor(
    @inject(CreateRoleService)
    protected createRoleService: CreateRoleService,
    @inject(SetAdminRoleService)
    protected setAdminRoleService: SetAdminRoleService,
    @inject(CreateSettingService)
    protected createSettingService: CreateSettingService
  ) {
    super();
  }
}
