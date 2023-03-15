---
to: src/web/module.ts
sh: npx roxavn sync && npm i
---
import { WebModule } from '@roxavn/core/web';
import { baseModule } from '../base';

export const webModule = WebModule.fromBase(baseModule);
