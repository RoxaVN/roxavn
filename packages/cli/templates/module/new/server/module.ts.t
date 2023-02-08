---
to: src/server/module.ts
---
import { ServerModule } from '@roxavn/core/server';

import { baseModule } from '../base';

const serverModule = ServerModule.fromBase(baseModule);

export { serverModule };
