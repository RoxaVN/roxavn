---
to: src/server/services/<%= h.changeCase.dot(api_source_name) %>.ts
---
import { InferApiRequest } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { <%= h.changeCase.camel(api_source_name) %>Api } from '../../base/index.js';
import { <%= h.changeCase.pascal(api_source_name) %> } from '../entities/index.js';
import { serverModule } from '../module.js';
