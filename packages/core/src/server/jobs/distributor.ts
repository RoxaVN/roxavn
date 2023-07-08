import { autoBind } from '../services/base.js';

import { EventDistributor } from '../events/distributor.js';

@autoBind()
export class JobDistributor extends EventDistributor {}
