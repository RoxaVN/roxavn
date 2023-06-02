import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import {
  BaseService,
  moduleManager,
  serviceContainer,
} from '@roxavn/core/server';

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

@serverModule.useApi(moduleApi.runInstallHook)
export class RunInstallHookApiService extends BaseService {
  async handle({
    moduleName,
  }: InferApiRequest<typeof moduleApi.runInstallHook>) {
    if (moduleManager.modules.find((m) => m.name === moduleName)) {
      const moduleHook = await import(moduleName + '/hook');
      const installHook: any = await serviceContainer.getAsync(
        moduleHook.InstallHook
      );
      await installHook.handle();
      return {};
    }
    throw new NotFoundException();
  }
}
