import { InferApiRequest } from '@roxavn/core/base';
import { BaseService } from '@roxavn/core/server';

import { storeAssetApi } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(storeAssetApi.getMany)
export class storeAssetApiService extends BaseService {
  async handle(request: InferApiRequest<typeof storeAssetApi.getMany>) {
    return request as any;
  }
}
