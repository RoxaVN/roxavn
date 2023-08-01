import { BadRequestException, NotFoundException } from '@roxavn/core';
import {
  BaseService,
  DatabaseService,
  InjectDatabaseService,
  inject,
} from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { Asset } from '../entities/asset.entity.js';
import { CloneAssetAttributesService } from './asset.attribute.js';

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

@serverModule.injectable()
export class UpdateAssetService extends InjectDatabaseService {
  async handle(request: {
    assetId: string;
    userId?: string;
    storeId?: string;
    unitcount?: number;
    metadata?: Record<string, any>;
  }) {
    await this.entityManager.getRepository(Asset).update(
      { id: request.assetId },
      {
        userId: request.userId,
        storeId: request.storeId,
        unitCount: request.unitcount,
        metadata: request.metadata,
      }
    );
    return {};
  }
}

@serverModule.injectable()
export class SplitAssetService extends BaseService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
    @inject(CloneAssetAttributesService)
    private cloneAssetAttributesService: CloneAssetAttributesService
  ) {
    super();
  }

  async handle(request: { assetId: string; splitAmount: number }) {
    const asset = await this.databaseService.manager
      .getRepository(Asset)
      .findOne({
        lock: { mode: 'pessimistic_write' },
        where: { id: request.assetId },
      });
    if (!asset) {
      throw new NotFoundException();
    }
    if (asset.unitCount <= request.splitAmount) {
      throw new BadRequestException();
    }
    asset.unitCount -= request.splitAmount;
    await this.databaseService.manager.save(asset);

    const newAsset = new Asset();
    newAsset.userId = asset.userId;
    newAsset.storeId = asset.storeId;
    newAsset.unitId = asset.unitId;
    newAsset.unitCount = request.splitAmount;
    await this.databaseService.manager.save(newAsset);

    await this.cloneAssetAttributesService.handle({
      fromAssetId: asset.id,
      toAssetId: newAsset.id,
    });
  }
}
