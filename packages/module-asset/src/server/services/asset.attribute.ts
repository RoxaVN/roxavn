import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { AssetAttribute } from '../entities/asset.attribute.entity.js';

@serverModule.injectable()
export class CreateAssetAttributesService extends InjectDatabaseService {
  async handle(request: {
    assetId: string;
    attributes: Array<{
      attributeId: string;
      valueDate?: Date;
      valueInt?: number;
      valueDecimal?: number;
      valueText?: string;
      valueVarchar?: string;
    }>;
  }) {
    await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(AssetAttribute)
      .values(
        request.attributes.map((attribute) => ({
          ...attribute,
          assetId: request.assetId,
        }))
      )
      .execute();
  }
}

@serverModule.injectable()
export class UpdateAssetAttributesService extends InjectDatabaseService {
  async handle(request: {
    id: string;
    valueDate?: Date;
    valueInt?: number;
    valueDecimal?: number;
    valueText?: string;
    valueVarchar?: string;
  }) {
    const { id, ...values } = request;
    await this.entityManager
      .createQueryBuilder()
      .update(AssetAttribute)
      .set(values)
      .where({ id })
      .execute();
    return {};
  }
}
