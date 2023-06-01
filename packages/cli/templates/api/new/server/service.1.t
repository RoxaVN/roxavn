---
to: src/server/services/<%= h.changeCase.dot(api_source_name) %>.ts
---
import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';

import { <%= h.changeCase.camel(api_source_name) %>Api } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(<%= h.changeCase.camel(api_source_name) %>Api.getOne)
export class <%= api_source_name %>ApiService extends ApiService {
  async handle(request: InferApiRequest<typeof <%= h.changeCase.camel(api_source_name) %>Api.getOne>) {
    
  }
}
