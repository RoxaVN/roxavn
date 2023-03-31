import { ModuleT } from '@roxavn/core/web';
import { IconInbox } from '@tabler/icons-react';

import { webModule } from '../../module';

export default webModule.makeAppPages([
  {
    label: <ModuleT module={webModule} k="projects" />,
    path: '',
    icon: IconInbox,
  },
]);
