import { InferApiRequest } from '@roxavn/core/base';
import { BaseService, moduleManager } from '@roxavn/core/server';

import { moduleApi } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(moduleApi.getMany)
export class GetModulesApiService extends BaseService {
  async handle(request: InferApiRequest<typeof moduleApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 20;
    const start = (page - 1) * pageSize;

    return {
      items: moduleManager.modules.slice(start, start + pageSize),
      pagination: { page, pageSize, totalItems: moduleManager.modules.length },
    };
  }
}
