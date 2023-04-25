import { createRoot, meta, loader } from '@roxavn/dev-web/web';

import * as initModules from './init.modules';

export default createRoot({ initModules });
export { meta, loader };
