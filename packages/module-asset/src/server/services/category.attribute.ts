import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { CategoryAttribute } from '../entities/category.attribute.entity.js';

@serverModule.injectable()
export class CreateCategoryAttributeService extends InjectDatabaseService {
  async handle(request: { categoryId: string; attributeId: string }) {
    const categoryAttribute = new CategoryAttribute();
    categoryAttribute.attributeId = request.attributeId;
    categoryAttribute.categoryId = request.categoryId;

    await this.entityManager.save(categoryAttribute);
    return { id: categoryAttribute.id };
  }
}

@serverModule.injectable()
export class DeleteCategoryAttributeService extends InjectDatabaseService {
  async handle(request: { categoryId: string; attributeId: string }) {
    await this.entityManager.getRepository(CategoryAttribute).delete({
      categoryId: request.categoryId,
      attributeId: request.attributeId,
    });
    return {};
  }
}
