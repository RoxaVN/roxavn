import { rootLoader, rootMeta } from '@roxavn/dev-web/server';
import { createRoot } from '@roxavn/dev-web/web';
import * as initModules from './init.modules.js';

export const loader = rootLoader;
export const meta = rootMeta;
export default createRoot({ initModules });
