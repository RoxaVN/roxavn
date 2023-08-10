import { constants, roles } from '../base/index.js';
import { serverModule, Token } from '../server/index.js';
import { UtilsInstallHook } from './base.js';

@serverModule.injectable()
export class InstallHook extends UtilsInstallHook {
  async handle() {
    await this.createRoleService.handle(roles);
    await this.setAdminRoleService.handle(roles.Admin);

    const secret = await Token.create();
    await this.createSettingService.handle({
      module: serverModule.name,
      name: constants.TOKEN_SETTING,
      type: 'private',
      metadata: {
        signSecret: secret,
        signAlgorithm: 'sha256',
        saltRounds: 10,
      },
    });
  }
}
