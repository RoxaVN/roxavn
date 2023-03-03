import { IconUser } from '@tabler/icons';
import { webModule } from '../module';

webModule.mePages.push({
  label: (t) => t('roles'),
  path: '/test',
  icon: IconUser,
  element: <div>testsdf</div>,
});
