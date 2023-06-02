import {
  ApiSource,
  ExactProps,
  IsOptional,
  Min,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { scopes } from '../access.js';

const moduleSource = new ApiSource<{
  name: string;
  version: string;
  author: string;
  roxavn: Record<string, any>;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}>([scopes.ModuleInfo], baseModule);

class GetModulesRequest extends ExactProps<GetModulesRequest> {
  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;
}

export const moduleApi = {
  getMany: moduleSource.getMany({
    validator: GetModulesRequest,
  }),
};
