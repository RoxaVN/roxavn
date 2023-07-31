import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { BaseService, DatabaseService, inject } from '@roxavn/core/server';
import { In } from 'typeorm';

import { storeAssetApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { Asset } from '../entities/index.js';
import { GetAttributesService } from './attribute.js';

@serverModule.useApi(storeAssetApi.getMany)
export class GetStoreAssetsApiService extends BaseService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
    @inject(GetAttributesService)
    private getAttributesService: GetAttributesService
  ) {
    super();
  }

  async handle(request: InferApiRequest<typeof storeAssetApi.getMany>) {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    const [items, totalItems] = await this.databaseService.manager
      .getRepository(Asset)
      .findAndCount({
        relations: ['assetAttributes'],
        where: {
          storeId: request.storeId,
          assetAttributes: request.attributeIds
            ? {
                attributeId: In(request.attributeIds),
              }
            : undefined,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    const attributeIds = items
      .map((item) =>
        item.assetAttributes.map((assetAttribute) => assetAttribute.attributeId)
      )
      .flat();
    const attributes = await this.getAttributesService.handle({
      ids: attributeIds,
    });

    return {
      items: items.map((item) => ({
        ...item,
        assetAttributes: item.assetAttributes.map((assetAttribute) => {
          const attribute = attributes.find((item) => item.id);
          if (attribute) {
            return {
              id: assetAttribute.id,
              name: attribute.name,
              value: assetAttribute[`value${attribute.type}`],
            };
          }
          throw new NotFoundException();
        }),
      })),
      pagination: { page, pageSize, totalItems },
    };
  }
}
