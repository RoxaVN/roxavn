import { InferApiRequest, NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { translationApi } from '../../base/index.js';
import { serverModule } from '../module.js';
import { Translation } from '../entities/translation.entity.js';

@serverModule.useApi(translationApi.getOne)
export class GetTranslationApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof translationApi.getOne>) {
    const translation = await this.entityManager
      .getRepository(Translation)
      .findOne({
        cache: true,
        where: { id: request.translationId },
      });
    if (translation) {
      return translation;
    }
    throw new NotFoundException();
  }
}

@serverModule.useApi(translationApi.getMany)
export class GetTranslationsApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof translationApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(Translation)
      .findAndCount({
        where: {
          key: request.key,
          lang: request.lang,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(translationApi.create)
export class CreateTranslationApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof translationApi.create>) {
    const translation = new Translation();
    translation.key = request.key;
    translation.lang = request.lang;
    translation.content = request.content;

    await this.entityManager.save(translation);
    return { id: translation.id };
  }
}

@serverModule.useApi(translationApi.update)
export class UpdateTranslationApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof translationApi.update>) {
    await this.entityManager
      .getRepository(Translation)
      .update(
        { id: request.translationId },
        { content: request.content, key: request.key, lang: request.lang }
      );
    return {};
  }
}

@serverModule.useApi(translationApi.delete)
export class DeleteTranslationApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof translationApi.delete>) {
    await this.entityManager
      .getRepository(Translation)
      .delete({ id: request.translationId });
    return {};
  }
}

@serverModule.injectable()
export class GetTranslationsbyKeyService extends InjectDatabaseService {
  async handle(request: { key: string; lang?: string }) {
    const translation = await this.entityManager
      .getRepository(Translation)
      .findOne({
        where: { key: request.key, lang: request.lang },
      });
    if (translation) {
      return translation;
    }
    throw new NotFoundException();
  }
}
