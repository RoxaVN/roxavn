import { addUserRoleApi } from '../../share';
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
    if (request.scopeId) {
      userRole.scopeId = request.scopeId;
    }
    await this.dbSession.save(userRole);
  }
}
