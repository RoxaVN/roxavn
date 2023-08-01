---
to: src/web/module.ts
sh: npx @roxavn/cli sync && npm i
---
import { WebModule } from '@roxavn/core/web';
import { baseModule } from '../base/index.js';

export const webModule = WebModule.fromBase(baseModule);
