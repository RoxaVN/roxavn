import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { Asset } from '../entities/asset.entity.js';

@serverModule.injectable()
export class CreateAssetService extends InjectDatabaseService {
  async handle(request: {
    userId: string;
    storeId: string;
    unitId?: string;
    unitcount?: number;
  }) {
    const asset = new Asset();
    Object.assign(asset, request);

    await this.entityManager.save(asset);
    return { id: asset.id };
  }
}
