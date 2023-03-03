---
to: src/web/pages/me/{moduleName}/$.tsx
unless_exists: true
---
import { webModule } from '../../../module';
import '../../../me';

export default webModule.makeMePages();
