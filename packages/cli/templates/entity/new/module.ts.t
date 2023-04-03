---
to: src/server/module.ts
force: true
---
import { ServerModule } from '@roxavn/core/server';

import { baseModule } from '../base';
import * as entities from './entities';

export const serverModule = ServerModule.fromBase(baseModule, { entities });
