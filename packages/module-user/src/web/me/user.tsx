import { IconUser } from '@tabler/icons';
import { webModule } from '../module';

webModule.mePages.push({
  label: (t) => t('roles'),
  path: '/info',
  icon: IconUser,
  element: <div>testsdf</div>,
});
