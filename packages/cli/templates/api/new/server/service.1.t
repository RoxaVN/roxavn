---
to: src/server/services/<%= h.changeCase.dot(api_source_name) %>.ts
---
import { InferApiRequest } from '@roxavn/core/base';
import { BaseService } from '@roxavn/core/server';

import { <%= h.changeCase.camel(api_source_name) %>Api } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(<%= h.changeCase.camel(api_source_name) %>Api.getOne)
export class Get<%= h.changeCase.pascal(api_source_name) %>ApiService extends BaseService {
  async handle(request: InferApiRequest<typeof <%= h.changeCase.camel(api_source_name) %>Api.getOne>) {
    
  }
}
