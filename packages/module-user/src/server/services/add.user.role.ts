import { addUserRoleApi } from '../../base';
import { UserRole } from '../entities';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';
import { serverModule } from '../module';

@serverModule.useApi(addUserRoleApi)
export class AddUserRoleApiService extends AuthApiService<
  typeof addUserRoleApi
> {
  async handle(request: InferAuthApiRequest<typeof addUserRoleApi>) {
    const userRole = new UserRole();
    userRole.ownerId = request.id;
    userRole.roleId = request.roleId;
    if (request.resourceId) {
      userRole.resourceId = request.resourceId;
    }
    await this.dbSession.save(userRole);
  }
}
