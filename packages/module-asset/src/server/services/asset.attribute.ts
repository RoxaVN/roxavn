import { NotFoundException } from '@roxavn/core/base';
import {
  BaseService,
  DatabaseService,
  InjectDatabaseService,
  inject,
} from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { AssetAttribute, Attribute } from '../entities/index.js';
import { GetAttributesService } from './attribute.js';

@serverModule.injectable()
export class CreateAssetAttributesService extends BaseService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
    @inject(GetAttributesService)
    private getAttributesService: GetAttributesService
  ) {
    super();
  }

  async handle(request: {
    assetId: string;
    assetAttributes: Array<{
      attributeId: string;
      value: any;
    }>;
  }) {
    const attributeIds = request.assetAttributes.map(
      (assetAttribute) => assetAttribute.attributeId
    );
    const attributes = await this.getAttributesService.handle({
      ids: attributeIds,
    });

    await this.databaseService.manager
      .createQueryBuilder()
      .insert()
      .into(AssetAttribute)
      .values(
        request.assetAttributes.map((assetAttribute) => {
          const attribute = attributes.find(
            (attribute) => attribute.id === assetAttribute.attributeId
          ) as Attribute;
          return {
            [`value${attribute.type}`]: assetAttribute.value,
            assetId: request.assetId,
            attributeId: assetAttribute.attributeId,
          };
        })
      )
      .execute();
  }
}

@serverModule.injectable()
export class UpdateAssetAttributesService extends InjectDatabaseService {
  async handle(request: { assetAttributeId: string; value: any }) {
    const assetAttribute = await this.entityManager
      .getRepository(AssetAttribute)
      .findOne({
        relations: ['attribute'],
        select: ['id', 'attribute'],
        where: { id: request.assetAttributeId },
      });

    if (assetAttribute) {
      await this.entityManager
        .createQueryBuilder()
        .update(AssetAttribute)
        .set({
          [`value${assetAttribute.attribute.type}`]: request.value,
        })
        .where({ id: request.assetAttributeId })
        .execute();
      return {};
    }

    throw new NotFoundException();
  }
}
