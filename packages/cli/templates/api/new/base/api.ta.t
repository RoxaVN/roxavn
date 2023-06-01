---
to: src/base/apis/<%= h.changeCase.dot(api_source_name) %>.ts
---
import { ApiSource, ExactProps, MinLength } from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { scopes } from '../access.js';

const <%= api_source_name %>Source = new ApiSource<{}>(
  [scopes.<%= h.changeCase.pascal(api_source_name) %>],
  baseModule
);

class Get<%= h.changeCase.pascal(api_source_name) %>Request extends ExactProps<Get<%= h.changeCase.pascal(api_source_name) %>Request> {
  @MinLength(1)
  public readonly name!: string;
}

export const <%= api_source_name %>Api = {
  getOne: <%= api_source_name %>Source.getOne({
    validator: Get<%= h.changeCase.pascal(api_source_name) %>Request,
  }),
};
