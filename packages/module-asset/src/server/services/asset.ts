import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { Asset } from '../entities/asset.entity.js';

@serverModule.injectable()
export class CreateAssetService extends InjectDatabaseService {
  async handle(request: { userId: string; storeId: string }) {
    const asset = new Asset();
    asset.userId = request.userId;
    asset.storeId = request.storeId;

    await this.entityManager.save(asset);
    return { id: asset.id };
  }
}
