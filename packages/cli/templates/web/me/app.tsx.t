---
to: src/web/pages/me/{moduleName}/$.tsx
unless_exists: true
---
import { webModule } from '../../../module.js';
import * as pages from '../../../me/index.js';

export default webModule.makeMePages(pages);
