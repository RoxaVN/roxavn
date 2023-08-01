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
export class UpdateAssetAttributeService extends InjectDatabaseService {
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

@serverModule.injectable()
export class GetAssetAttributesService extends BaseService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
    @inject(GetAttributesService)
    private getAttributesService: GetAttributesService
  ) {
    super();
  }

  async handle(request: { assetId: string }) {
    const items = await this.databaseService.manager
      .getRepository(AssetAttribute)
      .find({
        where: {
          assetId: request.assetId,
        },
      });

    const attributeIds = items.map((item) => item.attributeId);
    const attributes = await this.getAttributesService.handle({
      ids: attributeIds,
    });

    return items.map((item) => {
      const attribute = attributes.find(
        (attr) => attr.id === item.attributeId
      ) as Attribute;
      return {
        id: item.id,
        attributeId: item.attributeId,
        updatedDate: item.updatedDate,
        metadata: item.metadata,
        type: attribute.type,
        value: item[`value${attribute.type}`],
      };
    });
  }
}

@serverModule.injectable()
export class CloneAssetAttributesService extends InjectDatabaseService {
  async handle(request: { fromAssetId: string; toAssetId: string }) {
    const items = await this.databaseService.manager
      .getRepository(AssetAttribute)
      .find({
        where: { assetId: request.fromAssetId },
      });

    await this.databaseService.manager
      .createQueryBuilder()
      .insert()
      .into(AssetAttribute)
      .values(
        items.map((item) => {
          const values: any = {};
          Object.entries(item).map(([key, value]) => {
            if (key.startsWith('value') && value !== undefined) {
              values[key] = value;
            }
          });

          return {
            assetId: request.toAssetId,
            attributeId: item.attributeId,
            ...values,
          };
        })
      )
      .execute();
  }
}
