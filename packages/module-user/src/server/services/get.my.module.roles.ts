import { moduleManager } from '@roxavn/core/server';
import { getMyModuleRolesApi } from '../../base';
import { AuthApiService, InferAuthApiRequest } from '../middlerware';
import { serverModule } from '../module';
import { GetUserRolesApiService } from './get.user.roles';

@serverModule.useApi(getMyModuleRolesApi)
export class GetMyModuleRolesApiService extends AuthApiService<
  typeof getMyModuleRolesApi
> {
  async handle(request: InferAuthApiRequest<typeof getMyModuleRolesApi>) {
    const service = this.create(GetUserRolesApiService);
    const result = await service.handle({
      id: request.$user.id,
      resources: moduleManager.modules.map((m) => m.name),
    });
    return result;
  }
}
