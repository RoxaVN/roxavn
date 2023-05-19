import { ServerModule } from '@roxavn/core/server';

import { baseModule } from '../base/index.js';

const serverModule = ServerModule.fromBase(baseModule);

export { serverModule };
