---
to: src/web/pages/apps/{moduleName}/$.tsx
unless_exists: true
---
import { webModule } from '../../../module';
import * as pages from '../../../app';

export default webModule.makeAppPages(pages);
