---
to: src/web/module.ts
sh: npx roxavn sync
---
import { WebModule } from '@roxavn/core/web';
import { baseModule } from '../share';

const webModule = WebModule.fromBase(baseModule);

export { webModule };
