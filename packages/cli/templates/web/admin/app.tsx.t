---
to: src/web/pages/admin/apps/{moduleName}/$.tsx
unless_exists: true
---
import { webModule } from '../../../../module.js';
import * as pages from '../../../../admin/index.js';

export default webModule.makeAdminPages(pages);
