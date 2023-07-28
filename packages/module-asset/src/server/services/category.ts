import { NotFoundException } from '@roxavn/core';
import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { Category } from '../entities/index.js';

@serverModule.injectable()
export class CreateCategoryService extends InjectDatabaseService {
  async handle(request: { name: string; parentId?: string }) {
    let parents;
    if (request.parentId) {
      const parent = await this.entityManager.getRepository(Category).findOne({
        where: { id: request.parentId },
      });
      if (parent) {
        if (parent.parents) {
          parents = [...parent.parents, parent.id];
        } else {
          parents = [parent.id];
        }
      } else {
        throw new NotFoundException();
      }
    }
    const category = new Category();
    category.name = request.name;
    category.parentId = request.parentId;
    category.parents = parents;

    await this.entityManager.save(category);
  }
}

@serverModule.injectable()
export class UpdateCategoryService extends InjectDatabaseService {
  async handle(request: {
    id: string;
    name: string;
    metadate?: Record<string, any>;
  }) {
    await this.entityManager
      .getRepository(Category)
      .update(
        { id: request.id },
        { name: request.name, metadata: request.metadate }
      );
    return {};
  }
}
