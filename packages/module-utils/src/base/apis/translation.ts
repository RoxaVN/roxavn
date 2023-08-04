import {
  ApiSource,
  ExactProps,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

const translationSource = new ApiSource<{
  id: string;
  key: string;
  lang: string;
  content: string;
  updatedDate: Date;
}>([scopes.Translation], baseModule);

class GetTranslationRequest extends ExactProps<GetTranslationRequest> {
  @MinLength(1)
  public readonly translationId: string;
}

class GetTranslationsRequest extends ExactProps<GetTranslationsRequest> {
  @IsOptional()
  public readonly key: string;

  @IsOptional()
  public readonly lang: string;

  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;

  @Min(1)
  @Max(100)
  @TransformNumber()
  @IsOptional()
  public readonly pageSize?: number;
}

class CreateTranslationRequest extends ExactProps<CreateTranslationRequest> {
  @MinLength(1)
  @MaxLength(256)
  public readonly key: string;

  @MinLength(1)
  @MaxLength(16)
  public readonly lang: string;

  @MinLength(1)
  public readonly content: string;
}

class UpdateTranslationRequest extends ExactProps<UpdateTranslationRequest> {
  @MinLength(1)
  public readonly translationId: string;

  @MinLength(1)
  @MaxLength(256)
  @IsOptional()
  public readonly key?: string;

  @MinLength(1)
  @MaxLength(16)
  @IsOptional()
  public readonly lang?: string;

  @MinLength(1)
  @IsOptional()
  public readonly content?: string;
}

class DeleteTranslationRequest extends ExactProps<DeleteTranslationRequest> {
  @MinLength(1)
  public readonly translationId: string;
}

export const translationApi = {
  create: translationSource.create({
    validator: CreateTranslationRequest,
    permission: permissions.CreateTranslation,
  }),
  getOne: translationSource.getOne({
    validator: GetTranslationRequest,
    permission: permissions.ReadTranslation,
  }),
  getMany: translationSource.getMany({
    validator: GetTranslationsRequest,
    permission: permissions.ReadTranslations,
  }),
  update: translationSource.update({
    validator: UpdateTranslationRequest,
    permission: permissions.UpdateTranslation,
  }),
  delete: translationSource.delete({
    validator: DeleteTranslationRequest,
    permission: permissions.DeleteTranslation,
  }),
};
