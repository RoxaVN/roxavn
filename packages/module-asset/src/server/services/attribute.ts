import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { Attribute, AttributeType } from '../entities/index.js';

@serverModule.injectable()
export class CreateAttributeService extends InjectDatabaseService {
  async handle(request: { name: string; type: AttributeType }) {
    const attribute = new Attribute();
    attribute.name = request.name;
    attribute.type = request.type;

    await this.entityManager.save(attribute);
    return { id: attribute.id };
  }
}

@serverModule.injectable()
export class UpdateAttributeService extends InjectDatabaseService {
  async handle(request: {
    attributeId: string;
    name: string;
    type: AttributeType;
    metadate?: Record<string, any>;
  }) {
    await this.entityManager
      .getRepository(Attribute)
      .update(
        { id: request.attributeId },
        { name: request.name, metadata: request.metadate, type: request.type }
      );
    return {};
  }
}
