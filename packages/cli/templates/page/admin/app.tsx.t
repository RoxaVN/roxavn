---
to: src/web/pages/admin/app/{moduleName}/$.tsx
unless_exists: true
---
import { webModule } from '../../../../module';
import '../../../../admin';

export default webModule.makeAdminPages();
