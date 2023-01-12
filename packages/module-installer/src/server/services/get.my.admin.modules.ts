import { appConfig } from '@roxavn/core/server';
import {
  AuthApiService,
  GetUserRolesApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';

import { getMyAdminModulesApi } from '../../share';
import { serverModule } from '../module';

@serverModule.useApi(getMyAdminModulesApi)
export class GetMyAdminModulesApiService extends AuthApiService<
  typeof getMyAdminModulesApi
> {
  async handle(request: InferAuthApiRequest<typeof getMyAdminModulesApi>) {
    const service = this.create(GetUserRolesApiService);
    const result = await service.handle({
      userId: request.user.id,
      scopes: Object.keys(appConfig.data.modules).map((m) =>
        m === '.' ? appConfig.currentModule : m
      ),
    });
    return { items: result.items.map((i) => ({ name: i.scope })) };
  }
}
