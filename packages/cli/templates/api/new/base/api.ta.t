---
to: src/base/apis/<%= h.changeCase.dot(api_source_name) %>.ts
---
import { ApiSource, ExactProps } from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

const <%= api_source_name %>Source = new ApiSource<{}>(
  [scopes.<%= h.changeCase.pascal(api_source_name) %>],
  baseModule
);

export const <%= api_source_name %>Api = {
};
