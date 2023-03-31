import { ServerModule } from '@roxavn/core/server';

import { baseModule } from '../base';
import * as entities from './entities';

const serverModule = ServerModule.fromBase(baseModule, entities);

export { serverModule };
