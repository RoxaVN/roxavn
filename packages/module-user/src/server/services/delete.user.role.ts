import {
  AuthApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';

import { deleteUserRoleApi } from '../../share';
import { UserRole } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(deleteUserRoleApi)
export class DeleteUserRoleApiService extends AuthApiService<
  typeof deleteUserRoleApi
> {
  async handle(request: InferAuthApiRequest<typeof deleteUserRoleApi>) {
    await this.dbSession.getRepository(UserRole).delete({
      scopeId: request.scopeId,
      ownerId: request.id,
      roleId: request.roleId,
    });
  }
}
