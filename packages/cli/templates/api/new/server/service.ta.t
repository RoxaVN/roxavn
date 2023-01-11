---
to: src/server/services/<%= h.changeCase.dot(api_name) %>.ts
---
import {
  AuthApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';

import { <%= h.changeCase.camel(api_name) %>Api } from '../../share';
import { serverModule } from '../module';

@serverModule.useApi(<%= h.changeCase.camel(api_name) %>Api)
export class <%= api_name %>ApiService extends AuthApiService<typeof <%= h.changeCase.camel(api_name) %>Api> {
  async handle(request: InferAuthApiRequest<typeof <%= h.changeCase.camel(api_name) %>Api>) {
    
  }
}