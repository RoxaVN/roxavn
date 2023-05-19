import { ServerModule } from '@roxavn/core/server';

import { baseModule } from '../base/index.js';
import * as entities from './entities/index.js';

const serverModule = ServerModule.fromBase(baseModule, { entities });

export { serverModule };
