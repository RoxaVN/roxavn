import { deleteUserRoleApi } from '../../base';
import { UserRole } from '../entities';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';
import { serverModule } from '../module';

@serverModule.useApi(deleteUserRoleApi)
export class DeleteUserRoleApiService extends AuthApiService<
  typeof deleteUserRoleApi
> {
  async handle(request: InferAuthApiRequest<typeof deleteUserRoleApi>) {
    await this.dbSession.getRepository(UserRole).delete({
      resourceId: request.resourceId || '',
      ownerId: request.id,
      roleId: request.roleId,
    });
  }
}
