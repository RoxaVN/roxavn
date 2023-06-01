---
to: src/server/module.ts
---
import { ServerModule } from '@roxavn/core/server';

import { baseModule } from '../base/index.js';

export const serverModule = ServerModule.fromBase(baseModule);
